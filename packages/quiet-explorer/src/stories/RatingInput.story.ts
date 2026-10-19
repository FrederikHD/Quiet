import { QRatingInput } from '@frederikhd/quiet';
import { defineStory } from './story';

export default defineStory({
  component: QRatingInput,
  name: 'QRatingInput',
  props: { label: 'Your rating', required: true },
  model: { value: 4 },
});
