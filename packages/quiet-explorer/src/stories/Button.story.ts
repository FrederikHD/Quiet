import { QButton } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QButton,
  name: 'QButton',
  props: { variant: 'primary', size: 'default' },
  slots: { default: 'Save changes' },
  hide: ['href', 'type'],
});
