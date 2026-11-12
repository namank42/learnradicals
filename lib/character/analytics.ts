import { track } from "@vercel/analytics/server";

type Props = Record<string, string | number | boolean | null | undefined>;

/** Server-side funnel event (Vercel Analytics). Never throws: analytics must not break a download or a webhook. */
export async function serverTrack(name: string, props?: Props, req?: Request) {
  try {
    await track(name, props, req ? { request: req } : undefined);
  } catch (err) {
    console.error("[analytics]", name, err);
  }
}
