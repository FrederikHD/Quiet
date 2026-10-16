import { QMetric } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QMetric,
  name: 'QMetric',
  props: { label: 'Sales', value: '4.280,00 €', change: { direction: 'up', value: '12 %', label: 'on yesterday' }, goodWhen: 'up' },
});
