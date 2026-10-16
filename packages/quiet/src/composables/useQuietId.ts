import { useId } from 'vue';
import { safeId } from '../utils/dom';

/** A stable, SSR-safe id with a readable prefix: useQuietId('q-dialog-') → "q-dialog-v-3". */
export function useQuietId(prefix: string): string {
  return prefix + safeId(useId() ?? '');
}
