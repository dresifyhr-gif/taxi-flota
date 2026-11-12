import { redirect } from "next/navigation";

// Online prijave više ne postoje — stari linkovi i spremljena prečica vode na pozive.
export default function PrijaveRedirect() {
  redirect("/admin/pozivi");
}
