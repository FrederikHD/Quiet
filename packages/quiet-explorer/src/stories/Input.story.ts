import { QInput } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QInput,
  name: 'QInput',
  props: { placeholder: 'e.g. Linen shirt', size: 'default', clearable: true },
  model: { value: 'Linen shirt' },
  field: { label: 'Product name', hint: 'The Field gives it a label, hint and messages.' },
});
