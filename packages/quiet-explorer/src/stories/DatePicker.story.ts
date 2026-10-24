import { QDatePicker } from '@frederikhd/quiet';
import { defineStory } from './story';

export default defineStory({
  component: QDatePicker,
  name: 'QDatePicker',
  props: { clearable: true },
  model: { value: '2026-10-24' },
  field: { label: 'Delivery date' },
});
