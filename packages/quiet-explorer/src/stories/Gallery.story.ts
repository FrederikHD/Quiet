import { QGallery } from 'quiet';
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
});
