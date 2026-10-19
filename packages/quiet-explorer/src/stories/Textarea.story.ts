import { QTextarea } from '@frederikhd/quiet';
import { defineStory } from './story';

export default defineStory({
  component: QTextarea,
  name: 'QTextarea',
  props: { rows: 3, maxlength: 200, autoGrow: true, maxRows: 8, placeholder: 'Describe the product' },
  model: { value: 'Breathable linen from the Rhön, washed for a soft hand.' },
  field: { label: 'Description' },
});
