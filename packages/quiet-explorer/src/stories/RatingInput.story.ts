import { QRatingInput } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QRatingInput,
  name: 'QRatingInput',
  props: { label: 'Your rating', required: true },
  model: { value: 4 },
  hide: ['id', 'name'],
});
