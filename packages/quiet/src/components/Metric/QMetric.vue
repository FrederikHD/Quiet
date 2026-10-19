<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { useStrings } from '../../config';
import QLead from '../../internal/QLead.vue';

export interface MetricChange {
  /** Which way it moved; colours the change with goodWhen (same: no arrow, ink-muted). */
  direction: 'up' | 'down' | 'same';
  /** The amount, already formatted: "12 %", 3. */
  value?: string | number;
  /** What it's compared with: "on yesterday". */
  label?: string;
}
export interface MetricProps {
  /** What the number is: "Sales". The `label` slot can replace its content. */
  label: string;
  /** Already formatted: "4.280,00 €", "38". */
  value: string | number;
  /** How it moved: { direction: 'up', value: '12 %', label: 'on yesterday' }. */
  change?: MetricChange | null;
  /** Which way is good (colours the change). Default up. */
  goodWhen?: 'up' | 'down';
  /** default: 28/32 figure; small: 20/28, for side columns and dense dashboards. */
  size?: 'small' | 'default';
  /** Translations of the words read out before the change ("up", "down", "no change"). */
  strings?: { up?: string; down?: string; same?: string };
}

const props = withDefaults(defineProps<MetricProps>(), {
  change: undefined,
  goodWhen: 'up',
  size: 'default',
  strings: undefined,
});
defineSlots<{
  /** Under the change: a link to the list behind the number. */
  default?(): unknown;
  /** A rich label, in place of the label prop. */
  label?(): unknown;
  /** A rich figure, in place of the value prop. */
  value?(): unknown;
}>();

const slots = useSlots();
const strings = useStrings('metric', { up: 'up', down: 'down', same: 'no change' }, () => props.strings);
const dir = computed(() =>
  props.change?.direction === 'up' || props.change?.direction === 'down' ? props.change.direction : 'same',
);
// Coloured by whether it's good, never by colour alone — an arrow and the words carry it too.
const good = computed(() =>
  !props.change || dir.value === 'same' ? null : props.goodWhen === 'down' ? dir.value === 'down' : dir.value === 'up',
);
</script>

<template>
  <div :class="['q-metric', size === 'small' && 'q-metric--small']">
    <div class="q-metric__label">
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="q-metric__value">
      <slot name="value">{{ value }}</slot>
    </div>
    <div v-if="change" :class="['q-metric__change', good === true && 'is-good', good === false && 'is-bad']">
      <QLead v-if="dir !== 'same'" :icon="dir === 'up' ? 'arrow-up' : 'arrow-down'" />
      <span>
        <span class="q-visually-hidden">{{ `${strings[dir]} ` }}</span
        >{{ change.value != null ? `${change.value} ` : '' }}{{ change.label }}
      </span>
    </div>
    <div v-if="slots.default" class="q-metric__extra"><slot /></div>
  </div>
</template>
