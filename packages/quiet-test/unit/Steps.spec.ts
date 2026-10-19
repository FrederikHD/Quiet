import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { mount } from '@vue/test-utils';
import { QSteps } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';

const steps = [{ label: 'Address' }, { label: 'Shipping' }, { label: 'Payment' }];

describe('QSteps', () => {
  it('is a nav named "Checkout steps" with done, current and todo steps', () => {
    const w = mount(QSteps, { props: { steps, current: 1 } });
    expect(w.get('nav.q-steps').attributes('aria-label')).toBe('Checkout steps');
    const items = w.findAll('li.q-steps__item');
    expect(items.map((i) => i.classes().find((c) => c.startsWith('is-')))).toEqual(['is-done', 'is-current', 'is-todo']);
    expect(items[1].get('.q-steps__step').attributes('aria-current')).toBe('step');
    expect(items[0].find('[aria-current]').exists()).toBe(false);
  });

  it('marks done steps with a check and "(completed)", the rest with numbers', () => {
    const w = mount(QSteps, { props: { steps, current: 1 } });
    const items = w.findAll('li');
    expect(items[0].find('.q-steps__marker svg').exists()).toBe(true);
    expect(items[0].get('.q-steps__marker').attributes('aria-hidden')).toBe('true');
    expect(items[0].get('.q-steps__label').text()).toBe('Address (completed)');
    expect(items[1].get('.q-steps__marker').text()).toBe('2');
    expect(items[2].get('.q-steps__marker').text()).toBe('3');
  });

  it('done steps link back with href; later steps never do', () => {
    const w = mount(QSteps, { props: { steps: steps.map((s, i) => ({ ...s, href: `#s${i}` })), current: 1 } });
    const a = w.get('li.is-done a.q-steps__step');
    expect(a.attributes('href')).toBe('#s0');
    expect(w.find('li.is-current a').exists()).toBe(false);
    expect(w.find('li.is-todo a').exists()).toBe(false);
  });

  it('done steps without href are buttons emitting select when it is listened to', async () => {
    const picks: number[] = [];
    const w = mount(QSteps, { props: { steps, current: 2, onSelect: (i: number) => picks.push(i) } });
    const buttons = w.findAll('button.q-steps__step');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].attributes('type')).toBe('button');
    await buttons[1].trigger('click');
    expect(picks).toEqual([1]);
  });

  it('done steps without href or listener are plain text, not dead buttons', () => {
    const w = mount(QSteps, { props: { steps, current: 2 } });
    expect(w.find('button').exists()).toBe(false);
    expect(w.get('li.is-done .q-steps__step').element.tagName).toBe('SPAN');
  });

  it('clamps current and shows the narrow counter, hidden from screen readers', () => {
    const w = mount(QSteps, { props: { steps: [...steps, null, false], current: 9 } });
    expect(w.findAll('li')).toHaveLength(3);
    expect(w.findAll('li')[2].classes()).toContain('is-current');
    const count = w.get('.q-steps__count');
    expect(count.text()).toBe('Step 3 of 3');
    expect(count.attributes('aria-hidden')).toBe('true');
    expect(mount(QSteps, { props: { steps, current: -2 } }).findAll('li')[0].classes()).toContain('is-current');
  });

  it('shows the counter only when narrow (under 520px of its own width)', () => {
    const css = readFileSync(resolve(__dirname, '../../quiet/src/components/Steps/style.css'), 'utf8');
    expect(css).toMatch(/^\.q-steps__count \{ display: none; \}/m);
    const narrow = css.slice(css.indexOf('@container (max-width: 519px)'));
    expect(narrow).toMatch(/\.q-steps__count \{ display: block;/);
  });

  it('translates its phrases', () => {
    const w = mount(QSteps, {
      props: { steps, current: 1, strings: { label: 'Bestellschritte', done: 'erledigt', step: (i: number, n: number) => `Schritt ${i} von ${n}` } },
    });
    expect(w.get('nav').attributes('aria-label')).toBe('Bestellschritte');
    expect(w.get('li.is-done .q-steps__label').text()).toBe('Address (erledigt)');
    expect(w.get('.q-steps__count').text()).toBe('Schritt 2 von 3');
  });
});
