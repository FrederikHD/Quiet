import { QField, QFormSection, QInput } from '@frederikhd/quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QFormSection,
  name: 'QFormSection',
  props: { title: 'Pricing', description: 'Prices include VAT.', layout: 'stack', headingLevel: 2 },
  slots: {
    default: () => [
      h(QField, { label: 'Price in EUR' }, () =>
        h(QInput, { suffix: '€', numeric: true, align: 'end', inputmode: 'decimal' }),
      ),
      h(QField, { label: 'Cost per item in EUR' }, () =>
        h(QInput, { suffix: '€', numeric: true, align: 'end', inputmode: 'decimal' }),
      ),
    ],
  },
  layout: 'block',
});
