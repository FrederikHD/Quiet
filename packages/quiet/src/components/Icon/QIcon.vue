<script setup lang="ts">
import { computed } from 'vue';
import { warnOnce } from '../../utils/dom';
import { icons, iconNames, type IconName, type IconShape } from './icons';

export interface IconProps {
  /** Which icon. `iconNames` lists them all. */
  name: IconName;
  /** sm 16px, md 20px (default), lg 24px, control = the density's control icon size. Inside a Button or Input affix the icon fills its slot whatever this says. */
  size?: 'sm' | 'md' | 'lg' | 'control';
  /** Give a label only when the icon stands alone and carries meaning ("In stock"); it then becomes role="img". Without one the icon is hidden from screen readers — right next to text or inside a labelled button. */
  label?: string;
}

const props = withDefaults(defineProps<IconProps>(), { size: 'md', label: undefined });

const SIZES = { sm: 'var(--icon-sm)', md: 'var(--icon-md)', lg: 'var(--icon-lg)', control: 'var(--ctl-icon)' };

const shapes = computed<IconShape[] | null>(() => {
  const s = (icons as Record<string, IconShape[]>)[props.name];
  if (!s)
    warnOnce(`icon-${props.name}`, `Icon: there is no icon named "${props.name}". Available: ${iconNames.join(', ')}.`);
  return s ?? null;
});
const length = computed(() => SIZES[props.size] ?? SIZES.md);
</script>

<template>
  <svg
    v-if="shapes"
    class="q-icon"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    focusable="false"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    :style="{ width: length, height: length }"
  >
    <component :is="shape[0]" v-for="(shape, i) in shapes" :key="i" v-bind="shape[1]" />
  </svg>
</template>
