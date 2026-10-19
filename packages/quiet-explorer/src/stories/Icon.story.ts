import { QIcon } from '@frederikhd/quiet';
import { defineStory } from './story';

export default defineStory({
  component: QIcon,
  name: 'QIcon',
  props: { name: 'cart', size: 'lg' },
});
