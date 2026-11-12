"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { ADMIN_COOKIE, SESSION_TTL_SECONDS, createSessionToken, verifySessionToken } from "@/lib/admin-auth";
import {
  getAdminSettings,
  setAdminLocked,
  setAdminPassword,
  updateAdminName,
  verifyPasswordHash,
} from "@/lib/admin-settings";
import {
  APPLICATION_STATUSES,
  deleteApplication,
  updateApplicationNote,
  updateApplicationStatus,
  type ApplicationStatus,
} from "@/lib/applications";
import {
  CALLBACK_STATUSES,
  deleteCallbacks,
  updateCallbacksNote,
  updateCallbacksStatus,
  type CallbackStatus,
} from "@/lib/callbacks";
import {
  createVehicle,
  deleteVehicle,
  slugify,
  updateVehicle,
  uploadVehicleImage,
  type VehicleInput,
} from "@/lib/vehicles";

function safeNext(next: string | null | undefined): string {
  return next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
}

/**
 * Je li admin trenutno dostupan pozivatelju?
 * - Otključan (is_locked = false) ili migracija nije pokrenuta → uvijek da.
 * - Zaključan → samo s valjanim session cookiejem (potpisan hashom lozinke).
 */
export async function isAdminAuthed(): Promise<boolean> {
  const settings = await getAdminSettings();
  if (!settings || !settings.is_locked || !settings.password_hash) return true;
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token, settings.password_hash);
}

async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }
}

export async function login(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  const settings = await getAdminSettings();

  // Bez postavljene lozinke nema što provjeravati — admin je otvoren.
  if (!settings || !settings.password_hash) {
    redirect(next);
  }

  const passwordOk = await verifyPasswordHash(password, settings.password_hash);
  const nameOk = name.length === 0 || name === settings.admin_name;
  if (!passwordOk || !nameOk) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const token = await createSessionToken(settings.password_hash);
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
    // Set in production (e.g. .flota-hr.com) so the session is readable
    // from obracun.flota-hr.com (FleetCalc). Leave unset for localhost.
    domain: process.env.ADMIN_COOKIE_DOMAIN || undefined,
  });

  redirect(next);
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// ── Postavke admina ──────────────────────────────────────────────────────────

export async function updateAdminNameAction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("admin_name") ?? "").trim();
  if (name.length < 2) {
    redirect("/admin/postavke?error=name");
  }
  await updateAdminName(name);
  revalidatePath("/admin/postavke");
  redirect("/admin/postavke?ok=name");
}

export async function updateAdminPasswordAction(formData: FormData) {
  await requireAdmin();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 6 || password !== confirm) {
    redirect("/admin/postavke?error=password");
  }
  await setAdminPassword(password);
  revalidatePath("/admin/postavke");
  redirect("/admin/postavke?ok=password");
}

export async function setLockAction(formData: FormData) {
  await requireAdmin();
  const lock = String(formData.get("lock") ?? "") === "1";
  const settings = await getAdminSettings();

  // Ne dopusti zaključavanje bez postavljene lozinke (inače lockout).
  if (lock && (!settings || !settings.has_password)) {
    redirect("/admin/postavke?error=nopassword");
  }

  await setAdminLocked(lock);
  revalidatePath("/admin/postavke");
  redirect(`/admin/postavke?ok=${lock ? "locked" : "unlocked"}`);
}

// ── Prijave ──────────────────────────────────────────────────────────────────

export async function setApplicationStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ApplicationStatus;
  if (!id || !APPLICATION_STATUSES.includes(status)) {
    redirect("/admin/prijave");
  }
  await updateApplicationStatus(id, status);
  revalidatePath("/admin/prijave");
  revalidatePath(`/admin/prijave/${id}`);
  redirect(`/admin/prijave/${id}`);
}

/** Promjena statusa iz liste prijava — ostaje na listi (uz očuvane filtere). */
export async function setApplicationStatusListAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ApplicationStatus;
  const back = safeNext(String(formData.get("redirectTo") ?? "/admin/prijave"));
  if (id && APPLICATION_STATUSES.includes(status)) {
    await updateApplicationStatus(id, status);
  }
  revalidatePath("/admin/prijave");
  revalidatePath("/admin");
  redirect(back);
}

