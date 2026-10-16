import { QButton, QDialog } from 'quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QDialog,
  name: 'QDialog',
  props: {
    title: 'Delete “Linen shirt, blue”?',
    description: 'It disappears from the shop and from 3 collections. This can’t be undone.',
    size: 'sm',
    role: 'alertdialog',
  },
  model: { prop: 'open', value: false },
  opener: 'Open the dialog',
  slots: { footer: () => [h(QButton, null, () => 'Cancel'), h(QButton, { variant: 'danger' }, () => 'Delete product')] },
  hide: ['initialFocus'],
});
