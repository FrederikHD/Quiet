import { QDescriptionList } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QDescriptionList,
  name: 'QDescriptionList',
  props: {
    layout: 'inline',
    items: [
      { term: 'Subtotal', description: '118,00 €', numeric: true },
      { term: 'Shipping', description: 'Free' },
      { term: 'Total', description: '118,00 €', numeric: true, emphasis: true },
    ],
  },
  layout: 'block',
});