export async function updateApplicationNoteAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  if (!id) redirect("/admin/prijave");
  await updateApplicationNote(id, note);
  revalidatePath(`/admin/prijave/${id}`);
  redirect(`/admin/prijave/${id}?ok=note`);
}

export async function deleteApplicationAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteApplication(id);
  revalidatePath("/admin/prijave");
  revalidatePath("/admin");
  redirect("/admin/prijave");
}

// ── Zahtjevi za poziv ─────────────────────────────────────────────────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Prima listu ID-eva (svi zahtjevi jedne osobe) i propušta samo valjane UUID-eve. */
function cleanIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  return ids.filter((id): id is string => typeof id === "string" && UUID_RE.test(id)).slice(0, 200);
}

/** Sprema status odmah na klik (bez „Spremi" gumba) — za sve zahtjeve te osobe. */
export async function saveCallbackStatus(ids: string[], status: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  const valid = cleanIds(ids);
  if (valid.length === 0 || !(CALLBACK_STATUSES as readonly string[]).includes(status)) {
    return { ok: false };
  }
  try {
    await updateCallbacksStatus(valid, status as CallbackStatus);
  } catch (e) {
    console.error("saveCallbackStatus failed", e);
    return { ok: false };
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

/** Sprema bilješku automatski — za sve zahtjeve te osobe. */
export async function saveCallbackNote(ids: string[], note: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  const valid = cleanIds(ids);
  if (valid.length === 0) return { ok: false };
  try {
    await updateCallbacksNote(valid, String(note ?? "").trim().slice(0, 2000));
  } catch (e) {
    console.error("saveCallbackNote failed", e);
    return { ok: false };
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

/** Briše sve zahtjeve jedne osobe (polje „id" sadrži ID-eve odvojene zarezom). */
export async function deleteCallbackAction(formData: FormData) {
  await requireAdmin();
  const ids = cleanIds(String(formData.get("id") ?? "").split(","));
  if (ids.length > 0) await deleteCallbacks(ids);
  revalidatePath("/admin", "layout");
  redirect("/admin/pozivi");
}

// ── Vozila ───────────────────────────────────────────────────────────────────

async function parseVehicleForm(formData: FormData): Promise<VehicleInput> {
  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();

  // Slike: zadrži postojeće (osim onih označenih za uklanjanje) + dodaj nove.
  const existing = formData.getAll("existingImages").map(String);
  const toRemove = new Set(formData.getAll("remove").map(String));
  const kept = existing.filter((url) => !toRemove.has(url));

  const files = formData
    .getAll("image")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded = await Promise.all(files.map((f) => uploadVehicleImage(f)));

  return {
    slug: slugify(slugRaw || title),
    title,
    price: String(formData.get("price") ?? "").trim(),
    location: String(formData.get("location") ?? "Zagreb").trim() || "Zagreb",
    transmission: String(formData.get("transmission") ?? "").trim(),
    fuel: String(formData.get("fuel") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    highlights: String(formData.get("highlights") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    images: [...kept, ...uploaded],
    is_published: formData.get("is_published") === "on",
    is_rented: formData.get("is_rented") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };
}

function vehicleErrorMessage(e: unknown): string {
  const msg = (e as { message?: string })?.message ?? String(e);
  return msg.slice(0, 200);
}

export async function createVehicleAction(formData: FormData) {
  await requireAdmin();
  try {
    const input = await parseVehicleForm(formData);
    await createVehicle(input);
  } catch (e) {
    console.error("createVehicle failed", e);
    redirect(`/admin/vozila/new?error=${encodeURIComponent(vehicleErrorMessage(e))}`);
  }
  revalidatePath("/admin/vozila");
  revalidatePath("/najam-vozila");
  redirect("/admin/vozila");
}

export async function updateVehicleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/vozila");
  try {
    const input = await parseVehicleForm(formData);
    await updateVehicle(id, input);
  } catch (e) {
    console.error("updateVehicle failed", e);
    redirect(`/admin/vozila/${id}?error=${encodeURIComponent(vehicleErrorMessage(e))}`);
  }
  revalidatePath("/admin/vozila");
  revalidatePath("/najam-vozila");
  redirect("/admin/vozila");
}

export async function deleteVehicleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/vozila");
  await deleteVehicle(id);
  revalidatePath("/admin/vozila");
  revalidatePath("/najam-vozila");
  redirect("/admin/vozila");
}
