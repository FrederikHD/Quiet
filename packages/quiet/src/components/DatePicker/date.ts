// Calendar dates as ISO strings ("2026-10-24"), with no time and no time zone. The arithmetic runs on UTC midnights,
// so daylight-saving changes never shift a day.

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

/** The UTC timestamp of an ISO date, or null when it isn't a real date ("2026-02-30"). */
export function toTime(iso: string | null | undefined): number | null {
  const m = iso ? ISO.exec(iso) : null;
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = Date.UTC(y, mo - 1, d);
  const back = new Date(t);
  return back.getUTCFullYear() === y && back.getUTCMonth() === mo - 1 && back.getUTCDate() === d ? t : null;
}

export function fromParts(y: number, month: number, d: number): string {
  return `${String(y).padStart(4, '0')}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function fromTime(t: number): string {
  const x = new Date(t);
  return fromParts(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate());
}

/** Today on the device's own calendar. */
export function today(): string {
  const n = new Date();
  return fromParts(n.getFullYear(), n.getMonth(), n.getDate());
}

export function addDays(iso: string, days: number): string {
  return fromTime((toTime(iso) as number) + days * 86_400_000);
}

/** The same day some months on, or the month's last day when it is shorter: 31 January + 1 month → 28 February. */
export function addMonths(iso: string, months: number): string {
  const x = new Date(toTime(iso) as number);
  const first = new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth() + months, 1));
  const y = first.getUTCFullYear();
  const mo = first.getUTCMonth();
  return fromParts(y, mo, Math.min(x.getUTCDate(), daysIn(y, mo)));
}

export function daysIn(y: number, month: number): number {
  return new Date(Date.UTC(y, month + 1, 0)).getUTCDate();
}

/** 0 = Sunday … 6 = Saturday. */
export function weekday(iso: string): number {
  return new Date(toTime(iso) as number).getUTCDay();
}

/** The first day of the week where the locale is used: 0 = Sunday, 1 = Monday, 6 = Saturday. */
export function weekStart(locale: string): number {
  try {
    const l = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const first = (l.getWeekInfo?.() ?? l.weekInfo)?.firstDay;
    if (first) return first % 7;
    // Browsers without week info (Firefox): the regions that start on Sunday, Monday everywhere else.
    const region = l.maximize().region ?? '';
    if (['US', 'CA', 'MX', 'BR', 'JP', 'KR', 'TW', 'HK', 'IL', 'PH', 'IN', 'ZA', 'AU'].includes(region)) return 0;
    if (['AE', 'AF', 'BH', 'DZ', 'EG', 'IQ', 'IR', 'JO', 'KW', 'LY', 'OM', 'QA', 'SD', 'SY'].includes(region)) return 6;
  } catch {
    /* an unknown locale: Monday */
  }
  return 1;
}

type Order = ('day' | 'month' | 'year')[];

/** The order of day, month and year and the separator in the locale's short date: de-DE → day.month.year. */
export function dateShape(locale: string): { order: Order; separator: string } {
  const parts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(Date.UTC(2026, 9, 24));
  const order = parts
    .map((p) => p.type)
    .filter((t): t is Order[number] => t === 'day' || t === 'month' || t === 'year');
  const separator = parts.find((p) => p.type === 'literal')?.value ?? '/';
  return { order: order.length === 3 ? order : ['day', 'month', 'year'], separator };
}

/** A date as the locale writes it, with two-digit day and month: "24.10.2026" in de-DE, "10/24/2026" in en-US. */
export function formatShort(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(
    toTime(iso) as number,
  );
}

/** "Saturday, 24 October 2026": the name of a day in the calendar, for screen readers. */
export function formatFull(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' }).format(toTime(iso) as number);
}

/**
 * Reads a typed date in the locale's order: "24.10.2026", "24.10.26", "24/10/2026", "24102026", and ISO
 * "2026-10-24" in any locale. Two-digit years are 2000–2099. Null when it isn't a real date.
 */
export function parseDate(text: string, locale: string): string | null {
  const s = text.trim();
  if (!s) return null;
  if (ISO.test(s)) return toTime(s) == null ? null : s;
  const { order } = dateShape(locale);
  let nums: string[];
  if (/^\d+$/.test(s)) {
    // Digits only: two each for day and month, the rest for the year.
    if (s.length !== 6 && s.length !== 8) return null;
    const sizes = { day: 2, month: 2, year: s.length - 4 };
    nums = [];
    let at = 0;
    for (const part of order) {
      nums.push(s.slice(at, at + sizes[part]));
      at += sizes[part];
    }
  } else {
    nums = s.split(/[^\d]+/).filter(Boolean);
    if (nums.length !== 3) return null;
  }
  const v = { day: 0, month: 0, year: 0 };
  order.forEach((part, i) => (v[part] = Number(nums[i])));
  const yearText = nums[order.indexOf('year')];
  if (yearText.length === 2) v.year += 2000;
  else if (yearText.length !== 4) return null;
  const iso = fromParts(v.year, v.month - 1, v.day);
  return v.month >= 1 && v.day >= 1 && toTime(iso) != null ? iso : null;
}
