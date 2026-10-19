import { QSteps } from '@frederikhd/quiet';
import { defineStory } from './story';

export default defineStory({
  component: QSteps,
  name: 'QSteps',
  props: { current: 1, steps: [{ label: 'Address', href: '#address' }, { label: 'Shipping', href: '#shipping' }, { label: 'Payment', href: '#payment' }] },
  layout: 'block',
});
