// The modal plumbing every overlay shares: making the rest of the page inert while one is open.
import { describe, expect, it } from 'vitest';
import { inertAllBut, releaseInert } from '../../quiet/src/utils/overlay';

function page(html: string) {
  document.body.innerHTML = html;
  return (id: string) => document.getElementById(id)!;
}

describe('inertAllBut', () => {
  it('inerts the other body children around a teleported overlay, and releases them', () => {
    const $ = page('<div id="app"></div><div id="dialog"></div><script></script>');
    const mine = inertAllBut($('dialog'));
    expect($('app').hasAttribute('inert')).toBe(true);
    expect($('dialog').hasAttribute('inert')).toBe(false);
    releaseInert(mine);
    expect($('app').hasAttribute('inert')).toBe(false);
  });

  it('keeps the path to an in-place overlay live and inerts everything around it', () => {
    const $ = page(`
      <header id="explorer-bar"></header>
      <main id="main"><p id="text"></p>
        <div id="shell"><nav id="shell-nav"></nav><div id="drawer"></div></div>
      </main>`);
    const mine = inertAllBut($('drawer'));
    for (const id of ['explorer-bar', 'text', 'shell-nav']) expect($(id).hasAttribute('inert'), id).toBe(true);
    for (const id of ['main', 'shell', 'drawer']) expect($(id).hasAttribute('inert'), id).toBe(false);
    releaseInert(mine);
    expect(document.querySelectorAll('[inert]')).toHaveLength(0);
  });

  it('leaves inert set by someone else alone', () => {
    const $ = page('<div id="other" inert></div><div id="dialog"></div>');
    releaseInert(inertAllBut($('dialog')));
    expect($('other').hasAttribute('inert')).toBe(true);
  });
});
