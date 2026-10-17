import { QQuantityStepper } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QQuantityStepper,
  name: 'QQuantityStepper',
  props: { min: 1, max: 10 },
  model: { value: 2 },
  field: { label: 'Quantity' },
});
