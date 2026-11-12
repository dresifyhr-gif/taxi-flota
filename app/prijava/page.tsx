import { redirect } from "next/navigation";

// Online prijava je ukinuta — svi kandidati idu kroz „Zatraži poziv".
export default function ApplicationPage() {
  redirect("/zatrazi-poziv");
}
