import { flushPromises, mount } from '@vue/test-utils';
import { QButton, QPopover } from '@frederikhd/quiet';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, ref } from 'vue';

const panel = () => document.querySelector<HTMLElement>('.q-popover');
const settle = async () => {
  await flushPromises();
  await new Promise((r) => setTimeout(r, 20));
  await flushPromises();
};
const key = (k: string, opts: KeyboardEventInit = {}, target: EventTarget = document.activeElement ?? document) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...opts }));

function mountPopover(props: Record<string, unknown> = {}, content?: () => unknown) {
  return mount(QPopover, {
    props: { label: 'Change order status', ...props },
    slots: {
      default: () => h(QButton, null, () => 'Status'),
      ...(content ? { content } : {}),
    },
    attachTo: document.body,
  });
}

describe('QPopover', () => {
  afterEach(() => vi.useRealTimers());

  it('marks up the trigger: aria-haspopup, aria-expanded, aria-controls only while open', async () => {
    const w = mountPopover({}, () => h('button', 'Apply'));
    await flushPromises();
    const t = w.get('button');
    expect(t.attributes('aria-haspopup')).toBe('dialog');
    expect(t.attributes('aria-expanded')).toBe('false');
    expect(t.attributes('aria-controls')).toBeUndefined();
    await t.trigger('click');
    await settle();
    expect(t.attributes('aria-expanded')).toBe('true');
    expect(t.attributes('aria-controls')).toBe(panel()!.id);
    expect(w.emitted('update:open')?.[0]).toEqual([true]);
    w.unmount();
  });

  it('opens a labelled dialog panel and moves focus to its first control', async () => {
    const w = mountPopover({}, () => [h('p', 'Order #1049'), h('button', { class: 'first' }, 'Fulfilled')]);
    await w.get('button').trigger('click');
    await settle();
    const p = panel()!;
    expect(p.getAttribute('role')).toBe('dialog');
    expect(p.getAttribute('aria-label')).toBe('Change order status');
    expect(p.classList.contains('q-popover--tip')).toBe(false);
    expect(document.activeElement).toBe(p.querySelector('.first'));
    w.unmount();
  });

  it('focuses initialFocus when given', async () => {
    const target = ref<HTMLElement | null>(null);
    const App = defineComponent(
      () => () =>
        h(
          QPopover,
          { label: 'Status', initialFocus: target.value },
          {
            default: () => h('button', 'Open'),
            content: () => [h('button', 'One'), h('button', { ref: target, class: 'two' }, 'Two')],
          },
        ),
    );
    const w = mount(App, { attachTo: document.body });
    await w.get('button').trigger('click');
    await settle();
    // A template ref to a control in the panel: it only exists once the panel has rendered.
    expect(document.activeElement?.className).toBe('two');
    w.unmount();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const w = mountPopover({}, () => h('button', 'Apply'));
    const t = w.get('button');
    await t.trigger('click');
    await settle();
    expect(panel()).not.toBeNull();
    key('Escape');
    await settle();
    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(t.element);
    expect(t.attributes('aria-expanded')).toBe('false');
    w.unmount();
  });

  it('closes on a click outside, and toggles on the trigger', async () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    const w = mountPopover({}, () => h('button', 'Apply'));
    const t = w.get('button');
    await t.trigger('click');
    await settle();
    outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    await settle();
    expect(panel()).toBeNull();
    await t.trigger('click');
    await settle();
    expect(panel()).not.toBeNull();
    await t.trigger('click');
    await settle();
    expect(panel()).toBeNull();
    w.unmount();
  });

  it('does not toggle when the trigger click is defaultPrevented', async () => {
    const w = mount(QPopover, {
      props: { label: 'Status', content: 'Hi' },
      slots: { default: () => h('button', { onClick: (e: MouseEvent) => e.preventDefault() }, 'Open') },
      attachTo: document.body,
    });
    await w.get('button').trigger('click');
    await settle();
    expect(panel()).toBeNull();
    w.unmount();
  });

  it('Shift+Tab from the first control closes it and goes back to the trigger', async () => {
    const w = mountPopover({}, () => [h('button', { class: 'a' }, 'A'), h('button', { class: 'b' }, 'B')]);
    const t = w.get('button');
    await t.trigger('click');
    await settle();
    expect(document.activeElement?.className).toBe('a');
    key('Tab', { shiftKey: true });
    await settle();
    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(t.element);
    w.unmount();
  });

  it('Tab past the last control closes it and moves on as if the panel sat after the trigger', async () => {
    const App = defineComponent(
      () => () =>
        h('div', [
          h(
            QPopover,
            { label: 'Status' },
            {
              default: () => h('button', { class: 'trigger' }, 'Open'),
              content: () => h('button', { class: 'last' }, 'Apply'),
            },
          ),
          h('button', { class: 'next' }, 'Next'),
        ]),
    );
    // jsdom has no layout: offsetParent is null, so make the page's buttons count as visible.
    const spy = vi.spyOn(HTMLElement.prototype, 'offsetParent', 'get').mockReturnValue(document.body);
    const w = mount(App, { attachTo: document.body });
    await w.get('.trigger').trigger('click');
    await settle();
    expect(document.activeElement?.className).toBe('last');
    key('Tab');
    await settle();
    expect(panel()).toBeNull();
    expect(document.activeElement?.className).toBe('next');
    spy.mockRestore();
    w.unmount();
  });

  it('kind="tip": no role, focus stays on the trigger, the text is announced in a status region', async () => {
    const w = mountPopover({ kind: 'tip', label: 'Help: SKU', content: 'Your own article number.' });
    const t = w.get('button');
    await flushPromises();
    expect(t.attributes('aria-expanded')).toBe('false');
    expect(t.attributes('aria-haspopup')).toBeUndefined();
    t.element.focus();
    await t.trigger('click');
    await settle();
    await new Promise((r) => setTimeout(r, 80));
    await flushPromises();
    const p = panel()!;
    expect(p.classList.contains('q-popover--tip')).toBe(true);
    expect(p.getAttribute('role')).toBeNull();
    expect(p.getAttribute('aria-label')).toBeNull();
    expect(document.activeElement).toBe(t.element);
    expect(p.querySelector('[aria-hidden="true"]')?.textContent).toBe('Your own article number.');
    expect(p.querySelector('[role="status"]')?.textContent).toBe('Your own article number.');
    w.unmount();
  });

  it('kind="tip" closes when focus moves on from the trigger', async () => {
    const other = document.createElement('button');
    document.body.appendChild(other);
    const w = mountPopover({ kind: 'tip', content: 'Help' });
    await w.get('button').trigger('click');
    await settle();
    w.get('button').element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: other }));
    await settle();
    expect(panel()).toBeNull();
    w.unmount();
  });

  it('kind="menu" sets aria-haspopup="menu" and gives the panel no dialog role', async () => {
    const w = mountPopover({ kind: 'menu' }, () =>
      h('div', { role: 'menu' }, h('button', { role: 'menuitem' }, 'Edit')),
    );
    await flushPromises();
    expect(w.get('button').attributes('aria-haspopup')).toBe('menu');
    await w.get('button').trigger('click');
    await settle();
    expect(panel()!.getAttribute('role')).toBeNull();
    w.unmount();
  });

  it('follows v-model:open and defaultOpen', async () => {
    const w = mountPopover({ open: false, content: 'Hi' });
    await w.setProps({ open: true });
    await settle();
    expect(panel()).not.toBeNull();
    await w.setProps({ open: false });
    await settle();
    expect(panel()).toBeNull();
    w.unmount();

    const d = mountPopover({ defaultOpen: true, content: 'Hi' });
    await settle();
    expect(panel()).not.toBeNull();
    d.unmount();
  });

  it('puts placement data, width, class and style on the panel', async () => {
    const w = mount(QPopover, {
      props: { label: 'Status', content: 'Hi', width: 240, flush: true, panelClass: 'extra' },
      attrs: { class: 'mine', style: 'color: red' },
      slots: { default: () => h('button', 'Open') },
      attachTo: document.body,
    });
    await w.get('button').trigger('click');
    await settle();
    const p = panel()!;
    expect(p.classList.contains('q-popover--flush')).toBe(true);
    expect(p.classList.contains('extra')).toBe(true);
    expect(p.classList.contains('mine')).toBe(true);
    expect(p.style.width).toBe('240px');
    expect(p.style.color).toBe('red');
    expect(p.dataset.side).toBe('bottom');
    expect(p.getAttribute('tabindex')).toBe('-1');
    w.unmount();
  });

  it('exposes show, hide and toggle', async () => {
    const w = mountPopover({ content: 'Hi' });
    (w.vm as unknown as { show(): void }).show();
    await settle();
    expect(panel()).not.toBeNull();
    (w.vm as unknown as { toggle(): void }).toggle();
    await settle();
    expect(panel()).toBeNull();
    w.unmount();
  });
});

describe('QPopover attributes', () => {
  it('passes data- and aria- attributes to the panel along with class and style', async () => {
    mount(QPopover, {
      props: { open: true, label: 'Delivery', content: 'Ships in 2 days' },
      attrs: { class: 'mine', 'data-testid': 'tip', 'aria-describedby': 'x' },
      slots: { default: '<button>Info</button>' },
      attachTo: document.body,
    });
    await flushPromises();
    const panel = document.querySelector('.q-popover')!;
    expect(panel.classList.contains('mine')).toBe(true);
    expect(panel.getAttribute('data-testid')).toBe('tip');
    expect(panel.getAttribute('aria-describedby')).toBe('x');
  });
});
