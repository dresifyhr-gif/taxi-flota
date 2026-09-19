import webpush from "web-push";

import { createSupabaseAdminClient } from "@/lib/supabase";

const TABLE = "push_subscriptions";

export type BrowserSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export function getVapidPublicKey(): string | null {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || null;
}

function configureWebPush(): boolean {
  const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:admin@fleethub.hr",
    publicKey,
    privateKey,
  );
  return true;
}

export async function saveSubscription(sub: BrowserSubscription): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from(TABLE)
    .upsert(
      { endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
      { onConflict: "endpoint" },
    );
  if (error) throw error;
}

export async function deleteSubscription(endpoint: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  await supabase.from(TABLE).delete().eq("endpoint", endpoint);
}

type PushPayload = { title: string; body: string; url?: string };

async function sendToAllAdmins(payload: PushPayload): Promise<void> {
  if (!configureWebPush()) {
    console.warn("Push preskočen: VAPID ključevi nisu postavljeni.");
    return;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from(TABLE).select("endpoint, p256dh, auth");
  if (error || !data || data.length === 0) return;

  const body = JSON.stringify(payload);
  await Promise.all(
    data.map(async (row) => {
      try {
        await webpush.sendNotification(
          { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
          body,
        );
      } catch (err) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        // Pretplata više ne vrijedi → očisti je.
        if (statusCode === 404 || statusCode === 410) {
          await deleteSubscription(row.endpoint).catch(() => {});
        }
      }
    }),
  );
}

export async function notifyAdminsNewApplication(input: { fullName: string }): Promise<void> {
  await sendToAllAdmins({
    title: "Nova prijava vozača",
    body: `${input.fullName} se upravo prijavio/la. Otvori admin za detalje.`,
    url: "/admin/prijave",
  });
}

export async function notifyAdminsNewCallback(input: { fullName: string }): Promise<void> {
  await sendToAllAdmins({
    title: "Zahtjev za poziv",
    body: `${input.fullName} traži da ga/ju nazoveš. Otvori admin.`,
    url: "/admin/pozivi",
  });
}
