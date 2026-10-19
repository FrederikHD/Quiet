import { mount } from '@vue/test-utils';
import { QBreadcrumbs, type BreadcrumbItem } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';

const trail: (BreadcrumbItem | null | false)[] = [{ label: 'Home', href: '/' }, null, { label: 'Shirts', href: '/shirts' }, false, { label: 'Linen shirt' }];

describe('QBreadcrumbs', () => {
  it('is a nav named "Breadcrumb" with an ordered list, skipping null and false', () => {
    const w = mount(QBreadcrumbs, { props: { items: trail } });
    expect(w.get('nav.q-crumbs').attributes('aria-label')).toBe('Breadcrumb');
    expect(w.findAll('ol.q-crumbs__list > li.q-crumbs__item')).toHaveLength(3);
  });

  it('makes the last item without href the current page, and the one before it the parent', () => {
    const w = mount(QBreadcrumbs, { props: { items: trail } });
    const items = w.findAll('li');
    expect(items[2].classes()).toContain('is-current');
    const cur = items[2].get('.q-crumbs__current');
    expect(cur.element.tagName).toBe('SPAN');
    expect(cur.attributes('aria-current')).toBe('page');
    expect(items[1].classes()).toContain('is-parent');
    expect(items[1].find('.q-crumbs__back .q-lead').exists()).toBe(true);
    expect(items[0].find('.q-crumbs__back').exists()).toBe(false);
    expect(items[0].get('a.q-crumbs__link').attributes('href')).toBe('/');
  });

  it('separates items with hidden chevrons', () => {
    const w = mount(QBreadcrumbs, { props: { items: trail } });
    const seps = w.findAll('.q-crumbs__sep');
    expect(seps).toHaveLength(2);
    seps.forEach((s) => expect(s.attributes('aria-hidden')).toBe('true'));
    expect(w.findAll('li')[0].find('.q-crumbs__sep').exists()).toBe(false);
  });

  it('with a link last, that link is the parent and nothing is current', () => {
    const w = mount(QBreadcrumbs, { props: { items: [{ label: 'Home', href: '/' }, { label: 'Shirts', href: '/shirts' }] } });
    expect(w.find('[aria-current]').exists()).toBe(false);
    expect(w.findAll('li')[1].classes()).toContain('is-parent');
  });

  it('emits navigate with the item', async () => {
    const w = mount(QBreadcrumbs, { props: { items: trail } });
    await w.get('a[href="/shirts"]').trigger('click');
    expect(w.emitted('navigate')![0][0]).toEqual({ label: 'Shirts', href: '/shirts' });
  });

  it('takes its name from aria-label or strings', () => {
    expect(mount(QBreadcrumbs, { props: { items: [] }, attrs: { 'aria-label': 'Pfad' } }).get('nav').attributes('aria-label')).toBe('Pfad');
    expect(mount(QBreadcrumbs, { props: { items: [], strings: { label: 'Brotkrumen' } } }).get('nav').attributes('aria-label')).toBe('Brotkrumen');
  });
});
