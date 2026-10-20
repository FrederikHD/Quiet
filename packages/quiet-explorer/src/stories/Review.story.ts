import { QReview } from '@frederikhd/quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QReview,
  name: 'QReview',
  props: {
    rating: 4,
    title: 'Lovely, runs a little large',
    author: 'Lea F.',
    date: '28 September 2026',
    verified: true,
    details: ['Size S', 'Sand'],
    helpful: 3,
  },
  slots: {
    default:
      'Soft from the first wash and it keeps its shape. I usually wear a medium and the small fits well, so order a size down.',
  },
  layout: 'block',
  wrap: (target) => h('div', { style: 'max-width: 640px' }, [target()]),
});
