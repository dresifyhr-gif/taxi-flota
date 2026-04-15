import { Resend } from "resend";

import { getEnv } from "@/lib/env";

type EmailPayload = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  hasOwnCar: string;
  birthDate: string;
  oib: string;
  note?: string;
  idCardUrl: string;
  driverLicenseUrl: string;
  taxiDiplomaUrl: string;
  criminalRecordCertificateUrl: string;
  selfiePhotoUrl: string;
};

function createEmailHtml(payload: EmailPayload) {
  const escapeHtml = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <h2 style="margin-bottom: 16px;">Nova prijava vozača</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tbody>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Ime i prezime</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(payload.fullName)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Mobitel</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(payload.phone)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(payload.email)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Grad</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(payload.city)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Vlastiti auto</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(payload.hasOwnCar)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Datum rođenja</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(payload.birthDate)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>OIB</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(payload.oib)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Napomena</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(payload.note || "Nema napomene")}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Osobna iskaznica</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${payload.idCardUrl}">Otvori dokument</a></td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Vozačka dozvola</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${payload.driverLicenseUrl}">Otvori dokument</a></td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Taxi diploma</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${payload.taxiDiplomaUrl}">Otvori dokument</a></td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Uvjerenje o nekažnjavanju</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${payload.criminalRecordCertificateUrl}">Otvori dokument</a></td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Selfie fotografija</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${payload.selfiePhotoUrl}">Otvori dokument</a></td></tr>
        </tbody>
      </table>
    </div>
  `;
}

export async function sendAdminNotification(payload: EmailPayload) {
  const env = getEnv();
  const resend = new Resend(env.RESEND_API_KEY);

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: env.ADMIN_NOTIFICATION_EMAIL,
    subject: `Nova prijava vozača - ${payload.fullName}`,
    html: createEmailHtml(payload),
  });
}
