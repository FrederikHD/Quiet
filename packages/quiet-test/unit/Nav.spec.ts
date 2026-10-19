import { mount } from '@vue/test-utils';
import { QNav, configure, type NavItem } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';

const sections = (current: string) => {
  const it = (key: string, label: string, extra: Partial<NavItem> = {}): NavItem => ({
    key,
    label,
    href: `#${key}`,
    current: current === key,
    ...extra,
  });
  return [
    {
      items: [
        it('home', 'Home', { icon: 'home' }),
        it('orders', 'Orders', { icon: 'bag', badge: 12, badgeLabel: '12 to fulfil' }),
        it('products', 'Products', {
          icon: 'package',
          items: [it('collections', 'Collections', { icon: 'grid' }), it('inventory', 'Inventory')],
        }),
      ],
    },
    { title: 'Shop', items: [it('settings', 'Settings', { icon: 'sliders' })] },
  ];
};

describe('QNav', () => {
  it('is a nav landmark named "Main" with sections and a labelled group', () => {
    const w = mount(QNav, { props: { sections: sections('home') } });
    const nav = w.get('nav.q-nav');
    expect(nav.attributes('aria-label')).toBe('Main');
    const groups = w.findAll('.q-nav__section');
    expect(groups).toHaveLength(2);
    expect(groups[0].attributes('role')).toBeUndefined();
    expect(groups[1].attributes('role')).toBe('group');
    const title = w.get('.q-nav__title');
    expect(groups[1].attributes('aria-labelledby')).toBe(title.attributes('id'));
    expect(title.text()).toBe('Shop');
  });

  it('marks the current page and hides sub-pages until within', () => {
    const w = mount(QNav, { props: { sections: sections('home') } });
    const home = w.get('a[href="#home"]');
    expect(home.attributes('aria-current')).toBe('page');
    expect(home.classes()).toContain('is-current');
    expect(w.find('a[href="#orders"]').attributes('aria-current')).toBeUndefined();
    expect(w.find('a[href="#inventory"]').exists()).toBe(false);
  });

  it('opens a parent while a sub-page is current, marks it within, and shows icons only at the top level', () => {
    const w = mount(QNav, { props: { sections: sections('inventory') } });
    const products = w.get('a[href="#products"]');
    expect(products.classes()).toContain('is-within');
    expect(products.attributes('aria-current')).toBeUndefined();
    const sub = w.get('a[href="#inventory"]');
    expect(sub.classes()).toEqual(expect.arrayContaining(['q-nav__link--sub', 'is-current']));
    expect(w.find('a[href="#collections"] .q-nav__icon').exists()).toBe(false);
    expect(products.find('.q-nav__icon').attributes('aria-hidden')).toBe('true');
  });

  it('expanded forces sub-pages open or closed', () => {
    const open = mount(QNav, {
      props: {
        items: [{ label: 'Products', href: '#p', expanded: true, items: [{ label: 'Inventory', href: '#i' }] }],
      },
    });
    expect(open.find('a[href="#i"]').exists()).toBe(true);
    const closed = mount(QNav, {
      props: {
        items: [
          {
            label: 'Products',
            href: '#p',
            expanded: false,
            items: [{ label: 'Inventory', href: '#i', current: true }],
          },
        ],
      },
    });
    expect(closed.find('a[href="#i"]').exists()).toBe(false);
  });

  it('reads a count with what it means', () => {
    const w = mount(QNav, { props: { sections: sections('home') } });
    const orders = w.get('a[href="#orders"]');
    expect(orders.get('.q-nav__badge').attributes('aria-hidden')).toBe('true');
    expect(orders.get('.q-visually-hidden').text()).toBe(', 12 to fulfil');
    const bare = mount(QNav, { props: { items: [{ label: 'Discounts', href: '#d', badge: 2 }] } });
    expect(bare.get('.q-nav__badge').attributes('aria-hidden')).toBeUndefined();
  });

  it('renders buttons without href and emits navigate with the item', async () => {
    const item = { label: 'Log out' };
    const w = mount(QNav, { props: { items: [item] } });
    const b = w.get('button.q-nav__link');
    expect(b.attributes('type')).toBe('button');
    await b.trigger('click');
    expect(w.emitted('navigate')![0][0]).toEqual(item);
  });

  it('emits navigate for sub-pages too', async () => {
    const w = mount(QNav, { props: { sections: sections('inventory') } });
    await w.get('a[href="#collections"]').trigger('click');
    expect((w.emitted('navigate')![0][0] as NavItem).key).toBe('collections');
  });

  it('takes its name from aria-label, strings or configure()', () => {
    expect(
      mount(QNav, { props: { items: [] }, attrs: { 'aria-label': 'Settings' } })
        .get('nav')
        .attributes('aria-label'),
    ).toBe('Settings');
    expect(
      mount(QNav, { props: { items: [], strings: { label: 'Haupt' } } })
        .get('nav')
        .attributes('aria-label'),
    ).toBe('Haupt');
    configure({ strings: { nav: { label: 'Hauptmenü' } } });
    expect(
      mount(QNav, { props: { items: [] } })
        .get('nav')
        .attributes('aria-label'),
    ).toBe('Hauptmenü');
    configure({ strings: { nav: { label: 'Main' } } });
  });
});
