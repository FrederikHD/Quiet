import { QGallery } from 'quiet';
import { h } from 'vue';
import { photo } from '../fixtures/pictures';
import { defineStory } from './story';

export default defineStory({
  component: QGallery,
  name: 'QGallery',
  props: {
    label: 'Linen shirt images',
    images: [0, 1, 2].map((v) => ({ src: photo('Navy', v), alt: `Linen shirt, view ${v + 1}` })),
  },
  model: { prop: 'index', value: 0 },
  // images hold long data: URIs: kept, but not as an editable JSON blob.
  hide: ['images'],
  // The gallery fills its column; give it a product-page width.
  wrap: (target) => h('div', { style: 'width: min(360px, 100%)' }, [target()]),
});
