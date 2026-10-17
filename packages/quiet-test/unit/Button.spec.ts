import { mount } from '@vue/test-utils';
import { QButton } from 'quiet';
import { describe, expect, it, vi } from 'vitest';

describe('QButton', () => {
  it('renders a secondary button of type="button" by default', () => {
    const w = mount(QButton, { slots: { default: 'Save changes' } });
    const b = w.get('button');
    expect(b.attributes('type')).toBe('button');
    expect(b.classes()).toEqual(expect.arrayContaining(['q-btn', 'q-btn--secondary']));
    expect(b.text()).toBe('Save changes');
  });

  it('applies variant and size classes', () => {
    const w = mount(QButton, { props: { variant: 'primary', size: 'large', fullWidth: true }, slots: { default: 'Add to cart' } });
    expect(w.get('button').classes()).toEqual(expect.arrayContaining(['q-btn--primary', 'q-btn--large', 'q-btn--full']));
  });

  it('is square and icon-only when it has an icon and no label', () => {
    const w = mount(QButton, { props: { iconStart: 'trash' }, attrs: { 'aria-label': 'Delete' } });
    expect(w.get('button').classes()).toContain('q-btn--icon');
    expect(w.find('svg.q-icon').exists()).toBe(true);
  });

  it('shows a spinner, disables itself and announces busy while loading', async () => {
    const w = mount(QButton, { props: { loading: true }, slots: { default: 'Saving' } });
    const b = w.get('button');
    expect(b.attributes('disabled')).toBeDefined();
    expect(b.attributes('aria-busy')).toBe('true');
    expect(w.find('.q-btn__spinner').exists()).toBe(true);
    expect(b.text()).toBe('Saving');
  });

  it('becomes a toggle with aria-pressed on secondary and ghost', () => {
    const on = mount(QButton, { props: { pressed: true }, slots: { default: 'Grid' } });
    expect(on.get('button').attributes('aria-pressed')).toBe('true');
    const ignored = mount(QButton, { props: { pressed: true, variant: 'primary' }, slots: { default: 'Grid' } });
    expect(ignored.get('button').attributes('aria-pressed')).toBeUndefined();
  });

  it('renders a link with href, and a dimmed, unfocusable link when disabled', async () => {
    const link = mount(QButton, { props: { href: '/orders' }, slots: { default: 'View orders' } });
    expect(link.get('a').attributes('href')).toBe('/orders');

    let clicked = 0;
    const off = mount(QButton, {
      props: { href: '/orders', disabled: true },
      attrs: { onClick: () => clicked++ },
      slots: { default: 'View orders' },
    });
    const a = off.get('a');
    expect(a.attributes('href')).toBeUndefined();
    expect(a.attributes('aria-disabled')).toBe('true');
    expect(a.attributes('tabindex')).toBe('-1');
    await a.trigger('click');
    expect(clicked).toBe(0);
  });

  it('passes clicks through', async () => {
    let clicked = 0;
    const w = mount(QButton, { attrs: { onClick: () => clicked++ }, slots: { default: 'Go' } });
    await w.get('button').trigger('click');
    expect(clicked).toBe(1);
  });
});

describe('QButton states', () => {
  it('sets aria-expanded for a menu trigger, and false when closed', () => {
    const open = mount(QButton, { props: { expanded: true }, slots: { default: 'Bulk actions' } });
    expect(open.get('button').attributes('aria-expanded')).toBe('true');
    const closed = mount(QButton, { props: { expanded: false }, slots: { default: 'Bulk actions' } });
    expect(closed.get('button').attributes('aria-expanded')).toBe('false');
    const plain = mount(QButton, { slots: { default: 'Save' } });
    expect(plain.get('button').attributes('aria-expanded')).toBeUndefined();
  });

  it('honours type and slim size, and puts icons in aria-hidden slots', () => {
    const w = mount(QButton, { props: { type: 'submit', size: 'slim', iconStart: 'plus', iconEnd: 'arrow-right' }, slots: { default: 'Add' } });
    const b = w.get('button');
    expect(b.attributes('type')).toBe('submit');
    expect(b.classes()).toContain('q-btn--slim');
    expect(b.classes()).not.toContain('q-btn--icon');
    const icons = w.findAll('.q-btn__icon');
    expect(icons).toHaveLength(2);
    icons.forEach((i) => expect(i.attributes('aria-hidden')).toBe('true'));
  });

  it('accepts icon slots', () => {
    const w = mount(QButton, { slots: { 'icon-start': '<svg class="mine" />', default: 'Go' } });
    expect(w.find('.q-btn__icon .mine').exists()).toBe(true);
  });

  it('does not disable an enabled link', () => {
    const w = mount(QButton, { props: { href: '/x' }, slots: { default: 'Go' } });
    const a = w.get('a');
    expect(a.attributes('disabled')).toBeUndefined();
    expect(a.attributes('aria-disabled')).toBeUndefined();
    expect(a.attributes('type')).toBeUndefined();
  });

  it('warns when an icon-only button has no name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(QButton, { props: { iconStart: 'x', variant: 'ghost', size: 'slim' } });
    expect(warn.mock.calls.some((c) => String(c[0]).includes('aria-label'))).toBe(true);
  });
});
