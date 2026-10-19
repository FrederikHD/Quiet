import { QReviewSummary } from '@frederikhd/quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QReviewSummary,
  name: 'QReviewSummary',
  props: { average: 4.3, distribution: { 5: 20, 4: 7, 3: 2, 2: 0, 1: 2 }, filterable: true },
  // The bars stretch to the column: give it the width of a reviews sidebar.
  wrap: (target) => h('div', { style: 'width: 320px' }, [target()]),
});
