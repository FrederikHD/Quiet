<script setup lang="ts">
import { useSlots } from 'vue';
import { useQuietId } from '../../composables/useQuietId';

export interface FormSectionProps {
  /** Section heading: "Pricing", "Shipping address". */
  title?: string;
  description?: string;
  /** stack (default): heading above the fields. aside: heading in a left column beside the fields once the section is 760px wide — settings pages. */
  layout?: 'stack' | 'aside';
  /** Heading level for the title. Default 2. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

withDefaults(defineProps<FormSectionProps>(), { title: undefined, description: undefined, layout: 'stack', headingLevel: 2 });
defineSlots<{ default(): unknown; title?(): unknown; description?(): unknown }>();

const slots = useSlots();
const id = useQuietId('q-fsection-');
</script>

<template>
  <section :class="['q-fsection', layout === 'aside' && 'q-fsection--aside']" :aria-labelledby="title || slots.title ? id : undefined">
    <div class="q-fsection__inner">
      <div v-if="title || slots.title || description || slots.description" class="q-fsection__head">
        <component :is="`h${headingLevel}`" v-if="title || slots.title" :id="id" class="q-fsection__title">
          <slot name="title">{{ title }}</slot>
        </component>
        <p v-if="description || slots.description" class="q-fsection__desc"><slot name="description">{{ description }}</slot></p>
      </div>
      <div class="q-fsection__body"><slot /></div>
    </div>
  </section>
</template>
