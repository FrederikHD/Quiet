import { QField, QInput } from '@frederikhd/quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QField,
  name: 'QField',
  props: { label: 'Product title', hint: 'Shown on the product page and in search results.', help: 'Keep it short: the name people search for.', required: true, labelPlacement: 'top' },
  slots: { default: () => h(QInput, { placeholder: 'e.g. Linen shirt, blue' }) },
  layout: 'block',
});
