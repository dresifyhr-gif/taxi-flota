import { z } from "zod";

const serverSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default("driver-documents"),
  SUPABASE_APPLICATIONS_TABLE: z.string().min(1).default("driver_applications"),
});

// Neke vrijednosti (npr. iz `vercel env pull`) znaju doći omotane navodnicima
// ili s razmakom; skidamo jedan sloj navodnika i trimamo prije validacije.
function clean(value: string | undefined): string | undefined {
  if (value == null) return value;
  let s = value.trim();
  if (
    s.length >= 2 &&
    ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

export function getEnv() {
  return serverSchema.parse({
    NEXT_PUBLIC_SITE_URL: clean(process.env.NEXT_PUBLIC_SITE_URL),
    NEXT_PUBLIC_SUPABASE_URL: clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: clean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    SUPABASE_STORAGE_BUCKET: clean(process.env.SUPABASE_STORAGE_BUCKET),
    SUPABASE_APPLICATIONS_TABLE: clean(process.env.SUPABASE_APPLICATIONS_TABLE),
  });
}
