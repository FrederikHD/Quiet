import { QField, QFormSection, QInput } from 'quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QFormSection,
  name: 'QFormSection',
  props: { title: 'Pricing', description: 'Prices include VAT.', layout: 'stack', headingLevel: 2 },
  slots: { default: () => [h(QField, { label: 'Price' }, () => h(QInput, { suffix: '€', numeric: true, align: 'end' })), h(QField, { label: 'Cost per item' }, () => h(QInput, { suffix: '€', numeric: true, align: 'end' }))] },
  layout: 'block',
});
