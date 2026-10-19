import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { QGallery } from '@frederikhd/quiet';
import { afterEach, describe, expect, it } from 'vitest';

enableAutoUnmount(afterEach);
const images = [0, 1, 2].map((i) => ({ src: `s${i}.jpg`, alt: `Linen shirt, view ${i + 1}`, thumb: `t${i}.jpg` }));
const gallery = (props: Record<string, unknown> = {}) =>
  mount(QGallery, { props: { images, ...props } as never, attachTo: document.body });

describe('QGallery', () => {
  it('is a named carousel region with slides "1 of 3"', () => {
    const w = gallery({ label: 'Linen shirt images' });
    const track = w.get('.q-gallery__track');
    expect(track.attributes('role')).toBe('region');
    expect(track.attributes('aria-roledescription')).toBe('carousel');
    expect(track.attributes('aria-label')).toBe('Linen shirt images');
    expect(track.attributes('tabindex')).toBe('0');
    const slides = w.findAll('.q-gallery__slide');
    expect(slides).toHaveLength(3);
    expect(slides[0].attributes('aria-label')).toBe('1 of 3');
    expect(slides[0].attributes('aria-roledescription')).toBe('slide');
    expect(slides[0].attributes('aria-hidden')).toBeUndefined();
    expect(slides[1].attributes('aria-hidden')).toBe('true');
    expect(slides[0].get('button').attributes('aria-label')).toBe('Enlarge image: Linen shirt, view 1');
    expect(slides[1].get('button').attributes('tabindex')).toBe('-1');
    expect(w.get('.q-gallery__counter').text()).toBe('1 / 3');
    expect(gallery().get('.q-gallery__track').attributes('aria-label')).toBe('Product images');
  });

  it('moves with the arrows, announces the image and emits update:index', async () => {
    const w = gallery();
    expect(w.get('.q-gallery__nav--prev').attributes('disabled')).toBeDefined();
    await w.get('.q-gallery__nav--next').trigger('click');
    expect(w.emitted('update:index')![0]).toEqual([1]);
    expect(w.get('[aria-live="polite"]').text()).toBe('Image 2 of 3');
    expect(w.findAll('.q-gallery__slide')[1].attributes('aria-hidden')).toBeUndefined();
    expect(w.get('.q-gallery__counter').text()).toBe('2 / 3');
  });

  it('handles ← → Home End on the stage', async () => {
    const w = gallery();
    const track = w.get('.q-gallery__track');
    await track.trigger('keydown', { key: 'End' });
    expect(w.emitted('update:index')!.at(-1)).toEqual([2]);
    expect(w.get('.q-gallery__nav--next').attributes('disabled')).toBeDefined();
    await track.trigger('keydown', { key: 'ArrowLeft' });
    expect(w.emitted('update:index')!.at(-1)).toEqual([1]);
    await track.trigger('keydown', { key: 'Home' });
    expect(w.emitted('update:index')!.at(-1)).toEqual([0]);
    await track.trigger('keydown', { key: 'ArrowRight' });
    expect(w.emitted('update:index')!.at(-1)).toEqual([1]);
  });

  it('has thumbnails with names and aria-current, unless turned off', async () => {
    const w = gallery();
    const thumbs = w.findAll('.q-gallery__thumb');
    expect(thumbs).toHaveLength(3);
    expect(thumbs[0].attributes('aria-label')).toBe('Show image 1 of 3');
    expect(thumbs[0].attributes('aria-current')).toBe('true');
    expect(thumbs[2].get('img').attributes('src')).toBe('t2.jpg');
    await thumbs[2].trigger('click');
    expect(w.emitted('update:index')![0]).toEqual([2]);
    expect(w.findAll('.q-gallery__thumb')[2].classes()).toContain('is-current');
    expect(gallery({ thumbnails: false }).find('.q-gallery__thumbs').exists()).toBe(false);
  });

  it('starts at defaultIndex or the bound index', () => {
    expect(gallery({ defaultIndex: 2 }).get('.q-gallery__counter').text()).toBe('3 / 3');
    expect(gallery({ index: 1 }).get('.q-gallery__counter').text()).toBe('2 / 3');
  });

  it('opens a larger view in a dialog titled by the alt text', async () => {
    const w = gallery();
    await w.get('.q-gallery__zoom').trigger('click');
    await flushPromises();
    const big = document.querySelector('.q-gallery__big')!;
    expect(big).not.toBeNull();
    expect(big.getAttribute('role')).toBe('group');
    expect(big.getAttribute('aria-label')).toBe('1 of 3');
    expect(big.querySelector('img')!.getAttribute('alt')).toBe('Linen shirt, view 1');
    expect(document.body.textContent).toContain('Linen shirt, view 1');
  });

  it('shows one image without arrows or thumbnails, and a placeholder without any', () => {
    const one = gallery({ images: images.slice(0, 1), aspect: 'square' });
    expect(one.classes()).toContain('q-gallery--square');
    expect(one.find('.q-gallery__nav').exists()).toBe(false);
    expect(one.find('.q-gallery__thumbs').exists()).toBe(false);
    expect(gallery({ images: [] }).find('.q-gallery__empty').exists()).toBe(true);
  });

  it('goes back to the first image when the images change', async () => {
    const w = gallery({ index: 2 });
    await w.setProps({ images: images.map((im) => ({ ...im, src: `x${im.src}` })) } as never);
    expect(w.emitted('update:index')!.at(-1)).toEqual([0]);
  });
});
