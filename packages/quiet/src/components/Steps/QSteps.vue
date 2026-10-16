<script setup lang="ts">
import { computed } from 'vue';
import { useStrings } from '../../config';
import QIcon from '../Icon/QIcon.vue';

export interface StepItem {
  label: string;
  /** Finished steps link back here. Without href they are buttons that emit `select`. */
  href?: string;
  key?: string;
}
export interface StepsProps {
  steps: (StepItem | null | false)[];
  /** Index of the current step. Earlier steps show a check and link back; later ones are plain text (you can't skip ahead). */
  current: number;
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
</script>

<template>
  <nav class="q-steps" :aria-label="strings.label">
    <ol class="q-steps__list">
      <li v-for="(s, i) in steps" :key="s.key ?? i" :class="['q-steps__item', `is-${state(i)}`]">
        <component
          :is="state(i) === 'done' ? (s.href != null ? 'a' : 'button') : 'span'"
          class="q-steps__step"
          :href="state(i) === 'done' ? s.href : undefined"
          :type="state(i) === 'done' && s.href == null ? 'button' : undefined"
          :aria-current="state(i) === 'current' ? 'step' : undefined"
          @click="state(i) === 'done' && emit('select', i, $event)"
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
