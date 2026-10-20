import { computed, reactive, type ComputedRef } from 'vue';
import type {
  AddressStrings,
  BreadcrumbsStrings,
  ComboboxStrings,
  DiscountCodeStrings,
  FileUploadStrings,
  FilterChipsStrings,
  FormStrings,
  GalleryStrings,
  MetricStrings,
  NavStrings,
  NoticeStrings,
  OrderSummaryStrings,
  PaginationStrings,
  PriceRangeStrings,
  PriceStrings,
  ProductCardStrings,
  QuantityStepperStrings,
  RatingStrings,
  ReviewSummaryStrings,
  ReviewStrings,
  SearchBoxStrings,
  ShellStrings,
  StepsStrings,
  TableStrings,
  TabsStrings,
  TagStrings,
  TextareaStrings,
  ToasterStrings,
} from './components';

/**
 * Shop-wide settings: the locale for numbers and money, the currency, and translations of every built-in phrase.
 * Call `configure()` once before mounting (or any time — components follow the change).
 * A component's own `strings` prop still wins over what is configured here.
 */
export interface QuietConfig {
  locale: string;
  currency: string;
  strings: Record<string, Record<string, unknown> | undefined>;
}

const config = reactive<QuietConfig>({ locale: 'en', currency: 'EUR', strings: {} });

/** Translations of the built-in phrases, by namespace. Each namespace is merged into what is there. */
export interface QuietStrings {
  form?: FormStrings;
  combobox?: ComboboxStrings;
  table?: TableStrings;
  pagination?: PaginationStrings;
  input?: { clear?: string };
  dialog?: { close?: string };
  shell?: ShellStrings;
  nav?: NavStrings;
  textarea?: TextareaStrings;
  toast?: ToasterStrings;
  upload?: FileUploadStrings;
  tabs?: TabsStrings;
  price?: PriceStrings;
  stepper?: QuantityStepperStrings;
  productCard?: ProductCardStrings;
  gallery?: GalleryStrings;
  breadcrumbs?: BreadcrumbsStrings;
  choice?: { soldOut?: string };
  steps?: StepsStrings;
  orderSummary?: OrderSummaryStrings;
  address?: AddressStrings;
  discount?: DiscountCodeStrings;
  search?: SearchBoxStrings;
  priceRange?: PriceRangeStrings;
  filterChips?: FilterChipsStrings;
  rating?: RatingStrings;
  reviewSummary?: ReviewSummaryStrings;
  review?: ReviewStrings;
  tag?: TagStrings;
  notice?: NoticeStrings;
  metric?: MetricStrings;
  [namespace: string]: object | undefined;
}

export interface ConfigureOptions {
  /** BCP 47 locale for numbers and money: "de-DE" formats 1240 as "1.240". */
  locale?: string;
  /** ISO currency code for Price and money() (default EUR). */
  currency?: string;
  /** Translations per namespace: { form: {...}, table: {...}, pagination: {...} }. Merged into what is there. */
  strings?: QuietStrings;
}

export function configure(options: ConfigureOptions = {}): Readonly<QuietConfig> {
  if (options.locale) config.locale = options.locale;
  if (options.currency) config.currency = options.currency;
  if (options.strings) {
    for (const ns of Object.keys(options.strings)) {
      config.strings[ns] = { ...config.strings[ns], ...options.strings[ns] };
    }
  }
  return config;
}

/** The live configuration (reactive). */
export function useConfig(): Readonly<QuietConfig> {
  return config;
}

/** Defaults ← configure({ strings: { [ns]: … } }) ← the component's own `strings` prop. */
export function useStrings<T extends object>(
  ns: string,
  defaults: T,
  own?: () => Partial<T> | undefined,
): ComputedRef<T> {
  return computed(() => ({ ...defaults, ...(config.strings[ns] as Partial<T> | undefined), ...own?.() }) as T);
}

/** A number in the configured locale: fmt(1240) → "1.240" in de-DE. */
export function fmt(n: number): string {
  return Number(n).toLocaleString(config.locale);
}

/** An amount in the configured locale and currency: money(79) → "79,00 €" in de-DE. */
export function money(amount: number, currency?: string): string {
  const cur = currency || config.currency || 'EUR';
  try {
    return new Intl.NumberFormat(config.locale, { style: 'currency', currency: cur }).format(amount);
  } catch {
    return `${cur} ${Number(amount).toFixed(2)}`;
  }
}

/** The currency symbol and whether it goes after the amount, for the locale: ["€", true] in de-DE. */
export function currencySymbol(currency?: string): { symbol: string; after: boolean } {
  const cur = currency || config.currency || 'EUR';
  try {
    const parts = new Intl.NumberFormat(config.locale, { style: 'currency', currency: cur }).formatToParts(1);
    const symbol = parts.find((p) => p.type === 'currency')?.value ?? cur;
    return { symbol, after: parts[parts.length - 1]?.type === 'currency' };
  } catch {
    return { symbol: cur, after: false };
  }
}

/** A rating or average with one decimal in the configured locale: 4.6 → "4,6" in de-DE. */
export function oneDecimal(n: number): string {
  return (Math.round(n * 10) / 10).toLocaleString(config.locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
