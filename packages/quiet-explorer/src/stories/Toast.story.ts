import { QButton, QToaster, toast } from '@frederikhd/quiet';
import { h } from 'vue';
import { defineStory } from './story';

// The Toaster shows what toast() raises; on this page it replaces the explorer's own, so its props apply.
export default defineStory({
  component: QToaster,
  name: 'QToaster',
  wrap: (target) => [
    h(QButton, { onClick: () => toast('Product saved') }, () => 'Show a toast'),
    h(QButton, { onClick: () => toast('Couldn’t save — check your connection.', { tone: 'error' }) }, () => 'Show an error'),
    target(),
  ],
});
