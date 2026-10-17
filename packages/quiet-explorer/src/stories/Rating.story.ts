import { QRating } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QRating,
  name: 'QRating',
  props: { value: 4.3, count: 31, size: 'default' },
});
