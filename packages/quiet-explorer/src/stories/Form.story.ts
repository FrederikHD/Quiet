import { QButton, QField, QFieldGroup, QForm, QFormActions, QFormSection, QInput } from '@frederikhd/quiet';
import { h } from 'vue';
import { defineStory } from './story';

// A small product form with required and optional fields, a hint, a help tip, a group and actions, so
// labelPlacement, markers, density and labelWidth all show. Use "Preview width" to see it narrow.
export default defineStory({
  component: QForm,
  name: 'QForm',
  props: { labelPlacement: 'auto', markers: 'required', density: 'comfortable', labelWidth: '200px' },
  slots: {
    default: () => [
      h(QFormSection, { title: 'Product details' }, () => [
        h(QField, { label: 'Title', required: true, hint: 'Shown on the product page and in search results.' }, () =>
          h(QInput, { modelValue: 'Linen shirt, blue' }),
        ),
        h(
          QField,
          { label: 'Vendor', width: 'm', help: 'The brand customers see. Leave it empty for your own products.' },
          () => h(QInput, { modelValue: 'Leinenweberei Rhön' }),
        ),
        h(QFieldGroup, { columns: [1, 1] }, () => [
          h(QField, { label: 'Price', required: true }, () =>
            h(QInput, { modelValue: '59,00', suffix: '€', numeric: true, align: 'end' }),
          ),
          h(QField, { label: 'Compare-at price' }, () => h(QInput, { suffix: '€', numeric: true, align: 'end' })),
        ]),
        h(QField, { label: 'SKU', width: 'm', error: 'This SKU is already used by Linen shirt, sand' }, () =>
          h(QInput, { modelValue: 'LS-2041', numeric: true }),
        ),
      ]),
      h(QFormActions, null, () => [
        h(QButton, null, () => 'Cancel'),
        h(QButton, { variant: 'primary', type: 'submit' }, () => 'Save'),
      ]),
    ],
  },
  layout: 'block',
});
