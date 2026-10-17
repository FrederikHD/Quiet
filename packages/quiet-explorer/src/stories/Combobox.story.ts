import { QCombobox } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QCombobox,
  name: 'QCombobox',
  props: {
    placeholder: 'Choose a rate',
    options: [
      { value: 'de19', label: 'Germany, standard', meta: '19%' },
      { value: 'de7', label: 'Germany, reduced', meta: '7%' },
      { value: 'at20', label: 'Austria, standard', meta: '20%' },
      { value: 'ch81', label: 'Switzerland, standard', meta: '8.1%' },
      { value: 'none', label: 'Tax exempt', meta: '0%' },
    ],
    clearable: true,
  },
  model: { value: null },
  field: { label: 'Tax rate' },
});
