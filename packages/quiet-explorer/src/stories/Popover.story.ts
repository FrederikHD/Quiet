import { QButton, QPopover } from '@frederikhd/quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QPopover,
  name: 'QPopover',
  props: { label: 'Help: SKU', kind: 'tip', content: 'Your own article number. It appears on packing slips and invoices, not in the shop.' },
  model: { prop: 'open', value: false },
  slots: { default: () => h(QButton, { variant: 'ghost', size: 'slim', iconStart: 'help', 'aria-label': 'Help: SKU' }) },
});
