import { QRadio, QRadioGroup } from 'quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QRadio,
  name: 'QRadio',
  props: { value: 'exp', label: 'Express', description: 'Next working day', meta: '9,90 €' },
  // A radio always belongs to a group; the group owns the value.
  wrap: (target) => h(QRadioGroup, { label: 'Delivery', defaultValue: 'exp' }, () => target()),
});
