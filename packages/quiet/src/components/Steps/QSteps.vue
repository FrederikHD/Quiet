<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import { useStrings } from '../../config';
import QIcon from '../Icon/QIcon.vue';

export interface StepItem {
  /** The step's name: "Shipping". */
  label: string;
  /** Finished steps link back here. Without href they are buttons that emit `select` — when you listen to it; otherwise plain text. */
  href?: string;
  /** Stable key for the list (default: the index). */
  key?: string;
}
export interface StepsProps {
  /** The steps, in order. null and false entries are skipped. */
  steps: (StepItem | null | false)[];
  /** Index of the current step. Earlier steps show a check and link back; later ones are plain text (you can't skip ahead). */
  current: number;
  /** Translations: the landmark's name ("Checkout steps"), what a finished step is ("completed"), and the narrow counter ("Step 2 of 3"); or once with configure({ strings: { steps } }). */
  strings?: { label?: string; done?: string; step?: (i: number, n: number) => string };
}

const props = withDefaults(defineProps<StepsProps>(), { strings: undefined });
const emit = defineEmits<{ /** A finished step was chosen. */ select: [index: number, event: MouseEvent] }>();

const strings = useStrings(
  'steps',
  { label: 'Checkout steps', done: 'completed', step: (i: number, n: number) => `Step ${i} of ${n}` },
  () => props.strings,
);
const steps = computed(() => props.steps.filter((x): x is StepItem => !!x));
const cur = computed(() => Math.max(0, Math.min(steps.value.length - 1, props.current || 0)));
const state = (i: number) => (i < cur.value ? 'done' : i === cur.value ? 'current' : 'todo');
// A finished step is a link (href), a button (when someone listens to `select`), or plain text: no dead buttons.
const instance = getCurrentInstance();
const tag = (s: StepItem, i: number) => {
  if (state(i) !== 'done') return 'span';
  if (s.href != null) return 'a';
  return instance?.vnode.props?.onSelect ? 'button' : 'span';
};
</script>

<template>
  <nav class="q-steps" :aria-label="strings.label">
    <ol class="q-steps__list">
      <li v-for="(s, i) in steps" :key="s.key ?? i" :class="['q-steps__item', `is-${state(i)}`]">
        <component
          :is="tag(s, i)"
          class="q-steps__step"
          :href="tag(s, i) === 'a' ? s.href : undefined"
          :type="tag(s, i) === 'button' ? 'button' : undefined"
          :aria-current="state(i) === 'current' ? 'step' : undefined"
          @click="tag(s, i) !== 'span' && emit('select', i, $event)"
        >
          <span class="q-steps__marker" aria-hidden="true">
            <QIcon v-if="state(i) === 'done'" name="check" size="sm" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span class="q-steps__label">
            {{ s.label }}<span v-if="state(i) === 'done'" class="q-visually-hidden"> ({{ strings.done }})</span>
          </span>
        </component>
      </li>
    </ol>
    <span class="q-steps__count" aria-hidden="true">{{ strings.step(cur + 1, steps.length) }}</span>
  </nav>
</template>
