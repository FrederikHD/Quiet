<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { useQuietId } from '../../composables/useQuietId';

export interface CardProps {
  /** The card's heading (or the `title` slot). Names the section for screen readers. */
  title?: string;
  /** One line under the title, ink-muted (or the `description` slot). */
  description?: string;
  /** No padding around the body (lists that reach the edges). */
  flush?: boolean;
  /** The heading level of the title, h2 to h6. Default 2. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

const props = withDefaults(defineProps<CardProps>(), { title: undefined, description: undefined, headingLevel: 2 });
defineSlots<{
  /** The content. */
  default?(): unknown;
  /** Slim ghost buttons or a link, on the title line. */
  actions?(): unknown;
  /** Under a line rule: the card's own buttons. */
  footer?(): unknown;
  /** The heading's content, when it needs more than text. */
  title?(): unknown;
  /** The line under the title, when it needs more than text (a link). */
  description?(): unknown;
}>();

const slots = useSlots();
const id = useQuietId('q-card-');
const titled = computed(() => props.title != null || !!slots.title);
</script>

<template>
  <section :class="['q-card', flush && 'q-card--flush']" :aria-labelledby="titled ? `${id}-title` : undefined">
    <div v-if="titled || description || slots.description || slots.actions" class="q-card__header">
      <div class="q-card__titles">
        <component :is="`h${headingLevel}`" v-if="titled" :id="`${id}-title`" class="q-card__title">
          <slot name="title">{{ title }}</slot>
        </component>
        <p v-if="description || slots.description" class="q-card__desc">
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
      <div v-if="slots.actions" class="q-card__actions"><slot name="actions" /></div>
    </div>
    <div class="q-card__body"><slot /></div>
    <div v-if="slots.footer" class="q-card__footer"><slot name="footer" /></div>
  </section>
</template>
