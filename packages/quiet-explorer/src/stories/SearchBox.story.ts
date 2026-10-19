import { QSearchBox } from '@frederikhd/quiet';
import { defineStory } from './story';

export default defineStory({
  component: QSearchBox,
  name: 'QSearchBox',
  props: {
    placeholder: 'Search shirts, linen, colours…',
    suggestions: [
      { label: 'Collections', items: [{ id: 'shirts', label: 'Shirts', icon: 'grid' }] },
      {
        label: 'Products',
        items: [
          { id: 'p1', label: 'Linen shirt', description: 'Shirts', meta: '59,00 €' },
          { id: 'p2', label: 'Linen overshirt', description: 'Shirts', meta: '89,00 €' },
        ],
      },
    ],
  },
  model: { value: 'linen' },
  layout: 'block',
});
