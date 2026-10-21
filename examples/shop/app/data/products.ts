// The catalogue: what a shop's API would return. Names and descriptions in both languages; prices in euros.
import type { Lang } from '~/locales/messages';

export interface Review {
  id: number;
  stars: number;
  author: string;
  date: string;
  size: string;
  colour: string;
  helpful: number;
  title: Record<Lang, string>;
  text: Record<Lang, string>;
}

export interface Product {
  slug: string;
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  price: number;
  compareAt?: number;
  colours: string[];
  sizes: string[];
  reviews: Review[];
}

const shirtReviews: Review[] = [
  {
    id: 1,
    stars: 5,
    author: 'Anna S.',
    date: '2026-10-12',
    size: 'M',
    colour: 'Navy',
    helpful: 14,
    title: { en: 'Soft from the first wash', de: 'Weich von der ersten Wäsche an' },
    text: {
      en: 'I wear it to work and at the weekend. The linen is soft without being thin.',
      de: 'Ich trage es im Büro und am Wochenende. Das Leinen ist weich, ohne dünn zu sein.',
    },
  },
  {
    id: 2,
    stars: 4,
    author: 'Lea F.',
    date: '2026-09-28',
    size: 'S',
    colour: 'Sand',
    helpful: 21,
    title: { en: 'Lovely, runs a little large', de: 'Schön, fällt etwas groß aus' },
    text: {
      en: 'Beautiful colour. I usually wear a medium and the small fits well, so order a size down.',
      de: 'Schöne Farbe. Ich trage sonst M, und S passt gut – also lieber eine Größe kleiner bestellen.',
    },
  },
  {
    id: 3,
    stars: 3,
    author: 'Paul W.',
    date: '2026-09-14',
    size: 'M',
    colour: 'Sand',
    helpful: 9,
    title: { en: 'Creases easily', de: 'Knittert schnell' },
    text: {
      en: 'Good fit, solid buttons, but it creases the moment you sit down.',
      de: 'Gute Passform, solide Knöpfe, aber es knittert, sobald man sich hinsetzt.',
    },
  },
];

export const products: Product[] = [
  {
    slug: 'linen-shirt',
    name: { en: 'Linen shirt', de: 'Leinenhemd' },
    description: {
      en: 'A relaxed shirt in washed linen, cut a little long to wear open over a T-shirt or tucked in.',
      de: 'Ein lässiges Hemd aus gewaschenem Leinen, etwas länger geschnitten – offen über einem T-Shirt oder in der Hose.',
    },
    price: 59,
    colours: ['Navy', 'Sand', 'Olive', 'Rust'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    reviews: shirtReviews,
  },
  {
    slug: 'linen-trousers',
    name: { en: 'Linen trousers', de: 'Leinenhose' },
    description: {
      en: 'Straight trousers with a drawstring waist and deep pockets. Cool on the hottest days.',
      de: 'Gerade Hose mit Tunnelzug und tiefen Taschen. Kühl an den heißesten Tagen.',
    },
    price: 79,
    compareAt: 99,
    colours: ['Navy', 'Natural'],
    sizes: ['S', 'M', 'L', 'XL'],
    reviews: shirtReviews.slice(0, 2),
  },
  {
    slug: 'linen-shorts',
    name: { en: 'Linen shorts', de: 'Leinenshorts' },
    description: {
      en: 'Knee-length shorts in heavy linen that keeps its shape.',
      de: 'Knielange Shorts aus schwerem Leinen, das seine Form behält.',
    },
    price: 49,
    colours: ['Sand', 'Olive', 'Sage'],
    sizes: ['S', 'M', 'L'],
    reviews: shirtReviews.slice(1),
  },
  {
    slug: 'linen-overshirt',
    name: { en: 'Linen overshirt', de: 'Leinen-Overshirt' },
    description: {
      en: 'A heavier shirt to wear as a light jacket, with two chest pockets.',
      de: 'Ein schwereres Hemd, das man wie eine leichte Jacke trägt, mit zwei Brusttaschen.',
    },
    price: 99,
    colours: ['Olive', 'Rust'],
    sizes: ['M', 'L', 'XL'],
    reviews: [],
  },
  {
    slug: 'linen-t-shirt',
    name: { en: 'Linen T-shirt', de: 'Leinen-T-Shirt' },
    description: {
      en: 'A T-shirt in fine linen jersey. Breathes like linen, feels like cotton.',
      de: 'Ein T-Shirt aus feinem Leinenjersey. Atmet wie Leinen, fühlt sich an wie Baumwolle.',
    },
    price: 39,
    compareAt: 49,
    colours: ['Natural', 'Navy', 'Sage'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    reviews: shirtReviews.slice(0, 1),
  },
  {
    slug: 'linen-scarf',
    name: { en: 'Linen scarf', de: 'Leinenschal' },
    description: {
      en: 'A long, light scarf with frayed ends, for cool summer evenings.',
      de: 'Ein langer, leichter Schal mit Fransen, für kühle Sommerabende.',
    },
    price: 29,
    colours: ['Rust', 'Blue'],
    sizes: ['One size'],
    reviews: [],
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

/** The average and the count per star, from a product's reviews. */
export function ratingOf(p: Product) {
  if (!p.reviews.length) return undefined;
  const value = p.reviews.reduce((n, r) => n + r.stars, 0) / p.reviews.length;
  return { value: Math.round(value * 10) / 10, count: p.reviews.length };
}
