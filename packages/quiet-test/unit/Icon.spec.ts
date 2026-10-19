import { mount } from '@vue/test-utils';
import { QIcon, iconNames } from '@frederikhd/quiet';
import { describe, expect, it, vi } from 'vitest';

describe('QIcon', () => {
  it('has the whole set of 53 icons', () => {
    expect(iconNames).toHaveLength(53);
    expect(iconNames).toEqual(expect.arrayContaining(['search', 'chevron-down', 'more', 'trash', 'bell']));
  });

  it('renders a decorative 20px svg hidden from screen readers by default', () => {
    const w = mount(QIcon, { props: { name: 'check' } });
    const svg = w.get('svg');
    expect(svg.classes()).toContain('q-icon');
    expect(svg.attributes('viewBox')).toBe('0 0 20 20');
    expect(svg.attributes('aria-hidden')).toBe('true');
    expect(svg.attributes('focusable')).toBe('false');
    expect(svg.attributes('role')).toBeUndefined();
    expect(svg.attributes('style')).toContain('var(--icon-md)');
    expect(w.findAll('path')).toHaveLength(1);
  });

  it('becomes role="img" with a name when labelled', () => {
    const svg = mount(QIcon, { props: { name: 'check-circle', label: 'In stock' } }).get('svg');
    expect(svg.attributes('role')).toBe('img');
    expect(svg.attributes('aria-label')).toBe('In stock');
    expect(svg.attributes('aria-hidden')).toBeUndefined();
  });

  it('maps sizes to tokens', () => {
    for (const [size, token] of [
      ['sm', '--icon-sm'],
      ['lg', '--icon-lg'],
      ['control', '--ctl-icon'],
    ] as const) {
      expect(
        mount(QIcon, { props: { name: 'x', size } })
          .get('svg')
          .attributes('style'),
      ).toContain(token);
    }
  });

  it('renders the mixed shapes of an icon', () => {
    const w = mount(QIcon, { props: { name: 'info' } });
    expect(w.findAll('circle')).toHaveLength(2);
    expect(w.findAll('path')).toHaveLength(1);
  });

  it('renders nothing and warns for an unknown name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const w = mount(QIcon, { props: { name: 'nope' as never } });
    expect(w.find('svg').exists()).toBe(false);
    expect(warn).toHaveBeenCalled();
  });
});
