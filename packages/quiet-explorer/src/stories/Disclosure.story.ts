import { QDisclosure } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QDisclosure,
  name: 'QDisclosure',
  props: { title: 'Material and care', meta: 'Linen' },
  model: { prop: 'open', value: true },
  slots: { default: '100% linen from the Rhön. Machine washable at 30 °C, hang to dry.' },
  hide: ['defaultOpen'],
  layout: 'block',
});
