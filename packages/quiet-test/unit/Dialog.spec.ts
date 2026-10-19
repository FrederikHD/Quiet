import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { configure, QButton, QDialog, QPopover } from '@frederikhd/quiet';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';

const dialog = () => document.querySelector<HTMLElement>('.q-dialog__panel');
const key = (k: string, opts: KeyboardEventInit = {}) =>
  (document.activeElement ?? document).dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...opts }));

function mountDialog(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  return mount(QDialog, {
    props: { title: 'Edit shipping address', open: true, 'onUpdate:open': () => {}, ...props },
    slots: { default: () => h('input', { class: 'first' }), ...slots },
    attachTo: document.body,
  });
}

enableAutoUnmount(afterEach);

describe('QDialog', () => {
  afterEach(() => configure({ strings: { dialog: { close: 'Close' } } }));

  it('renders nothing while closed', () => {
    mountDialog({ open: false });
    expect(document.querySelector('.q-dialog')).toBeNull();
  });

  it('is a labelled, described modal dialog with a named close button', async () => {
    mountDialog({ description: 'Where the order goes.' });
    await flushPromises();
    const p = dialog()!;
    expect(p.getAttribute('role')).toBe('dialog');
    expect(p.getAttribute('aria-modal')).toBe('true');
    expect(document.getElementById(p.getAttribute('aria-labelledby')!)?.textContent).toBe('Edit shipping address');
    expect(document.getElementById(p.getAttribute('aria-describedby')!)?.textContent).toBe('Where the order goes.');
    expect(p.querySelector('h2.q-dialog__title')).not.toBeNull();
    expect(p.querySelector('.q-dialog__header button')?.getAttribute('aria-label')).toBe('Close');
  });

  it('applies size, mobile and placement classes, and alertdialog', async () => {
    mountDialog({ size: 'lg', mobile: 'full', role: 'alertdialog' });
    await flushPromises();
    expect(document.querySelector('.q-dialog')!.classList.contains('q-dialog--full')).toBe(true);
    expect(dialog()!.classList.contains('q-dialog__panel--lg')).toBe(true);
    expect(dialog()!.getAttribute('role')).toBe('alertdialog');
  });

  it('is a drawer with placement start or end', async () => {
    mountDialog({ placement: 'end' });
    await flushPromises();
    const root = document.querySelector('.q-dialog')!;
    expect(root.classList.contains('q-dialog--drawer')).toBe(true);
    expect(root.classList.contains('q-dialog--end')).toBe(true);
  });

  it('focuses the first control in the body', async () => {
    mountDialog();
    await flushPromises();
    expect(document.activeElement?.className).toBe('first');
  });

  it('focuses the first footer button when the body has no controls (Cancel)', async () => {
    mountDialog({}, { default: () => h('p', 'Sure?'), footer: () => [h(QButton, { class: 'cancel' }, () => 'Cancel'), h(QButton, null, () => 'Delete')] });
    await flushPromises();
    expect(document.activeElement?.classList.contains('cancel')).toBe(true);
  });

  it('focuses initialFocus when given', async () => {
    const App = defineComponent(() => {
      const target = ref<HTMLElement | null>(null);
      return () =>
        h(QDialog, { open: true, title: 'T', initialFocus: target.value }, () => [h('input'), h('button', { ref: target, class: 'mine' }, 'Go')]);
    });
    mount(App, { attachTo: document.body });
    await flushPromises();
    expect(document.activeElement?.className).toBe('mine');
  });

  it('focuses an initialFocus template ref when opened later', async () => {
    const open = ref(false);
    const App = defineComponent(() => {
      const target = ref<HTMLElement | null>(null);
      return () =>
        h(QDialog, { open: open.value, title: 'T', initialFocus: target.value }, () => [h('input'), h('button', { ref: target, class: 'mine' }, 'Go')]);
    });
    mount(App, { attachTo: document.body });
    open.value = true;
    await flushPromises();
    expect(document.activeElement?.className).toBe('mine');
  });

  it('closes on Escape, the ×, and a click on the backdrop: emits close and update:open', async () => {
    const w = mountDialog();
    await flushPromises();
    key('Escape');
    expect(w.emitted('close')).toHaveLength(1);
    expect(w.emitted('update:open')?.[0]).toEqual([false]);

    (dialog()!.querySelector('.q-dialog__header button') as HTMLButtonElement).click();
    expect(w.emitted('close')).toHaveLength(2);

    const scrim = document.querySelector('.q-dialog') as HTMLElement;
    scrim.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    scrim.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(w.emitted('close')).toHaveLength(3);

    // A press that starts inside the panel and ends on the backdrop doesn't close it.
    dialog()!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    scrim.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(w.emitted('close')).toHaveLength(3);
  });

  it('with dismissible=false: no ×, and Escape and the backdrop do nothing', async () => {
    const w = mountDialog({ dismissible: false });
    await flushPromises();
    expect(dialog()!.querySelector('.q-dialog__header button')).toBeNull();
    key('Escape');
    const scrim = document.querySelector('.q-dialog') as HTMLElement;
    scrim.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    scrim.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(w.emitted('close')).toBeUndefined();
  });

  it('shows a text close button with closeText, and translates the × name', async () => {
    mountDialog({ closeText: 'Done' });
    await flushPromises();
    expect(dialog()!.querySelector('.q-dialog__header button')?.textContent).toBe('Done');
    document.body.innerHTML = '';
    configure({ strings: { dialog: { close: 'Schließen' } } });
    mountDialog();
    await flushPromises();
    expect(dialog()!.querySelector('.q-dialog__header button')?.getAttribute('aria-label')).toBe('Schließen');
    document.body.innerHTML = '';
    mountDialog({ closeLabel: 'Fermer' });
    await flushPromises();
    expect(dialog()!.querySelector('.q-dialog__header button')?.getAttribute('aria-label')).toBe('Fermer');
  });

  it('keeps Tab inside the dialog', async () => {
    mountDialog({}, { default: () => h('input', { class: 'first' }), footer: () => h('button', { class: 'last' }, 'Save') });
    await flushPromises();
    const last = dialog()!.querySelector<HTMLElement>('.last')!;
    const close = dialog()!.querySelector<HTMLElement>('.q-dialog__header button')!;
    last.focus();
    key('Tab');
    expect(document.activeElement).toBe(close);
    key('Tab', { shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it('locks and inerts the page while open, and gives focus back on close', async () => {
    const opener = document.createElement('button');
    const other = document.createElement('div');
    document.body.append(opener, other);
    opener.focus();
    const open = ref(false);
    const App = defineComponent(() => () =>
      h(QDialog, { open: open.value, 'onUpdate:open': (v: boolean) => (open.value = v), title: 'T' }, () => h('input')),
    );
    mount(App, { attachTo: other });
    open.value = true;
    await flushPromises();
    expect(document.body.style.overflow).toBe('hidden');
    expect(opener.hasAttribute('inert')).toBe(true);
    expect(other.hasAttribute('inert')).toBe(true);
    expect(document.querySelector('.q-dialog')!.hasAttribute('inert')).toBe(false);
    key('Escape');
    await flushPromises();
    expect(document.querySelector('.q-dialog')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(opener.hasAttribute('inert')).toBe(false);
    expect(document.activeElement).toBe(opener);
  });

  it('leaves the toaster live', async () => {
    const toaster = document.createElement('section');
    toaster.className = 'q-toaster';
    document.body.append(toaster);
    mountDialog();
    await flushPromises();
    expect(toaster.hasAttribute('inert')).toBe(false);
  });

  it('lets a popover inside close first on Escape', async () => {
    const w = mount(QDialog, {
      props: { open: true, title: 'T' },
      slots: { default: () => h(QPopover, { label: 'Help', content: 'Text', kind: 'tip' }, () => h('button', { class: 'help' }, '?')) },
      attachTo: document.body,
    });
    await flushPromises();
    (document.querySelector('.help') as HTMLElement).click();
    await flushPromises();
    await new Promise((r) => setTimeout(r, 20));
    expect(document.querySelector('.q-popover')).not.toBeNull();
    key('Escape');
    await flushPromises();
    expect(document.querySelector('.q-popover')).toBeNull();
    expect(w.emitted('close')).toBeUndefined();
    key('Escape');
    expect(w.emitted('close')).toHaveLength(1);
  });

  it('takes rich title and description from slots, a footer, flush body and density', async () => {
    mountDialog(
      { flush: true, density: 'compact' },
      { title: () => h('em', 'Rich'), description: () => h('strong', 'Desc'), footer: () => h('button', 'OK') },
    );
    await flushPromises();
    const p = dialog()!;
    expect(p.querySelector('.q-dialog__title em')?.textContent).toBe('Rich');
    expect(document.getElementById(p.getAttribute('aria-describedby')!)?.querySelector('strong')?.textContent).toBe('Desc');
    expect(p.querySelector('.q-dialog__footer button')?.textContent).toBe('OK');
    expect(p.querySelector('.q-dialog__body--flush')).not.toBeNull();
    expect(document.querySelector('.q-dialog')!.getAttribute('data-density')).toBe('compact');
  });

  it('puts class and attributes on the panel', async () => {
    mount(QDialog, { props: { open: true, title: 'T' }, attrs: { class: 'mine', 'data-x': '1' }, attachTo: document.body });
    await flushPromises();
    expect(dialog()!.classList.contains('mine')).toBe(true);
    expect(dialog()!.getAttribute('data-x')).toBe('1');
  });
});
