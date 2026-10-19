import { QButton, QFormActions } from '@frederikhd/quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QFormActions,
  name: 'QFormActions',
  props: { align: 'end' },
  slots: { default: () => [h(QButton, null, () => 'Cancel'), h(QButton, { variant: 'primary' }, () => 'Save')] },
  layout: 'block',
});
