import { QProductCard } from 'quiet';
import { photo, swatchOf } from '../fixtures/pictures';
import { defineStory } from './story';

export default defineStory({
  component: QProductCard,
  name: 'QProductCard',
  props: {
    name: 'Linen shirt',
    href: '#shirt',
    image: { src: photo('Navy') },
    price: 59,
    compareAt: 79,
    badges: [{ label: 'Sale', tone: 'sale' }],
    swatches: [{ label: 'Navy', color: swatchOf('Navy') }, { label: 'Sand', color: swatchOf('Sand') }],
    quickAdd: true,
  },
  hide: ['hoverImage', 'headingLevel'],
});
