// Address formats per country: which parts show, in what order, what they're called, and how postcodes look.
import { useConfig } from '../../config';

export interface Address {
  country?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  line1?: string;
  line2?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  phone?: string;
}
export type AddressFieldKey = keyof Address;
export type AddressPartOption = 'optional' | 'required' | 'hidden';
export interface AddressFieldOptions {
  company?: AddressPartOption;
  line2?: AddressPartOption;
  phone?: AddressPartOption;
}
export interface AddressStrings {
  country?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  line1?: string;
  line2?: string;
  postalCode?: string;
  zip?: string;
  city?: string;
  town?: string;
  state?: string;
  phone?: string;
  phoneHint?: string;
  missing?: (label: string) => string;
  chooseCountry?: string;
  badPostal?: (label: string, example?: string) => string;
  noNumber?: string;
  badPhone?: string;
}
export interface AddressFormat {
  postal?: RegExp;
  example?: string;
  /** Digits only: the numeric keyboard on phones. */
  numeric?: boolean;
  /** Street addresses need a house number. */
  number?: boolean;
  layout?: 'us' | 'gb';
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
export const ADDRESS_STRINGS: Required<AddressStrings> = {
  country: 'Country',
  firstName: 'First name',
  lastName: 'Last name',
  company: 'Company',
  line1: 'Street and house number',
  line2: 'Apartment, floor, etc.',
  postalCode: 'Postcode',
  zip: 'ZIP code',
  city: 'City',
  town: 'Town or city',
  state: 'State',
  phone: 'Phone',
  phoneHint: 'Only used if the courier needs to reach you',
  missing: (label) => `Enter your ${lower(label)}`,
  chooseCountry: 'Choose a country',
  badPostal: (label, example) => `Enter a valid ${lower(label)}${example ? `, like ${example}` : ''}`,
  noNumber: 'Add the house number',
  badPhone: 'Enter a phone number with digits only, + and spaces',
};

export const addressFormats: Record<string, AddressFormat> = {
  DE: { postal: /^\d{5}$/, example: '10115', numeric: true, number: true },
  AT: { postal: /^\d{4}$/, example: '1010', numeric: true, number: true },
  CH: { postal: /^\d{4}$/, example: '8001', numeric: true, number: true },
  NL: { postal: /^\d{4} ?[A-Za-z]{2}$/, example: '1012 AB', number: true },
  BE: { postal: /^\d{4}$/, example: '1000', numeric: true, number: true },
  LU: { postal: /^(L-)?\d{4}$/, example: '1111', number: true },
  FR: { postal: /^\d{5}$/, example: '75001', numeric: true },
  IT: { postal: /^\d{5}$/, example: '00100', numeric: true },
  ES: { postal: /^\d{5}$/, example: '28001', numeric: true },
  DK: { postal: /^\d{4}$/, example: '1050', numeric: true, number: true },
  PL: { postal: /^\d{2}-\d{3}$/, example: '00-001', number: true },
  US: { postal: /^\d{5}(-\d{4})?$/, example: '10001', numeric: true, layout: 'us' },
  GB: { postal: /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/, example: 'SW1A 1AA', layout: 'gb' },
};

export const addressCountries: { value: string; label: string }[] = [
  { value: 'DE', label: 'Germany' },
  { value: 'AT', label: 'Austria' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'BE', label: 'Belgium' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'DK', label: 'Denmark' },
  { value: 'PL', label: 'Poland' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
];

export const AUTOCOMPLETE: Record<AddressFieldKey, string> = {
  country: 'country',
  firstName: 'given-name',
  lastName: 'family-name',
  company: 'organization',
  line1: 'address-line1',
  line2: 'address-line2',
  postalCode: 'postal-code',
  city: 'address-level2',
  state: 'address-level1',
  phone: 'tel',
};

/** Which parts show for a country, in order, and whether they're needed. Company, line 2 and phone are optional by default. */
export function addressParts(country: string | undefined, options?: AddressFieldOptions): { key: AddressFieldKey; required: boolean }[] {
  const fmt = addressFormats[country ?? ''] ?? {};
  const o: Required<AddressFieldOptions> = { company: 'optional', line2: 'optional', phone: 'optional', ...options };
  const list: AddressFieldKey[] = ['country', 'firstName', 'lastName'];
  if (o.company !== 'hidden') list.push('company');
  list.push('line1');
  if (o.line2 !== 'hidden') list.push('line2');
  if (fmt.layout === 'us') list.push('city', 'state', 'postalCode');
  else if (fmt.layout === 'gb') list.push('city', 'postalCode');
  else list.push('postalCode', 'city');
  if (o.phone !== 'hidden') list.push('phone');
  const optional: Partial<Record<AddressFieldKey, boolean>> = {
    company: o.company !== 'required',
    line2: o.line2 !== 'required',
    phone: o.phone !== 'required',
  };
  return list.map((key) => ({ key, required: !optional[key] }));
}

/** The label of a part in a country: "ZIP code" in the US, "Town or city" in the UK. */
export function addressLabel(key: AddressFieldKey, country: string | undefined, strings: Required<AddressStrings>): string {
  const layout = addressFormats[country ?? '']?.layout;
  if (key === 'postalCode') return layout === 'us' ? strings.zip : strings.postalCode;
  if (key === 'city') return layout === 'gb' ? strings.town : strings.city;
  return strings[key];
}

export interface AddressValidation {
  /** Per-field messages, for AddressFields' `errors`. */
  errors: Partial<Record<AddressFieldKey, string>>;
  /** For the Form's error summary: ids are `${idPrefix}-${key}`. */
  list: { id: string; message: string }[];
  valid: boolean;
}

/**
 * Checks an address: missing parts ("Enter your city"), a postcode in the wrong shape for its country,
 * no house number where addresses need one, a phone with letters in it.
 */
export function validateAddress(
  value: Address | null | undefined,
  options: { idPrefix?: string; fields?: AddressFieldOptions; strings?: AddressStrings } = {},
): AddressValidation {
  const config = useConfig();
  const strings = { ...ADDRESS_STRINGS, ...(config.strings.address as AddressStrings), ...options.strings } as Required<AddressStrings>;
  const v = value ?? {};
  const fmt = addressFormats[v.country ?? ''] ?? {};
  const prefix = options.idPrefix ?? 'address';
  const errors: AddressValidation['errors'] = {};
  const list: AddressValidation['list'] = [];
  for (const p of addressParts(v.country, options.fields)) {
    const val = String(v[p.key] ?? '').trim();
    const label = addressLabel(p.key, v.country, strings);
    let msg: string | null = null;
    if (p.key === 'country' && !val) msg = strings.chooseCountry;
    else if (p.required && !val) msg = strings.missing(label);
    else if (val && p.key === 'postalCode' && fmt.postal && !fmt.postal.test(val)) msg = strings.badPostal(label, fmt.example);
    else if (val && p.key === 'line1' && fmt.number && !/\d/.test(val)) msg = strings.noNumber;
    else if (val && p.key === 'phone' && !/^\+?[\d\s()/-]{6,}$/.test(val)) msg = strings.badPhone;
    if (msg) {
      errors[p.key] = msg;
      list.push({ id: `${prefix}-${p.key}`, message: msg });
    }
  }
  return { errors, list, valid: !list.length };
}
