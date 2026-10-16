import { QButton, QField, QForm, QFormActions, QInput } from 'quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QForm,
  name: 'QForm',
  props: { labelPlacement: 'auto', markers: 'required', errors: [{ id: 'pg-title', message: 'Enter a product title' }] },
  slots: {
    default: () => [
      h(QField, { id: 'pg-title', label: 'Title', required: true, error: 'Enter a product title' }, () => h(QInput)),
      h(QField, { label: 'Vendor', hint: 'Shown on the product page.' }, () => h(QInput)),
      h(QFormActions, null, () => h(QButton, { variant: 'primary', type: 'submit' }, () => 'Save')),
    ],
  },
  layout: 'block',
});
