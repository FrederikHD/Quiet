import { mount } from '@vue/test-utils';
import { configure, QButton, QNotice } from '@frederikhd/quiet';
import { afterEach, describe, expect, it } from 'vitest';
import { h } from 'vue';

describe('QNotice', () => {
  afterEach(() => configure({ strings: { notice: { dismiss: 'Dismiss', prefix: { info: '', success: '', warning: 'Warning:', danger: 'Error:' } } } }));

  it('renders an info notice that is part of the page (no live role)', () => {
    const w = mount(QNotice, { slots: { default: 'Example shop: nothing is charged.' } });
    expect(w.classes()).toEqual(['q-notice', 'q-notice--info']);
    expect(w.attributes('role')).toBeUndefined();
    expect(w.get('.q-notice__icon').attributes('aria-hidden')).toBe('true');
    expect(w.get('.q-notice__text').text()).toBe('Example shop: nothing is charged.');
    expect(w.find('.q-notice__title').exists()).toBe(false);
    expect(w.find('.q-notice__dismiss').exists()).toBe(false);
  });

  it('prefixes warnings and errors for screen readers, on the title or else the text', () => {
    const titled = mount(QNotice, { props: { tone: 'danger', title: 'Payment failed' }, slots: { default: 'The card was declined.' } });
    expect(titled.get('.q-notice__title .q-visually-hidden').text()).toBe('Error:');
    expect(titled.get('.q-notice__title').text()).toBe('Error: Payment failed');
    expect(titled.find('.q-notice__text .q-visually-hidden').exists()).toBe(false);

    const plain = mount(QNotice, { props: { tone: 'warning' }, slots: { default: '3 products are out of stock.' } });
    expect(plain.get('.q-notice__text .q-visually-hidden').text()).toBe('Warning:');

    const ok = mount(QNotice, { props: { tone: 'success', title: 'Your shop is live' } });
    expect(ok.find('.q-visually-hidden').exists()).toBe(false);
  });

  it('shows actions under the text', () => {
    const w = mount(QNotice, {
      props: { tone: 'warning', title: '3 products are out of stock' },
      slots: { actions: () => h(QButton, { size: 'slim' }, () => 'Open inventory') },
    });
    expect(w.get('.q-notice__body .q-notice__actions button').text()).toBe('Open inventory');
  });

  it('adds a named × that emits dismiss', async () => {
    const w = mount(QNotice, { props: { dismissible: true, title: 'Payment failed', tone: 'danger' } });
    const x = w.get('button.q-notice__dismiss');
    expect(x.attributes('aria-label')).toBe('Dismiss');
    await x.trigger('click');
    expect(w.emitted('dismiss')).toHaveLength(1);
  });

  it('takes a role when it appears in response to something', () => {
    expect(mount(QNotice, { props: { role: 'status' } }).attributes('role')).toBe('status');
    expect(mount(QNotice, { props: { role: 'alert' } }).attributes('role')).toBe('alert');
  });

  it('falls back to info for an unknown tone and accepts its own icon', () => {
    const w = mount(QNotice, { props: { tone: 'odd' as never, icon: 'truck' } });
    expect(w.classes()).toContain('q-notice--info');
    expect(w.find('.q-notice__icon svg').exists()).toBe(true);
  });

  it('takes a rich title from the title slot', () => {
    const w = mount(QNotice, { props: { tone: 'danger' }, slots: { title: () => h('strong', 'Payment failed') } });
    expect(w.get('.q-notice__title strong').text()).toBe('Payment failed');
    expect(w.get('.q-notice__title').text()).toBe('Error: Payment failed');
  });

  it('translates through configure() and its own strings prop', () => {
    configure({ strings: { notice: { dismiss: 'Schließen', prefix: { danger: 'Fehler:' } } } });
    const w = mount(QNotice, { props: { dismissible: true, tone: 'danger', title: 'Zahlung fehlgeschlagen' } });
    expect(w.get('.q-notice__dismiss').attributes('aria-label')).toBe('Schließen');
    expect(w.get('.q-visually-hidden').text()).toBe('Fehler:');
    const own = mount(QNotice, { props: { dismissible: true, strings: { dismiss: 'Ausblenden' } } });
    expect(own.get('.q-notice__dismiss').attributes('aria-label')).toBe('Ausblenden');
  });
});
