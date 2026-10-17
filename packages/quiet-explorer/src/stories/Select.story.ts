import { QSelect } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QSelect,
  name: 'QSelect',
  props: { placeholder: 'Choose a country', options: ['Germany', 'Austria', 'Switzerland', 'Netherlands'] },
  model: { value: '' },
  field: { label: 'Country' },
});
