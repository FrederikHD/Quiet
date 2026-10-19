import { QPrice } from '@frederikhd/quiet';
import { defineStory } from './story';

export default defineStory({
  component: QPrice,
  name: 'QPrice',
  props: { amount: 59, compareAt: 79, showSaving: true, size: 'large', taxNote: true },
});
