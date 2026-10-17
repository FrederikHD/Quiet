import { QFilterChips } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QFilterChips,
  name: 'QFilterChips',
  props: { items: [{ key: 'navy', label: 'Navy', swatch: 'hsl(222 32% 45%)' }, { key: 'm', label: 'Size M' }, { key: 'p', label: '30 € – 90 €' }] },
});
