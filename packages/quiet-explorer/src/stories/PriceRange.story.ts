import { QPriceRange } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QPriceRange,
  name: 'QPriceRange',
  props: { min: 15, max: 115, step: 5 },
  model: { value: [30, 90] },
  layout: 'block',
});
