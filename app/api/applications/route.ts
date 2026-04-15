import { NextResponse } from "next/server";

import {
  buildDeduplicationHash,
  deleteApplicationByDeduplicationHash,
  deleteUploadedDocuments,
  findRecentDuplicate,
  persistApplication,
  uploadDocument,
} from "@/lib/applications";
import { sendAdminNotification } from "@/lib/email";
import { applicationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let uploadedPaths: string[] = [];
  let persistedHash: string | null = null;

  try {
    const formData = await request.formData();

    const parsed = applicationSchema.safeParse({
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      city: formData.get("city"),
      hasOwnCar: formData.get("hasOwnCar"),
      birthDate: formData.get("birthDate"),
      oib: formData.get("oib"),
      note: formData.get("note"),
      consent: formData.get("consent") === "true",
      idCard: formData.get("idCard"),
      driverLicense: formData.get("driverLicense"),
      taxiDiploma: formData.get("taxiDiploma"),
      criminalRecordCertificate: formData.get("criminalRecordCertificate"),
      selfiePhoto: formData.get("selfiePhoto"),
      website: formData.get("website"),
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];

      return NextResponse.json(
        {
          message: firstIssue?.message || "Provjeri unesene podatke i pokušaj ponovno.",
        },
        { status: 400 },
      );
    }

    const application = parsed.data;

    if (application.website) {
      return NextResponse.json({ message: "Prijava je zaprimljena." });
    }

    const deduplicationHash = buildDeduplicationHash({
      fullName: application.fullName,
      phone: application.phone,
      email: application.email,
      city: application.city,
      hasOwnCar: application.hasOwnCar,
      birthDate: application.birthDate,
      oib: application.oib,
      note: application.note,
    });

    const duplicate = await findRecentDuplicate(deduplicationHash);

    if (duplicate) {
      return NextResponse.json(
        {
          message: "Slična prijava je već zaprimljena u zadnja 24 sata. Ako trebaš pomoć, javi nam se kontaktom sa stranice.",
        },
        { status: 409 },
      );
    }

    const folder = `${application.oib}-${Date.now()}`;
    const [
      idCardUpload,
      driverLicenseUpload,
      taxiDiplomaUpload,
      criminalRecordCertificateUpload,
      selfiePhotoUpload,
    ] = await Promise.all([
      uploadDocument(application.idCard, folder),
      uploadDocument(application.driverLicense, folder),
      uploadDocument(application.taxiDiploma, folder),
      uploadDocument(application.criminalRecordCertificate, folder),
      uploadDocument(application.selfiePhoto, folder),
    ]);
    uploadedPaths = [
      idCardUpload.path,
      driverLicenseUpload.path,
      taxiDiplomaUpload.path,
      criminalRecordCertificateUpload.path,
      selfiePhotoUpload.path,
    ];

    await persistApplication({
      fullName: application.fullName,
      phone: application.phone,
      email: application.email,
      city: application.city,
      hasOwnCar: application.hasOwnCar,
      birthDate: application.birthDate,
      oib: application.oib,
      note: application.note,
      consentAcceptedAt: new Date().toISOString(),
      deduplicationHash,
      idCardPath: idCardUpload.path,
      driverLicensePath: driverLicenseUpload.path,
      taxiDiplomaPath: taxiDiplomaUpload.path,
      criminalRecordCertificatePath: criminalRecordCertificateUpload.path,
      selfiePhotoPath: selfiePhotoUpload.path,
    });
    persistedHash = deduplicationHash;

    await sendAdminNotification({
      fullName: application.fullName,
      phone: application.phone,
      email: application.email,
      city: application.city,
      hasOwnCar: application.hasOwnCar === "da" ? "Da" : "Ne",
      birthDate: application.birthDate,
      oib: application.oib,
      note: application.note,
      idCardUrl: idCardUpload.signedUrl,
      driverLicenseUrl: driverLicenseUpload.signedUrl,
      taxiDiplomaUrl: taxiDiplomaUpload.signedUrl,
      criminalRecordCertificateUrl: criminalRecordCertificateUpload.signedUrl,
      selfiePhotoUrl: selfiePhotoUpload.signedUrl,
    });

    return NextResponse.json({
      message: "Prijava je uspješno poslana. Javit ćemo ti se nakon pregleda podataka.",
    });
  } catch (error) {
    console.error("Application submission failed", error);

    if (persistedHash) {
      try {
        await deleteApplicationByDeduplicationHash(persistedHash);
      } catch (rollbackError) {
        console.error("Application rollback failed", rollbackError);
      }
    }

    if (uploadedPaths.length > 0) {
      try {
        await deleteUploadedDocuments(uploadedPaths);
      } catch (storageRollbackError) {
        console.error("Upload rollback failed", storageRollbackError);
      }
    }

    return NextResponse.json(
      {
        message: "Trenutno nismo uspjeli poslati prijavu. Pokušaj ponovno za nekoliko minuta.",
      },
      { status: 500 },
    );
  }
}
