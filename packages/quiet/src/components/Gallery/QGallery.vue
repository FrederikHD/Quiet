<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useStrings } from '../../config';
import QButton from '../Button/QButton.vue';
import QDialog from '../Dialog/QDialog.vue';
import QIcon from '../Icon/QIcon.vue';

export interface GalleryImage {
  src: string;
  /** What the image shows ("Linen shirt, back"); names the enlarge button and the larger view. */
  alt: string;
  /** A smaller file for the thumbnail. Default: src. */
  thumb?: string;
  /** A larger file for the enlarged view. Default: src. */
  zoom?: string;
}
export interface GalleryStrings {
  label?: string;
  slide?: (i: number, n: number) => string;
  previous?: string;
  next?: string;
  show?: (i: number, n: number) => string;
  zoom?: string;
  counter?: (i: number, n: number) => string;
  showing?: (i: number, n: number) => string;
}
export interface GalleryProps {
  /** The product's images, main image first. */
  images: GalleryImage[];
  /** Names the carousel: "Linen shirt images". */
  label?: string;
  /** portrait (4:5, default) or square; match the ProductCards. */
  aspect?: 'portrait' | 'square';
  /** The row of thumbnails under the stage (with two or more images). Default true. */
  thumbnails?: boolean;
  /** The image shown first when v-model:index isn't bound (0-based). */
  defaultIndex?: number;
  /** Translations; or once for the shop with configure() under strings.gallery. */
  strings?: GalleryStrings;
}

const props = withDefaults(defineProps<GalleryProps>(), {
  label: undefined,
  aspect: 'portrait',
  thumbnails: true,
  defaultIndex: undefined,
  strings: undefined,
});
/** The image shown (0-based). */
const index = defineModel<number>('index');
if (index.value === undefined && props.defaultIndex) index.value = props.defaultIndex;

const strings = useStrings<Required<GalleryStrings>>(
  'gallery',
  {
    label: 'Product images',
    slide: (i, n) => `${i} of ${n}`,
    previous: 'Previous image',
    next: 'Next image',
    show: (i, n) => `Show image ${i} of ${n}`,
    zoom: 'Enlarge image',
    counter: (i, n) => `${i} / ${n}`,
    showing: (i, n) => `Image ${i} of ${n}`,
  },
  () => props.strings,
);
const images = computed(() => props.images.filter(Boolean));
const n = computed(() => images.value.length);
const at = computed(() => Math.max(0, Math.min(index.value ?? 0, n.value - 1)));
const zoom = ref(false);
const live = ref('');
const track = ref<HTMLElement | null>(null);
const thumbs = ref<HTMLElement | null>(null);

// Swipe (native scroll-snap) on touch, arrows and thumbnails on desktop, ← → on the focused stage.
function go(i: number, announce: boolean) {
  const next = Math.max(0, Math.min(n.value - 1, i));
  index.value = next;
  if (announce) live.value = strings.value.showing(next + 1, n.value);
  const t = track.value;
  if (t) {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    t.scrollTo?.({ left: next * t.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
  }
}
// Swiping moves the index too.
function onScroll() {
  const t = track.value;
  if (!t?.clientWidth) return;
  const i = Math.round(t.scrollLeft / t.clientWidth);
  if (i !== at.value && Math.abs(t.scrollLeft - i * t.clientWidth) < 4) index.value = i;
}
// A new set of images (another colour) starts at the first.
watch(
  () => images.value.map((im) => im.src).join('|'),
  () => {
    index.value = 0;
    if (track.value) track.value.scrollLeft = 0;
  },
);
// Start on the chosen image.
onMounted(() => {
  if (track.value && at.value) track.value.scrollLeft = at.value * track.value.clientWidth;
});
// Keep the current thumbnail in view.
watch(at, (i) => {
  const row = thumbs.value;
  const b = row?.children[i] as HTMLElement | undefined;
  if (!row || !b) return;
  if (b.offsetLeft < row.scrollLeft || b.offsetLeft + b.offsetWidth > row.scrollLeft + row.clientWidth) row.scrollLeft = b.offsetLeft - 8;
});
function onKeyDown(e: KeyboardEvent) {
  const to = e.key === 'ArrowRight' ? at.value + 1 : e.key === 'ArrowLeft' ? at.value - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? n.value - 1 : null;
  if (to == null) return;
  e.preventDefault();
  go(to, true);
}
const current = computed(() => images.value[at.value]);
</script>

<template>
  <div v-if="!n" class="q-gallery">
    <div class="q-gallery__stage q-gallery__empty"><QIcon name="image" size="lg" /></div>
  </div>
  <div v-else :class="['q-gallery', aspect === 'square' && 'q-gallery--square']">
    <div class="q-gallery__stage">
      <div
        ref="track"
        class="q-gallery__track"
        role="region"
        aria-roledescription="carousel"
        :aria-label="label ?? strings.label"
        tabindex="0"
        @keydown="onKeyDown"
        @scroll="onScroll"
      >
        <div
          v-for="(im, i) in images"
          :key="i"
          class="q-gallery__slide"
          role="group"
          aria-roledescription="slide"
          :aria-label="strings.slide(i + 1, n)"
          :aria-hidden="i === at ? undefined : 'true'"
        >
          <button
            type="button"
            class="q-gallery__zoom"
            :tabindex="i === at ? 0 : -1"
            :aria-label="strings.zoom + (im.alt ? `: ${im.alt}` : '')"
            @click="zoom = true"
          >
            <img :src="im.src" alt="" :loading="i === 0 ? 'eager' : 'lazy'" decoding="async" draggable="false" />
          </button>
        </div>
      </div>
      <template v-if="n > 1">
        <QButton
          class="q-gallery__nav q-gallery__nav--prev"
          icon-start="chevron-left"
          :aria-label="strings.previous"
          :disabled="at === 0"
          @click="go(at - 1, true)"
        />
        <QButton
          class="q-gallery__nav q-gallery__nav--next"
          icon-start="chevron-right"
          :aria-label="strings.next"
          :disabled="at === n - 1"
          @click="go(at + 1, true)"
        />
        <span class="q-gallery__counter" aria-hidden="true">{{ strings.counter(at + 1, n) }}</span>
      </template>
      <span class="q-visually-hidden" aria-live="polite">{{ live }}</span>
    </div>
    <div v-if="n > 1 && thumbnails" ref="thumbs" class="q-gallery__thumbs">
      <button
        v-for="(im, i) in images"
        :key="i"
        type="button"
        :class="['q-gallery__thumb', i === at && 'is-current']"
        :aria-label="strings.show(i + 1, n)"
        :aria-current="i === at ? 'true' : undefined"
        @click="go(i, false)"
      >
        <img :src="im.thumb ?? im.src" alt="" loading="lazy" decoding="async" draggable="false" />
      </button>
    </div>
    <QDialog v-model:open="zoom" :title="current.alt || label || strings.label" size="lg" mobile="full" flush class="q-gallery__dialog">
      <div class="q-gallery__big" role="group" tabindex="0" :aria-label="strings.slide(at + 1, n)" @keydown="onKeyDown">
        <img :src="current.zoom ?? current.src" :alt="current.alt" />
        <div v-if="n > 1" class="q-gallery__bignav">
          <QButton icon-start="chevron-left" :aria-label="strings.previous" :disabled="at === 0" @click="go(at - 1, true)" />
          <span class="q-gallery__bigcount">{{ strings.counter(at + 1, n) }}</span>
          <QButton icon-start="chevron-right" :aria-label="strings.next" :disabled="at === n - 1" @click="go(at + 1, true)" />
        </div>
      </div>
    </QDialog>
  </div>
</template>
