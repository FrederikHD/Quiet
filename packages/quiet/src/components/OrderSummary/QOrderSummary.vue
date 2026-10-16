<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { money, useStrings } from '../../config';
import { useMediaQuery } from '../../composables/useMediaQuery';
import { useQuietId } from '../../composables/useQuietId';
import QLead from '../../internal/QLead.vue';
import QDisclosure from '../Disclosure/QDisclosure.vue';
import QOrderSummaryBody from './QOrderSummaryBody.vue';
import type { OrderSummaryItem, OrderSummaryRow, OrderSummaryStrings } from './types';

export interface OrderSummaryProps {
  items: (OrderSummaryItem | null | false)[];
  /** Rows between Subtotal and Total: discount, shipping, … */
  totals?: (OrderSummaryRow | null | false)[];
  /** Defaults to the sum of the items' prices. */
  subtotal?: number;
  total: number;
  /** "Including 13,51 € VAT (19 %)" under the total. */
  taxNote?: string;
  currency?: string;
  /** Fold into a "Show order summary · total" button: always (true), never (false, default), or below `collapseBelow` px of viewport ('auto'). */
  collapsible?: boolean | 'auto';
  collapseBelow?: number;
  /** Default "Order summary"; null for no heading of its own (inside a Card that has one). */
  title?: string | null;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** 'always' puts the quantity on every image; by default only from 2 up. */
  showQuantity?: 'auto' | 'always';
  strings?: OrderSummaryStrings;
}

const props = withDefaults(defineProps<OrderSummaryProps>(), {
  totals: () => [],
  subtotal: undefined,
  taxNote: undefined,
  currency: undefined,
  collapsible: false,
  collapseBelow: 900,
  title: undefined,
  headingLevel: 2,
  showQuantity: 'auto',
  strings: undefined,
});
/** Folded: open or not. */
const open = defineModel<boolean>('open', { default: false });
defineSlots<{ /** Goes between the lines and the totals — a DiscountCode. */ default?(): unknown }>();

const slots = useSlots();
const strings = useStrings<Required<OrderSummaryStrings>>(
  'orderSummary',
  {
    title: 'Order summary',
    show: 'Show order summary',
    hide: 'Hide order summary',
    subtotal: 'Subtotal',
    total: 'Total',
    free: 'Free',
    quantity: (n) => `Quantity ${n}`,
    items: (n) => (n === 1 ? '1 item' : `${n} items`),
  },
  () => props.strings,
);
const id = useQuietId('q-summary-');
const narrow = useMediaQuery(() => `(max-width: ${props.collapseBelow - 1}px)`);
const folds = computed(() => props.collapsible === true || (props.collapsible === 'auto' && narrow.value));
const items = computed(() => props.items.filter((x): x is OrderSummaryItem => !!x));
const rows = computed(() => props.totals.filter((x): x is OrderSummaryRow => !!x));
const count = computed(() => items.value.reduce((a, it) => a + (it.quantity ?? 1), 0));
const subtotal = computed(() => props.subtotal ?? items.value.reduce((a, it) => a + it.price, 0));

const bodyProps = computed(() => ({
  id: `${id}-body`,
  items: items.value,
  rows: rows.value,
  subtotal: subtotal.value,
  total: props.total,
  taxNote: props.taxNote,
  currency: props.currency,
  showQuantity: props.showQuantity,
  strings: strings.value,
  hasExtra: !!slots.default,
}));
</script>

<template>
  <section
    v-if="folds"
    :class="['q-summary', 'q-summary--folds', open && 'is-open']"
    :aria-label="title ?? strings.title"
  >
    <QDisclosure v-model:open="open" class="q-summary__disc" :heading-level="headingLevel" :divider="false" :meta="money(total, currency)">
      <template #title>
        <span class="q-summary__toggletext"><QLead icon="bag" /><span>{{ open ? strings.hide : strings.show }}</span></span>
      </template>
      <QOrderSummaryBody v-bind="bodyProps"><slot /></QOrderSummaryBody>
    </QDisclosure>
  </section>
  <component
    :is="title === null ? 'div' : 'section'"
    v-else
    class="q-summary"
    :aria-labelledby="title === null ? undefined : `${id}-title`"
  >
    <component :is="`h${headingLevel}`" v-if="title !== null" :id="`${id}-title`" class="q-summary__title">
      {{ title ?? strings.title }}<span class="q-summary__count">{{ strings.items(count) }}</span>
    </component>
    <QOrderSummaryBody v-bind="bodyProps"><slot /></QOrderSummaryBody>
  </component>
</template>
