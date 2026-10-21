import { mount } from '@vue/test-utils';
import { QButton } from '@frederikhd/quiet';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';

describe('QButton', () => {
  describe('count', () => {
    it('is a bubble on an icon-only button, read with its aria-label', () => {
      const w = mount(QButton, {
        props: { iconStart: 'cart', count: 2, countLabel: (n: number) => `${n} items` },
        attrs: { 'aria-label': 'Cart' },
      });
      const b = w.get('button');
      expect(b.attributes('aria-label')).toBe('Cart, 2 items');
      expect(b.classes()).toContain('q-btn--icon');
      const bubble = w.get('.q-btn__count');
      expect(bubble.text()).toBe('2');
      expect(bubble.attributes('aria-hidden')).toBe('true');
      expect(w.find('.q-visually-hidden').exists()).toBe(false);
    });

    it('is a pill after a label, and screen readers hear the number with the label', () => {
      const w = mount(QButton, { props: { count: 12 }, slots: { default: 'Notifications' } });
      expect(w.get('.q-btn__count').text()).toBe('12');
      expect(w.get('.q-visually-hidden').text()).toBe(', 12');
      expect(w.get('button').attributes('aria-label')).toBeUndefined();
    });

    it('hides at 0 and shows 99+ above 99', () => {
      const none = mount(QButton, { props: { iconStart: 'cart', count: 0 }, attrs: { 'aria-label': 'Cart' } });
      expect(none.find('.q-btn__count').exists()).toBe(false);
      expect(none.get('button').attributes('aria-label')).toBe('Cart');
      const many = mount(QButton, { props: { count: 128 }, slots: { default: 'Orders' } });
      expect(many.get('.q-btn__count').text()).toBe('99+');
      expect(many.get('.q-visually-hidden').text()).toBe(', 128');
    });
  });

  it('renders a secondary button of type="button" by default', () => {
    const w = mount(QButton, { slots: { default: 'Save changes' } });
    const b = w.get('button');
    expect(b.attributes('type')).toBe('button');
    expect(b.classes()).toEqual(expect.arrayContaining(['q-btn', 'q-btn--secondary']));
    expect(b.text()).toBe('Save changes');
  });

  it('applies variant and size classes', () => {
    const w = mount(QButton, {
      props: { variant: 'primary', size: 'large', fullWidth: true },
      slots: { default: 'Add to cart' },
    });
    expect(w.get('button').classes()).toEqual(
      expect.arrayContaining(['q-btn--primary', 'q-btn--large', 'q-btn--full']),
    );
  });

  it('is square and icon-only when it has an icon and no label', () => {
    const w = mount(QButton, { props: { iconStart: 'trash' }, attrs: { 'aria-label': 'Delete' } });
    expect(w.get('button').classes()).toContain('q-btn--icon');
    expect(w.find('svg.q-icon').exists()).toBe(true);
  });

  it('shows a spinner, disables itself and announces busy while loading', async () => {
    const w = mount(QButton, { props: { loading: true }, slots: { default: 'Saving' } });
    const b = w.get('button');
    // aria-disabled, not native disabled: a natively disabled button would drop keyboard focus to <body>.
    expect(b.attributes('disabled')).toBeUndefined();
    expect(b.attributes('aria-disabled')).toBe('true');
    expect(b.attributes('aria-busy')).toBe('true');
    expect(w.find('.q-btn__spinner').exists()).toBe(true);
    expect(b.text()).toBe('Saving');
  });

  it('keeps focus while loading and ignores presses and form submits', async () => {
    const loading = ref(false);
    const onClick = vi.fn();
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    const w = mount(
      defineComponent({
        setup: () => () =>
          h('form', { onSubmit }, [h(QButton, { type: 'submit', loading: loading.value, onClick }, () => 'Save')]),
      }),
      { attachTo: document.body },
    );
    const b = w.get('button').element as HTMLButtonElement;
    b.focus();
    loading.value = true;
    await nextTick();
    expect(document.activeElement).toBe(b);
    b.click();
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    loading.value = false;
    await nextTick();
    b.click();
    expect(onClick).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledOnce();
    w.unmount();
  });

  it('is natively disabled when disabled, even while loading', () => {
    const w = mount(QButton, { props: { loading: true, disabled: true }, slots: { default: 'Save' } });
    expect(w.get('button').attributes('disabled')).toBeDefined();
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
    const w = mount(QButton, {
      props: { type: 'submit', size: 'slim', iconStart: 'plus', iconEnd: 'arrow-right' },
      slots: { default: 'Add' },
    });
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
