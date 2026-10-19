import { QDiscountCode } from '@frederikhd/quiet';
import { defineStory } from './story';

export default defineStory({
  component: QDiscountCode,
  name: 'QDiscountCode',
  props: {
    applied: [{ code: 'LINEN10', label: '−10 %' }],
    apply: (code: string) => (code.toUpperCase() === 'FREESHIP' ? undefined : `“${code}” isn’t a valid code`),
  },
  layout: 'block',
});
