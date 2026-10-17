import { QOrderSummary } from 'quiet';
import { h } from 'vue';
import { photo } from '../fixtures/pictures';
import { defineStory } from './story';

export default defineStory({
  component: QOrderSummary,
  name: 'QOrderSummary',
  props: {
    items: [{ name: 'Linen shirt', variant: 'Blue · M', quantity: 2, price: 118, image: { src: photo('Blue') } }],
    totals: [
      { label: 'Discount', detail: 'LINEN10', amount: -11.8 },
      { label: 'Shipping', amount: null, note: 'Chosen in the next step' },
    ],
    total: 106.2,
    taxNote: 'Including 16,96 € VAT (19 %)',
    collapsible: false,
  },
  model: { prop: 'open', value: false },
  wrap: (target) => h('div', { style: 'max-width: 420px' }, [target()]),
  layout: 'block',
});
