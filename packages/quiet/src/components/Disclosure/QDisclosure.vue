<script setup lang="ts">
import { useSlots } from 'vue';
import { useQuietId } from '../../composables/useQuietId';
import QIcon from '../Icon/QIcon.vue';

export interface DisclosureProps {
  /** The heading's text (or the `title` slot): "Colour", "Delivery and returns". */
  title?: string;
  /** Beside the title in ink-muted: what's chosen ("Navy, Sand") or a count, so a closed group still says what it holds. */
  meta?: string;
  /** Opens on first render (uncontrolled). */
  defaultOpen?: boolean;
  /** The heading around the button. Default 3; null for no heading. */
  headingLevel?: 2 | 3 | 4 | 5 | 6 | null;
  /** Makes the panel a region named by the button, for long content people jump to. */
  region?: boolean;
  /** The line under it. Default true; false removes it. */
  divider?: boolean;
}

const props = withDefaults(defineProps<DisclosureProps>(), {
  title: undefined,
  meta: undefined,
  headingLevel: 3,
  divider: true,
});
/** Open or not; v-model:open to control it. */
const open = defineModel<boolean>('open', { default: false });
defineSlots<{
  /** What opens and closes. */
  default?(): unknown;
  /** The heading's content, when it needs more than text. */
  title?(): unknown;
  /** Beside the title, when it needs more than text. */
  meta?(): unknown;
}>();

const slots = useSlots();
const id = useQuietId('q-disc-');
if (props.defaultOpen && !open.value) open.value = true;
</script>

<template>
  <div :class="['q-disc', open && 'is-open', !divider && 'q-disc--plain']">
    <component :is="headingLevel ? `h${headingLevel}` : 'div'" class="q-disc__head">
      <button
        :id="`${id}-btn`"
        type="button"
        class="q-disc__btn"
        :aria-expanded="open"
        :aria-controls="`${id}-panel`"
        @click="open = !open"
      >
        <span class="q-disc__title"
          ><slot name="title">{{ title }}</slot></span
        >
        <span v-if="(meta != null && meta !== '') || slots.meta" class="q-disc__meta"
          ><slot name="meta">{{ meta }}</slot></span
        >
        <QIcon name="chevron-down" class="q-disc__chev" />
      </button>
    </component>
    <!-- Closed content is hidden: not in the tab order, not read. Printing opens everything. -->
    <div
      :id="`${id}-panel`"
      class="q-disc__panel"
      :role="region ? 'region' : undefined"
      :aria-labelledby="region ? `${id}-btn` : undefined"
      :hidden="!open"
    >
      <slot />
    </div>
  </div>
</template>
