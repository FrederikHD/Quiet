import { QCheckbox, QCheckboxGroup } from 'quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QCheckboxGroup,
  name: 'QCheckboxGroup',
  props: { label: 'Notify the customer by', layout: 'list', hint: 'Only for this order.' },
  model: { value: ['email'] },
  slots: { default: () => [h(QCheckbox, { value: 'email', label: 'Email', description: 'Order confirmation and shipping updates' }), h(QCheckbox, { value: 'sms', label: 'Text message' })] },
  hide: ['defaultValue', 'id', 'name'],
  layout: 'block',
});
