import { QMenu } from '@frederikhd/quiet';
import { defineStory } from './story';

export default defineStory({
  component: QMenu,
  name: 'QMenu',
  props: {
    label: 'Actions for Linen shirt, blue',
    items: [
      { label: 'Edit', icon: 'pencil' },
      { label: 'Duplicate', icon: 'copy' },
      { divider: true },
      { label: 'Delete', icon: 'trash', danger: true },
    ],
  },
});
