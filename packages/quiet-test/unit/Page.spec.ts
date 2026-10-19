import { mount } from '@vue/test-utils';
import { QPage, QPageColumns } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';

describe('QPage', () => {
  it('renders the h1, a default width and the body', () => {
    const w = mount(QPage, { props: { title: 'Orders' }, slots: { default: '<p>List</p>' } });
    expect(w.classes()).toEqual(expect.arrayContaining(['q-page', 'q-page--default']));
    expect(w.get('h1.q-page__title').text()).toBe('Orders');
    expect(w.get('.q-page__body').text()).toBe('List');
    expect(w.find('.q-page__back').exists()).toBe(false);
    expect(w.find('.q-page__subtitle').exists()).toBe(false);
    expect(w.find('.q-page__actions').exists()).toBe(false);
    expect(w.find('.q-page__meta').exists()).toBe(false);
    expect(w.attributes('data-density')).toBeUndefined();
  });

  it('takes width, density, subtitle, title meta and actions', () => {
    const w = mount(QPage, {
      props: { title: 'Linen shirt', width: 'narrow', density: 'compact', subtitle: 'SKU LS-2040' },
      slots: { 'title-meta': '<span class="badge">Active</span>', actions: '<button>Preview</button>' },
    });
    expect(w.classes()).toContain('q-page--narrow');
    expect(w.attributes('data-density')).toBe('compact');
    expect(w.get('.q-page__subtitle').text()).toBe('SKU LS-2040');
    expect(w.get('.q-page__titleline .q-page__meta .badge').text()).toBe('Active');
    expect(w.get('.q-page__titlerow .q-page__actions button').text()).toBe('Preview');
  });

  it('takes a subtitle slot', () => {
    const w = mount(QPage, { props: { title: 'Order' }, slots: { subtitle: '<a href="#c">Anna</a>' } });
    expect(w.get('.q-page__subtitle a').text()).toBe('Anna');
  });

  it('renders the back link with an arrow, or a button that emits back', async () => {
    const link = mount(QPage, { props: { title: 'Linen shirt', back: { href: '#products', label: 'Products' } } });
    const a = link.get('a.q-page__back');
    expect(a.attributes('href')).toBe('#products');
    expect(a.text()).toBe('Products');
    expect(a.get('.q-lead').attributes('aria-hidden')).toBe('true');
    await a.trigger('click');
    expect(link.emitted('back')).toHaveLength(1);

    const btn = mount(QPage, { props: { title: 'Linen shirt', back: { label: 'Products' } } });
    const b = btn.get('button.q-page__back');
    expect(b.attributes('type')).toBe('button');
    await b.trigger('click');
    expect(btn.emitted('back')).toHaveLength(1);
  });

  it('puts content and aside in two columns', () => {
    const w = mount(QPage, { props: { title: 'Product' }, slots: { default: '<p>Main</p>', aside: '<p>Side</p>' } });
    expect(w.find('.q-page__body').exists()).toBe(false);
    expect(w.get('.q-page__columns .q-page__main').text()).toBe('Main');
    expect(w.get('.q-page__columns .q-page__aside').text()).toBe('Side');
  });

  it('full width', () => {
    expect(mount(QPage, { props: { title: 'Orders', width: 'full' } }).classes()).toContain('q-page--full');
  });
});

describe('QPageColumns', () => {
  it('renders the main and side columns, passing class through', () => {
    const w = mount(QPageColumns, { slots: { default: 'Main', aside: 'Side' }, attrs: { class: 'mine' } });
    expect(w.classes()).toEqual(['q-page__columns', 'mine']);
    expect(w.get('.q-page__main').text()).toBe('Main');
    expect(w.get('.q-page__aside').text()).toBe('Side');
  });
});
