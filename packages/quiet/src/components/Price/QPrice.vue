<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { money, useStrings } from '../../config';
import QBadge from '../Badge/QBadge.vue';

export interface PriceStrings {
  salePrice?: string;
  originalPrice?: string;
  from?: string;
  perUnit?: (amount: string, unit: string) => string;
  taxNote?: string;
  saving?: (pct: number) => string;
  savingLabel?: (pct: number) => string;
}
export interface PriceProps {
  /** The amount, as a number. */
  amount: number;
  /** The original price; above `amount` it shows as a sale (`sale` colour, the original struck through). */
  compareAt?: number;
  /** Adds a sale badge with the saving ("−25%"), when compareAt is above amount. */
  showSaving?: boolean;
  /** small (15/22) in cards and the cart, default (17/24), large (28/32) on the product page. */
  size?: 'small' | 'default' | 'large';
  /** "from 29,00 €" when variants differ in price. */
  from?: boolean;
  /** The price per unit German price law asks for: { amount: 4.98, per: '100 ml' }. */
  unitPrice?: { amount: number; per: string };
  /** true for "incl. VAT, plus shipping", or your own text (or the `tax-note` slot). */
  taxNote?: boolean | string;
  /** ISO code; default from configure({ currency }) (EUR). */
  currency?: string;
  /** Translations; or once for the shop with configure() under strings.price. */
  strings?: PriceStrings;
}

const props = withDefaults(defineProps<PriceProps>(), {
  compareAt: undefined,
  size: 'default',
  unitPrice: undefined,
  taxNote: undefined,
  currency: undefined,
  strings: undefined,
});
defineSlots<{ /** Your own tax note, e.g. with a link to shipping costs. */ 'tax-note'?(): unknown }>();

const slots = useSlots();
const strings = useStrings<Required<PriceStrings>>(
  'price',
  {
    salePrice: 'Sale price',
    originalPrice: 'Original price',
    from: 'from',
    perUnit: (amount, unit) => `${amount} / ${unit}`,
    taxNote: 'incl. VAT, plus shipping',
    saving: (pct) => `−${pct}%`,
    savingLabel: (pct) => `${pct}% off`,
  },
  () => props.strings,
);
// A sale price says so to screen readers: a strikethrough alone is silent.
const sale = computed(() => props.compareAt != null && props.compareAt > props.amount);
const pct = computed(() => (sale.value ? Math.round((1 - props.amount / props.compareAt!) * 100) : 0));
</script>

<template>
  <span :class="['q-price', `q-price--${size}`, sale && 'is-sale']">
    <span class="q-price__row">
      <span v-if="from" class="q-price__from">{{ strings.from }}</span>
      <span class="q-price__now">
        <span v-if="sale" class="q-visually-hidden">{{ `${strings.salePrice} ` }}</span>{{ money(amount, currency) }}
      </span>
      <s v-if="sale" class="q-price__was">
        <span class="q-visually-hidden">{{ `${strings.originalPrice} ` }}</span>{{ money(compareAt!, currency) }}
      </s>
      <QBadge v-if="sale && showSaving" tone="sale" class="q-price__saving">
        <span aria-hidden="true">{{ strings.saving(pct) }}</span><span class="q-visually-hidden">{{ strings.savingLabel(pct) }}</span>
      </QBadge>
    </span>
    <span v-if="unitPrice" class="q-price__unit">{{ strings.perUnit(money(unitPrice.amount, currency), unitPrice.per) }}</span>
    <span v-if="taxNote || slots['tax-note']" class="q-price__note">
      <slot name="tax-note">{{ taxNote === true ? strings.taxNote : taxNote }}</slot>
    </span>
  </span>
</template>
