import { QAddressFields } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QAddressFields,
  name: 'QAddressFields',
  props: { idPrefix: 'pg', kind: 'shipping' },
  model: { value: { country: 'DE' } },
  hide: ['countries', 'errors'],
  layout: 'block',
});
