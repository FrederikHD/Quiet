import { QCheckbox } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QCheckbox,
  name: 'QCheckbox',
  props: { label: 'Send me the newsletter', description: 'About once a month. Unsubscribe any time.' },
  model: { value: true },
  hide: ['id', 'name', 'value', 'swatch', 'image', 'soldOut'],
});
