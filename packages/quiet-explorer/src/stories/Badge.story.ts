import { QBadge } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QBadge,
  name: 'QBadge',
  props: { tone: 'success' },
  slots: { default: 'Paid' },
});
