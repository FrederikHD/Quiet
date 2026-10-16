export interface ComboboxOption {
  value: string;
  label: string;
  /** One line under the label, ink-muted: SKU and stock, an email. */
  description?: string;
  /** Right-aligned, tabular: price, rate, count. */
  meta?: string;
  /** A 32px thumbnail (image URL) or swatch colour (any CSS colour). */
  image?: string;
  swatch?: string;
  disabled?: boolean;
  /** Extra words that should match the search (static options only). */
  keywords?: string;
}

export interface ComboboxStrings {
  searchPlaceholder?: string;
  noResults?: (query: string) => string;
  showing?: (shown: number, total: number) => string;
  results?: (count: number) => string;
  loading?: string;
  error?: string;
  retry?: string;
  done?: string;
  clear?: string;
  remove?: (label: string) => string;
  more?: (count: number) => string;
  selected?: (count: number) => string;
}

/** Fetch options: called on open with "" and after typing stops. Return { options, total } (or an array). */
export type ComboboxSearch = (
  query: string,
  ctx: { signal?: AbortSignal },
) => Promise<{ options: ComboboxOption[]; total?: number } | ComboboxOption[]>;

export interface ComboboxResult {
  options: ComboboxOption[];
  total: number | null;
  status: 'idle' | 'loading' | 'done' | 'error';
}

/** Case- and accent-insensitive: "rhon" finds "Rhön". */
export function normalizeText(v: unknown): string {
  return String(v ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}
