import { QPagination } from '@frederikhd/quiet';
import { defineStory } from './story';

export default defineStory({
  component: QPagination,
  name: 'QPagination',
  props: { total: 1240, pageSize: 50, variant: 'pages', showFirstLast: true },
  model: { prop: 'page', value: 3 },
  layout: 'block',
});
