// A class set on a component reaches its root element, also for components whose template starts with a comment
// (an eslint directive or a note): template comments are compiled away, so they never turn the root into a fragment.
import { mount } from '@vue/test-utils';
import { QAddressFields, QInput, QPriceRange } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';
import type { Component } from 'vue';

describe('fallthrough class', () => {
  const cases: [string, Component, Record<string, unknown>][] = [
    ['QInput', QInput, { 'aria-label': 'Title' }],
    ['QPriceRange', QPriceRange, { min: 0, max: 200, label: 'Price' }],
    ['QAddressFields', QAddressFields, {}],
  ];
  it.each(cases)('%s puts it on its root element', (_name, component, props) => {
    const w = mount(component, { props, attrs: { class: 'mine' } });
    expect(w.element.nodeType).toBe(Node.ELEMENT_NODE);
    expect((w.element as Element).classList.contains('mine')).toBe(true);
  });
});
