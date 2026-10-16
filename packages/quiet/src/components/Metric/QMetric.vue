<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { useStrings } from '../../config';
import QLead from '../../internal/QLead.vue';

export interface MetricChange {
  direction: 'up' | 'down' | 'same';
  value?: string;
  label?: string;
}
export interface MetricProps {
  label: string;
  /** Already formatted: "4.280,00 €", "38". */
  value: string | number;
  /** How it moved: { direction: 'up', value: '12 %', label: 'on yesterday' }. */
  change?: MetricChange | null;
  /** Which way is good (colours the change). Default up. */
  goodWhen?: 'up' | 'down';
  size?: 'small' | 'default';
  strings?: { up?: string; down?: string; same?: string };
}

const props = withDefaults(defineProps<MetricProps>(), { change: undefined, goodWhen: 'up', size: 'default', strings: undefined });
defineSlots<{ /** Under the change: a link to the list behind the number. */ default?(): unknown }>();

const slots = useSlots();
const strings = useStrings('metric', { up: 'up', down: 'down', same: 'no change' }, () => props.strings);
const dir = computed(() => (props.change?.direction === 'up' || props.change?.direction === 'down' ? props.change.direction : 'same'));
// Coloured by whether it's good, never by colour alone — an arrow and the words carry it too.
const good = computed(() => (!props.change || dir.value === 'same' ? null : props.goodWhen === 'down' ? dir.value === 'down' : dir.value === 'up'));
</script>

<template>
  <div :class="['q-metric', size === 'small' && 'q-metric--small']">
    <div class="q-metric__label">{{ label }}</div>
    <div class="q-metric__value">{{ value }}</div>
    <div v-if="change" :class="['q-metric__change', good === true && 'is-good', good === false && 'is-bad']">
      <QLead v-if="dir !== 'same'" :icon="dir === 'up' ? 'arrow-up' : 'arrow-down'" />
      <span>
        <span class="q-visually-hidden">{{ strings[dir] }} </span>{{ change.value != null ? `${change.value} ` : '' }}{{ change.label }}
      </span>
    </div>
    <div v-if="slots.default" class="q-metric__extra"><slot /></div>
  </div>
</template>
