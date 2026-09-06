export const ATTR_COOKIE = "lr_attr";
export const ATTR_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type Touch = {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  referrer: string;
  path: string;
  ts: string;
};

export type Attribution = {
  vid: string;
  first: Touch;
  last: Touch;
};

const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;

export function isShortLinkPath(pathname: string): boolean {
  return pathname === "/t" || pathname === "/t/" || pathname.startsWith("/t/");
}

export function touchFromRequest(url: URL, referrer: string): Touch | null {
  const params = url.searchParams;
  const short = isShortLinkPath(url.pathname);
  const slug = short
    ? url.pathname.replace(/^\/t\/?/, "").replace(/\/$/, "")
    : "";

  const source =
    params.get("utm_source") || params.get("src") || (short ? "threads" : "");
  const medium =
    params.get("utm_medium") ||
    (short ? (slug ? "post" : "profile") : "");
  const campaign = params.get("utm_campaign") || slug;
  const content = params.get("utm_content") || "";
  const term = params.get("utm_term") || "";
  const ref = referrer.slice(0, 200);

  if (!source && !medium && !campaign && !content && !term && !ref) {
    return null;
  }

  return {
    source,
    medium,
    campaign,
    content,
    term,
    referrer: ref,
    path: `${url.pathname}${url.search}`.slice(0, 300),
    ts: new Date().toISOString(),
  };
}

export function isSocialReferrer(referrer: string): boolean {
  const r = referrer.toLowerCase();
  return (
    r.includes("threads.com") ||
    r.includes("threads.net") ||
    r.includes("instagram.com") ||
    r.includes("l.instagram.com")
  );
}

export function parseAttribution(raw: string | undefined): Attribution | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Attribution;
    if (!data || typeof data.vid !== "string" || !data.first || !data.last) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function mergeAttribution(
  existing: Attribution | null,
  incoming: Touch,
  vid: string
): { attr: Attribution; isNewLanding: boolean } {
  if (!existing) {
    return {
      attr: { vid, first: incoming, last: incoming },
      isNewLanding: true,
    };
  }

  const campaignChanged =
    incoming.source !== existing.last.source ||
    incoming.campaign !== existing.last.campaign ||
    incoming.content !== existing.last.content;

  const tagged =
    Boolean(incoming.source || incoming.campaign || incoming.content);

  return {
    attr: {
      vid: existing.vid,
      first: existing.first,
      last: tagged ? incoming : existing.last,
    },
    isNewLanding: tagged && campaignChanged,
  };
}

export function stripeMetadata(attr: Attribution | null): Record<string, string> {
  if (!attr) return {};
  const out: Record<string, string> = { vid: attr.vid };
  for (const key of UTM_KEYS) {
    const first = attr.first[key];
    const last = attr.last[key];
    if (first) out[`first_utm_${key}`] = first.slice(0, 200);
    if (last) out[`last_utm_${key}`] = last.slice(0, 200);
  }
  if (attr.first.referrer) out.first_referrer = attr.first.referrer;
  if (attr.last.referrer) out.last_referrer = attr.last.referrer;
  return out;
}
