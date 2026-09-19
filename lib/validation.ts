import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

function fileSchema(label: string) {
  return z
    .instanceof(File, { message: `${label} je obavezna.` })
    .refine((file) => file.size > 0, `${label} je obavezna.`)
    .refine((file) => file.size <= MAX_FILE_SIZE, `${label} smije biti do 10 MB.`)
    .refine(
      (file) => ACCEPTED_TYPES.includes(file.type),
      `${label} mora biti JPG, PNG ili PDF dokument.`,
    );
}

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Unesite ime i prezime."),
  phone: z
    .string()
    .trim()
    .min(8, "Unesite ispravan broj mobitela.")
    .max(30, "Broj mobitela je predugačak."),
  email: z.string().trim().email("Unesite ispravnu email adresu."),
  hoursPerDay: z.enum(["4", "8", "dodatan", "nisam-siguran"], {
    errorMap: () => ({ message: "Odaberite koliko sati želite raditi." }),
  }),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Potrebna je privola za obradu podataka." }),
  }),
  idCardFront: fileSchema("Osobna iskaznica — prednja strana"),
  idCardBack: fileSchema("Osobna iskaznica — zadnja strana"),
  website: z.string().max(0).optional(),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
