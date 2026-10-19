import { QField, QFieldGroup, QInput } from '@frederikhd/quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QFieldGroup,
  name: 'QFieldGroup',
  props: { label: 'Dimensions', hint: 'Packed size, used for shipping rates.', columns: [1, 1, 1], stack: 'late' },
  slots: {
    default: () => [
      h(QField, { label: 'Length' }, () => h(QInput, { suffix: 'cm', numeric: true, align: 'end' })),
      h(QField, { label: 'Width' }, () => h(QInput, { suffix: 'cm', numeric: true, align: 'end' })),
      h(QField, { label: 'Height' }, () => h(QInput, { suffix: 'cm', numeric: true, align: 'end' })),
    ],
  },
  layout: 'block',
});
