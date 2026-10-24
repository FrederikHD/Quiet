import { computed, hasInjectionContext, inject, reactive, type ComputedRef, type InjectionKey } from 'vue';
import type {
  AddressStrings,
  BreadcrumbsStrings,
  ComboboxStrings,
  DatePickerStrings,
  DialogStrings,
  DiscountCodeStrings,
  FileUploadStrings,
  FilterChipsStrings,
  FormStrings,
  GalleryStrings,
  InputStrings,
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
 * On a server, each app that installs the plugin has its own copy, so concurrent requests never share a language.
 */
export interface QuietConfig {
  locale: string;
  currency: string;
  strings: Record<string, Record<string, unknown> | undefined>;
}

// The shop's settings. In the browser there is one, shared by the app and by code outside components (a store calling
// money()). On a server, every app that installs the Quiet plugin gets its own copy (see createAppConfig), because one
// server process renders many requests at once, possibly in different languages.
const config = reactive<QuietConfig>({ locale: 'en', currency: 'EUR', strings: {} });
export const CONFIG_KEY: InjectionKey<QuietConfig> = Symbol('quiet-config');

/** The settings the current code sees: its app's inside a component (setup or render), else the shared ones. */
function current(): QuietConfig {
  return hasInjectionContext() ? inject(CONFIG_KEY, config) : config;
}

/**
 * The settings for an app that installs the plugin: the shared ones in the browser, a copy of them on a server, so
 * that `app.use(Quiet, { locale })` in one request doesn't change the language of another one rendering alongside.
 */
export function createAppConfig(): QuietConfig {
  if (typeof document !== 'undefined') return config;
  const strings = Object.fromEntries(Object.entries(config.strings).map(([ns, v]) => [ns, { ...v }]));
  return reactive<QuietConfig>({ locale: config.locale, currency: config.currency, strings });
}

/** Applies options to a configuration: locale and currency replace, each strings namespace merges. */
export function applyConfig(target: QuietConfig, options: ConfigureOptions): void {
  if (options.locale) target.locale = options.locale;
  if (options.currency) target.currency = options.currency;
  if (options.strings) {
    for (const ns of Object.keys(options.strings)) {
      target.strings[ns] = { ...target.strings[ns], ...options.strings[ns] };
    }
  }
}

/** Translations of the built-in phrases, by namespace. Each namespace is merged into what is there. */
export interface QuietStrings {
  form?: FormStrings;
  combobox?: ComboboxStrings;
  datePicker?: DatePickerStrings;
  table?: TableStrings;
  pagination?: PaginationStrings;
  input?: InputStrings;
  dialog?: DialogStrings;
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

/**
 * Sets the shop's locale, currency and translations. Called in a component's setup, it changes that component's app
 * (on a server: that request's); anywhere else, the shared settings.
 */
export function configure(options: ConfigureOptions = {}): Readonly<QuietConfig> {
  const target = current();
  applyConfig(target, options);
  return target;
}

/** The live configuration (reactive): the app's inside a component, else the shared one. */
export function useConfig(): Readonly<QuietConfig> {
  return current();
}

/** Defaults ← configure({ strings: { [ns]: … } }) ← the component's own `strings` prop. */
export function useStrings<T extends object>(
  ns: string,
  defaults: T,
  own?: () => Partial<T> | undefined,
): ComputedRef<T> {
  const cfg = current();
  return computed(() => ({ ...defaults, ...(cfg.strings[ns] as Partial<T> | undefined), ...own?.() }) as T);
}

/** A number in the configured locale: fmt(1240) → "1.240" in de-DE. */
export function fmt(n: number): string {
  return Number(n).toLocaleString(current().locale);
}

/** An amount in the configured locale and currency: money(79) → "79,00 €" in de-DE. */
export function money(amount: number, currency?: string): string {
  const { locale, currency: configured } = current();
  const cur = currency || configured || 'EUR';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: cur }).format(amount);
  } catch {
    return `${cur} ${Number(amount).toFixed(2)}`;
  }
}

/** The currency symbol and whether it goes after the amount, for the locale: ["€", true] in de-DE. */
export function currencySymbol(currency?: string): { symbol: string; after: boolean } {
  const { locale, currency: configured } = current();
  const cur = currency || configured || 'EUR';
  try {
    const parts = new Intl.NumberFormat(locale, { style: 'currency', currency: cur }).formatToParts(1);
    const symbol = parts.find((p) => p.type === 'currency')?.value ?? cur;
    return { symbol, after: parts[parts.length - 1]?.type === 'currency' };
  } catch {
    return { symbol: cur, after: false };
  }
}

/** A rating or average with one decimal in the configured locale: 4.6 → "4,6" in de-DE. */
export function oneDecimal(n: number): string {
  return (Math.round(n * 10) / 10).toLocaleString(current().locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
