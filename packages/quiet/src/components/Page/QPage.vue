<script setup lang="ts">
import { useSlots } from 'vue';
import QLead from '../../internal/QLead.vue';
import QPageColumns from './QPageColumns.vue';

export interface PageBack {
  /** The parent page's name: "Products". */
  label: string;
  /** The parent page's URL. */
  href?: string;
}
export interface PageProps {
  /** The page's h1. */
  title: string;
  /** Back link to the parent: { href, label: 'Products' }. Without href it is a button. A click emits `back` either way. */
  back?: PageBack;
  /** One line under the title, ink-muted. */
  subtitle?: string;
  /** Content width: default 1200px, narrow 720px, full (the whole window). */
  width?: 'default' | 'narrow' | 'full';
  /** Sets data-density for everything on the page. Default: inherited. */
  density?: 'comfortable' | 'compact';
}

withDefaults(defineProps<PageProps>(), { back: undefined, subtitle: undefined, width: 'default', density: undefined });
const emit = defineEmits<{
  /** The back link or button was clicked (use it for client-side routing). */ back: [event: MouseEvent];
}>();
defineSlots<{
  /** The content (the main column when there is an aside). */
  default?(): unknown;
  /** The line under the title, when it needs more than text (a link, a date). */
  subtitle?(): unknown;
  /** Buttons on the right of the title; the primary one last. */
  actions?(): unknown;
  /** Badges after the title (status). */
  'title-meta'?(): unknown;
  /** A side column: 2 : 1 from 900px of page width, below the main column on smaller screens. */
  aside?(): unknown;
}>();
const slots = useSlots();
</script>

<template>
  <div :class="['q-page', `q-page--${width}`]" :data-density="density">
    <div class="q-page__inner">
      <div class="q-page__header">
        <component
          :is="back.href != null ? 'a' : 'button'"
          v-if="back"
          class="q-page__back"
          :href="back.href"
          :type="back.href != null ? undefined : 'button'"
          @click="emit('back', $event)"
        >
          <QLead icon="arrow-left" /><span>{{ back.label }}</span>
        </component>
        <div class="q-page__titlerow">
          <div class="q-page__titles">
            <div class="q-page__titleline">
              <h1 class="q-page__title">{{ title }}</h1>
              <span v-if="slots['title-meta']" class="q-page__meta"><slot name="title-meta" /></span>
            </div>
            <p v-if="subtitle || slots.subtitle" class="q-page__subtitle">
              <slot name="subtitle">{{ subtitle }}</slot>
            </p>
          </div>
          <div v-if="slots.actions" class="q-page__actions"><slot name="actions" /></div>
        </div>
      </div>
      <QPageColumns v-if="slots.aside">
        <slot />
        <template #aside><slot name="aside" /></template>
      </QPageColumns>
      <div v-else class="q-page__body"><slot /></div>
    </div>
  </div>
</template>
