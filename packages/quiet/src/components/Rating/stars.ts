import { fmt } from '../../config';

export const STAR_PATH = 'M10 2.6l2.27 4.6 5.08.74-3.67 3.58.87 5.06L10 14.2l-4.55 2.38.87-5.06L2.65 7.94l5.08-.74z';

export interface RatingStrings {
  label?: (value: string, count?: number) => string;
  none?: string;
  count?: (n: number) => string;
  stars?: (n: number) => string;
  words?: string[];
  yours?: string;
}

export function ratingDefaults(): Required<RatingStrings> {
  return {
    label: (v, n) => `Rated ${v} out of 5${n != null ? `, ${n === 1 ? '1 review' : `${fmt(n)} reviews`}` : ''}`,
    none: 'No reviews yet',
    count: (n) => `(${fmt(n)})`,
    stars: (n) => `${n} ${n === 1 ? 'star' : 'stars'}`,
    words: ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'],
    yours: 'Your rating',
  };
}
