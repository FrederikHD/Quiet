import { flushPromises, mount } from '@vue/test-utils';
import { configure, dismissToast, QToaster, toast } from 'quiet';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const toaster = () => document.querySelector('.q-toaster') as HTMLElement;
const toasts = () => Array.from(document.querySelectorAll('.q-toast'));

describe('QToaster and toast()', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(async () => {
    // The store is shared: clear every toast up to the newest id.
    for (let id = toast('', { duration: 0 }); id > 0; id--) dismissToast(id);
    vi.useRealTimers();
    configure({ strings: { toast: { dismiss: 'Dismiss', region: 'Notifications' } } });
  });

  function mountToaster(props = {}) {
    return mount(QToaster, { props, attachTo: document.body });
  }

  it('has a named region with polite and assertive live regions before any toast', () => {
    const w = mountToaster();
    const region = toaster();
    expect(region.tagName).toBe('SECTION');
    expect(region.getAttribute('aria-label')).toBe('Notifications');
    const stacks = region.querySelectorAll('.q-toaster__stack');
    expect(stacks[0].getAttribute('role')).toBe('status');
    expect(stacks[1].getAttribute('role')).toBe('alert');
    w.unmount();
  });

  it('shows a toast in the polite region and errors in the alert region', async () => {
    const w = mountToaster();
    const a = toast('Product saved');
    const b = toast('Couldn’t save', { tone: 'error' });
    await flushPromises();
    expect(toaster().querySelector('[role="status"] .q-toast--neutral .q-toast__msg')?.textContent).toBe('Product saved');
    const err = toaster().querySelector('[role="alert"] .q-toast--error');
    expect(err?.querySelector('.q-lead')).not.toBeNull();
    expect(typeof a).toBe('number');
    expect(b).toBe(a + 1);
    toast.dismiss(a);
    dismissToast(b);
    await flushPromises();
    expect(toasts()).toHaveLength(0);
    w.unmount();
  });

  it('shows a check icon on success toasts and none on neutral ones', async () => {
    const w = mountToaster();
    const a = toast('Saved', { tone: 'success' });
    const b = toast('Saved');
    await flushPromises();
    expect(document.querySelector('.q-toast--success .q-lead')).not.toBeNull();
    expect(document.querySelector('.q-toast--neutral .q-lead')).toBeNull();
    dismissToast(a);
    dismissToast(b);
    w.unmount();
  });

  it('keeps at most three toasts, dropping the oldest', async () => {
    const w = mountToaster();
    const ids = ['One', 'Two', 'Three', 'Four'].map((m) => toast(m, { duration: 0 }));
    await flushPromises();
    expect(toasts().map((t) => t.querySelector('.q-toast__msg')?.textContent)).toEqual(['Two', 'Three', 'Four']);
    ids.forEach(dismissToast);
    w.unmount();
  });

  it('closes after 5 s, 8 s with an action or as an error, and never with duration 0', async () => {
    const w = mountToaster();
    toast('Plain');
    toast('With undo', { action: { label: 'Undo', onClick: () => {} } });
    const sticky = toast('Sticky', { duration: 0 });
    await flushPromises();
    expect(toasts()).toHaveLength(3);
    vi.advanceTimersByTime(5001);
    await flushPromises();
    expect(toasts()).toHaveLength(2);
    vi.advanceTimersByTime(3000);
    await flushPromises();
    expect(toasts()).toHaveLength(1);
    vi.advanceTimersByTime(60000);
    await flushPromises();
    expect(toasts()).toHaveLength(1);
    dismissToast(sticky);
    w.unmount();
  });

  it('pauses while hovered or focused', async () => {
    const w = mountToaster();
    toast('Product saved');
    await flushPromises();
    const el = toasts()[0];
    el.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(10000);
    await flushPromises();
    expect(toasts()).toHaveLength(1);
    el.dispatchEvent(new MouseEvent('mouseleave'));
    el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    vi.advanceTimersByTime(10000);
    await flushPromises();
    expect(toasts()).toHaveLength(1);
    el.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    vi.advanceTimersByTime(5000);
    await flushPromises();
    expect(toasts()).toHaveLength(0);
    w.unmount();
  });

  it('runs the action and closes; the × closes too', async () => {
    const w = mountToaster();
    const undo = vi.fn();
    toast('Archived 1 product', { action: { label: 'Undo', onClick: undo } });
    toast('Product saved');
    await flushPromises();
    const action = document.querySelector<HTMLButtonElement>('.q-toast__action')!;
    expect(action.type).toBe('button');
    expect(action.textContent).toBe('Undo');
    action.click();
    expect(undo).toHaveBeenCalledOnce();
    await flushPromises();
    expect(toasts()).toHaveLength(1);
    const close = document.querySelector<HTMLButtonElement>('.q-toast__close')!;
    expect(close.getAttribute('aria-label')).toBe('Dismiss');
    close.click();
    await flushPromises();
    expect(toasts()).toHaveLength(0);
    w.unmount();
  });

  it('never takes focus', async () => {
    const w = mountToaster();
    const before = document.activeElement;
    toast('Product saved');
    await flushPromises();
    expect(document.activeElement).toBe(before);
    w.unmount();
  });

  it('translates its labels through the strings prop and configure()', async () => {
    configure({ strings: { toast: { region: 'Mitteilungen' } } });
    const w = mountToaster({ strings: { dismiss: 'Schließen' } });
    toast('Gespeichert');
    await flushPromises();
    expect(toaster().getAttribute('aria-label')).toBe('Mitteilungen');
    expect(document.querySelector('.q-toast__close')?.getAttribute('aria-label')).toBe('Schließen');
    w.unmount();
  });
});
