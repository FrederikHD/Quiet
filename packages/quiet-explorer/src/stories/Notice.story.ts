import { QNotice } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QNotice,
  name: 'QNotice',
  props: { tone: 'warning', title: '3 products are out of stock', dismissible: true },
  slots: { default: 'They’re hidden from the shop until you restock them.' },
  layout: 'block',
});
