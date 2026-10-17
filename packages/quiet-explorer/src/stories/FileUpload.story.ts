import { QFileUpload } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QFileUpload,
  name: 'QFileUpload',
  props: { variant: 'files', multiple: false, accept: '.pdf,application/pdf', acceptLabel: 'a PDF', maxSize: 5242880 },
  model: { value: [] },
  field: { label: 'Certificate', hint: 'One PDF, up to 5 MB.' },
  hide: ['id', 'name'],
});
