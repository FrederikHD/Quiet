import { QBreadcrumbs } from '@frederikhd/quiet';
import { defineStory } from './story';

export default defineStory({
  component: QBreadcrumbs,
  name: 'QBreadcrumbs',
  props: { items: [{ label: 'Home', href: '#' }, { label: 'Women', href: '#women' }, { label: 'Shirts', href: '#shirts' }, { label: 'Linen shirt' }] },
  layout: 'block',
});
