import type { ImageSource } from '../../types';

export interface ComboboxOption {
  value: string;
  label: string;
  /** One line under the label, ink-muted: SKU and stock, an email. */
  description?: string;
  /** Right-aligned, tabular: price, rate, count. */
  meta?: string;
  /** A 32px thumbnail (decorative: the label names it). */
  image?: ImageSource;
  /** A colour swatch instead of an image (any CSS colour). */
  swatch?: string;
  /** Shown in ink-muted and can't be chosen; say why in the description. */
  disabled?: boolean;
  /** Extra words that should match the search (static options only). */
  keywords?: string;
}

export interface ComboboxStrings {
  /** Placeholder of the search field. Default "Search". */
  searchPlaceholder?: string;
  /** Default "No matches for “xyz”", or "Nothing to choose from" with no query. */
  noResults?: (query: string) => string;
  /** Default "Showing 50 of 1,240. Type to search for more." */
  showing?: (shown: number, total: number) => string;
  /** Default "16 results" ("1 result"). */
  results?: (count: number) => string;
  /** Default "Searching…". */
  loading?: string;
  /** Default "Couldn’t load the results.". */
  error?: string;
  /** The button after a failed fetch. Default "Try again". */
  retry?: string;
  /** Closes the phone Dialog. Default "Done". */
  done?: string;
  /** Name of the clear buttons. Default "Clear". */
  clear?: string;
  /** Name of a tag's remove button. Default "Remove Linen shirt". */
  remove?: (label: string) => string;
  /** After the visible tags. Default "+3 more". */
  more?: (count: number) => string;
  /** Read on the box with multiple: "3 selected" and the labels. */
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
