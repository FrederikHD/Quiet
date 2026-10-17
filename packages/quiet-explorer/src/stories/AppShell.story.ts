import { QAppShell, QNav } from 'quiet';
import { h } from 'vue';
import { defineStory } from './story';

export default defineStory({
  component: QAppShell,
  name: 'QAppShell',
  // contained: the shell stays in the playground's stage, and its drawer covers only the shell.
  props: { brand: 'Leinen & Co', toaster: false, contained: true },
  slots: {
    nav: () => h(QNav, { items: [{ label: 'Home', icon: 'home', href: '#', current: true }, { label: 'Orders', icon: 'bag', href: '#', badge: 12 }, { label: 'Products', icon: 'package', href: '#' }] }),
    default: () => h('div', { style: 'padding: 24px' }, 'The page goes here.'),
  },
  hide: ['contained'],
  // A contained shell fills its parent, so give it a screen-sized frame.
  wrap: (target) => h('div', { style: 'height: 480px; border: 1px solid var(--line); border-radius: var(--radius-lg); overflow: hidden' }, [target()]),
  layout: 'block',
});
