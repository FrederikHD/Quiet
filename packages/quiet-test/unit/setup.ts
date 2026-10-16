// jsdom lacks a few browser APIs the components use; these stand-ins are enough for behaviour tests.
import { afterEach } from 'vitest';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;

window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia;

Element.prototype.scrollIntoView ??= function () {};
window.scrollTo ??= (() => {}) as typeof window.scrollTo;
HTMLElement.prototype.scrollTo ??= function () {};

// jsdom has no layout: report every element as rendered, so "visible focusables" are found.
Element.prototype.getClientRects = function () {
  return [{ width: 1, height: 1, top: 0, left: 0, right: 1, bottom: 1 }] as unknown as DOMRectList;
};

afterEach(() => {
  document.body.innerHTML = '';
  document.body.removeAttribute('style');
});
