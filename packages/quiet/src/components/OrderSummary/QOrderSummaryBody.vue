<script setup lang="ts">
// The lines, the extra (a DiscountCode) and the totals — the same folded or not. No items: no list, the totals alone.
import { computed } from 'vue';
import { money } from '../../config';
import QDescriptionList, { type DescriptionListItem } from '../DescriptionList/QDescriptionList.vue';
import QIcon from '../Icon/QIcon.vue';
import QPrice from '../Price/QPrice.vue';
import type { OrderSummaryItem, OrderSummaryRow, OrderSummaryStrings } from './types';

const props = defineProps<{
  id: string;
  items: OrderSummaryItem[];
  rows: OrderSummaryRow[];
  subtotal: number;
  total: number;
  currency?: string;
  showQuantity: 'auto' | 'always';
  strings: Required<OrderSummaryStrings>;
  hasExtra: boolean;
  hasNote: boolean;
}>();

const amountText = (r: OrderSummaryRow) =>
  r.amount === 0 && r.free !== false
    ? props.strings.free
    : r.amount! < 0
      ? `−${money(-r.amount!, props.currency)}`
      : money(r.amount!, props.currency);
const dlItems = computed<DescriptionListItem[]>(() => [
  { key: 'subtotal', term: props.strings.subtotal, description: money(props.subtotal, props.currency), numeric: true },
  ...props.rows.map((r, i) => ({ key: `r${i}`, term: r.label, description: '', numeric: true })),
  { key: 'total', term: props.strings.total, description: '', numeric: true, emphasis: true },
]);
</script>

<template>
  <div :id="id" class="q-summary__body">
    <ul v-if="items.length" class="q-summary__lines">
      <li v-for="(it, i) in items" :key="it.id ?? i" class="q-summary__line">
        <span class="q-summary__media">
          <img v-if="it.image?.src" :src="it.image.src" :alt="it.image.alt ?? ''" loading="lazy" decoding="async" />
          <QIcon v-else name="image" />
          <span v-if="(it.quantity ?? 1) > 1 || showQuantity === 'always'" class="q-summary__qty" aria-hidden="true">{{
            it.quantity ?? 1
          }}</span>
        </span>
        <span class="q-summary__info">
          <a v-if="it.href" class="q-summary__name" :href="it.href">{{ it.name }}</a>
          <span v-else class="q-summary__name">{{ it.name }}</span>
          <span v-if="it.variant" class="q-summary__variant">{{ it.variant }}</span>
          <span class="q-visually-hidden">{{ strings.quantity(it.quantity ?? 1) }}</span>
        </span>
        <QPrice
          :amount="it.price"
          :compare-at="it.compareAt"
          :currency="currency"
          size="small"
          class="q-summary__price"
        />
      </li>
    </ul>
    <div v-if="hasExtra" class="q-summary__extra"><slot /></div>
    <QDescriptionList layout="inline" :items="dlItems" class="q-summary__totals">
      <template v-for="(r, i) in rows" :key="i" #[`term-r${i}`]>
        <span class="q-summary__term"
          >{{ r.label }}<span v-if="r.detail" class="q-summary__detail">{{ r.detail }}</span></span
        >
      </template>
      <template v-for="(r, i) in rows" :key="i" #[`description-r${i}`]>
        <span :class="[r.amount != null && r.amount < 0 && 'q-summary__minus']">
          <span v-if="r.amount == null" class="q-summary__pending">{{ r.note ?? '—' }}</span>
          <template v-else>{{ amountText(r) }}</template>
        </span>
      </template>
      <template #description-total
        ><span class="q-summary__total">{{ money(total, currency) }}</span></template
      >
    </QDescriptionList>
    <p v-if="hasNote" class="q-summary__note"><slot name="tax-note" /></p>
  </div>
</template>
