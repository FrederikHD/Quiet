import { QButton, QEmptyState } from '@frederikhd/quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QEmptyState,
  name: 'QEmptyState',
  props: { title: 'No products match these filters', icon: 'filter', size: 'default' },
  slots: { default: 'Try removing a filter or two.', actions: () => h(QButton, null, () => 'Clear filters') },
  layout: 'block',
});
