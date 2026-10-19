import { QTabs } from '@frederikhd/quiet';
import { defineStory } from './story';

export default defineStory({
  component: QTabs,
  name: 'QTabs',
  props: {
    label: 'Order views',
    variant: 'line',
    tabs: [
      { value: 'all', label: 'All' },
      { value: 'open', label: 'Unfulfilled', count: 8 },
      { value: 'unpaid', label: 'Unpaid', count: 2 },
      { value: 'done', label: 'Shipped' },
    ],
  },
  model: { value: 'open' },
  slots: { default: 'One shared panel: the list of orders for the chosen view.' },
  layout: 'block',
});
