import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Pretvara hrvatski broj mobitela u wa.me format (npr. 0998722516 → 385998722516). */
export function toWhatsappNumber(phone: string): string {
  let digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `385${digits.slice(1)}`;
  return digits;
}

export function whatsappLink(phone: string, message?: string): string {
  const number = toWhatsappNumber(phone);
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${query}`;
}
