import { QButton, QCard } from 'quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QCard,
  name: 'QCard',
  props: { title: 'Customer', description: 'Since March 2024 · 6 orders', headingLevel: 2 },
  slots: { default: 'Anna Schmidt, anna@example.com', actions: () => h(QButton, { size: 'slim', variant: 'ghost' }, () => 'Edit') },
  layout: 'block',
});
