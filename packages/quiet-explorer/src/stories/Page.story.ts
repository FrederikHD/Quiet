import { QButton, QCard, QPage } from '@frederikhd/quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QPage,
  name: 'QPage',
  props: {
    title: 'Linen shirt, blue',
    subtitle: 'SKU LS-2040 · last saved 2 minutes ago',
    back: { href: '#products', label: 'Products' },
    width: 'default',
  },
  slots: {
    default: () => h(QCard, { title: 'Details' }, () => 'Content'),
    actions: () => h(QButton, { variant: 'primary' }, () => 'Save'),
  },
  layout: 'block',
});
