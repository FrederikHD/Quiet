import { QMetric } from 'quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QMetric,
  name: 'QMetric',
  props: { label: 'Sales', value: '4.280,00 €', change: { direction: 'up', value: '12 %', label: 'on yesterday' }, goodWhen: 'up' },
  // A metric sits in a dashboard Card, at least 200px wide.
  wrap: (target) => h('div', { style: 'width: 240px' }, [target()]),
});
