import { QRadio, QRadioGroup } from 'quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QRadioGroup,
  name: 'QRadioGroup',
  props: { label: 'Delivery', layout: 'cards', required: true },
  model: { value: 'std' },
  slots: {
    default: () => [
      h(QRadio, { value: 'std', label: 'Standard', description: '2–4 working days', meta: 'Free' }),
      h(QRadio, { value: 'exp', label: 'Express', description: 'Next working day', meta: '9,90 €' }),
    ],
  },
  hide: ['defaultValue', 'id', 'name'],
  layout: 'block',
});
