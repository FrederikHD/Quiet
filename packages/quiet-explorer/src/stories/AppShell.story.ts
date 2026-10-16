import { QAppShell, QNav } from 'quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QAppShell,
  name: 'QAppShell',
  props: { brand: 'Leinen & Co', toaster: false },
  slots: {
    nav: () => h(QNav, { items: [{ label: 'Home', icon: 'home', href: '#', current: true }, { label: 'Orders', icon: 'bag', href: '#', badge: 12 }, { label: 'Products', icon: 'package', href: '#' }] }),
    default: () => h('div', { style: 'padding: 24px' }, 'The page goes here.'),
  },
  hide: ['mainId', 'toastStrings', 'strings'],
  layout: 'block',
});
