import { QNav } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QNav,
  name: 'QNav',
  props: {
    items: [
      { label: 'Home', icon: 'home', href: '#home' },
      { label: 'Orders', icon: 'bag', href: '#orders', badge: 12, badgeLabel: '12 to fulfil', current: true },
      { label: 'Products', icon: 'package', href: '#products', items: [{ label: 'Collections', href: '#collections' }, { label: 'Inventory', href: '#inventory' }] },
      { label: 'Customers', icon: 'user', href: '#customers' },
    ],
  },
});
