<script setup lang="ts">
import { computed } from 'vue';
import { useStrings } from '../../config';
import QFieldGroup from '../FieldGroup/QFieldGroup.vue';
import QAddressPart from './QAddressPart.vue';
import {
  ADDRESS_STRINGS,
  addressCountries,
  addressFormats,
  addressLabel,
  addressParts,
  type Address,
  type AddressFieldKey,
  type AddressFieldOptions,
  type AddressStrings,
} from './address';

export interface AddressFieldsProps {
  /** Per-field messages, e.g. from validateAddress(value).errors. */
  errors?: Partial<Record<AddressFieldKey, string>>;
  /** Ids are `${idPrefix}-${key}` (ship-postalCode), so the Form's error summary can jump to them. Default "address". */
  idPrefix?: string;
  /** Autocomplete group: shipping (default), billing, or none. */
  kind?: 'shipping' | 'billing' | 'none';
  /** Adds "section-<name>" to autocomplete, for two addresses of the same kind on one page. */
  section?: string;
  /** Which optional parts show: { company: 'hidden', phone: 'required' }. */
  fields?: AddressFieldOptions;
  countries?: { value: string; label: string }[];
  countryPlaceholder?: string;
  /** Default "Only used if the courier needs to reach you"; null for none. */
  phoneHint?: string | null;
  disabled?: boolean;
  strings?: AddressStrings;
}

const props = withDefaults(defineProps<AddressFieldsProps>(), {
  errors: () => ({}),
  idPrefix: 'address',
  kind: 'shipping',
  section: undefined,
  fields: undefined,
  countries: () => addressCountries,
  countryPlaceholder: undefined,
  phoneHint: undefined,
  strings: undefined,
});
/** The address. Updated as a whole, with the key that changed in `change`. */
const model = defineModel<Address>({ default: () => ({}) });
const emit = defineEmits<{ change: [next: Address, key: AddressFieldKey] }>();

const strings = useStrings<Required<AddressStrings>>('address', ADDRESS_STRINGS, () => props.strings);
const country = computed(() => model.value.country ?? '');
const layout = computed(() => addressFormats[country.value]?.layout);
const parts = computed(() => new Map(addressParts(country.value, props.fields).map((p) => [p.key, p])));
const autocompletePrefix = computed(
  () => (props.section ? `section-${props.section} ` : '') + (props.kind === 'billing' ? 'billing ' : props.kind === 'none' ? '' : 'shipping '),
);

function set(key: AddressFieldKey, value: string) {
  const next = { ...model.value, [key]: value };
  model.value = next;
  emit('change', next, key);
}
// Everything one part needs, or null when the country's format leaves it out.
function part(key: AddressFieldKey, width?: 'xs' | 's' | 'm' | 'l') {
  const p = parts.value.get(key);
  if (!p) return null;
  return {
    part: key,
    id: `${props.idPrefix}-${key}`,
    label: addressLabel(key, country.value, strings.value),
    required: p.required,
    value: model.value[key],
    country: country.value,
    error: props.errors[key],
    hint: key === 'phone' ? (props.phoneHint === undefined ? strings.value.phoneHint : (props.phoneHint ?? undefined)) : undefined,
    width,
    disabled: props.disabled,
    autocompletePrefix: autocompletePrefix.value,
    countries: props.countries,
    countryPlaceholder: props.countryPlaceholder,
    onChange: set,
  };
}
</script>

<template>
  <!-- Country first (it changes the rest), then the parts in the order that country writes them. -->
  <div class="q-address">
    <QAddressPart v-bind="part('country')!" />
    <QFieldGroup :columns="[1, 1]">
      <QAddressPart v-bind="part('firstName')!" />
      <QAddressPart v-bind="part('lastName')!" />
    </QFieldGroup>
    <QAddressPart v-if="part('company')" v-bind="part('company')!" />
    <QAddressPart v-bind="part('line1')!" />
    <QAddressPart v-if="part('line2')" v-bind="part('line2')!" />
    <template v-if="layout === 'us'">
      <QAddressPart v-bind="part('city')!" />
      <QFieldGroup :columns="[1, 1]" stack="late">
        <QAddressPart v-bind="part('state')!" />
        <QAddressPart v-bind="part('postalCode')!" />
      </QFieldGroup>
    </template>
    <template v-else-if="layout === 'gb'">
      <QAddressPart v-bind="part('city')!" />
      <QAddressPart v-bind="part('postalCode', 's')!" />
    </template>
    <QFieldGroup v-else :columns="[1, 2]" stack="late">
      <QAddressPart v-bind="part('postalCode')!" />
      <QAddressPart v-bind="part('city')!" />
    </QFieldGroup>
    <QAddressPart v-if="part('phone')" v-bind="part('phone')!" />
  </div>
</template>
