import { QTag } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QTag,
  name: 'QTag',
  props: { removable: true, swatch: 'hsl(222 32% 45%)', variant: 'pill' },
  slots: { default: 'Navy' },
});
