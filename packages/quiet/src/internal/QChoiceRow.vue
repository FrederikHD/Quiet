<script setup lang="ts">
// The shared row of Checkbox and Radio: [control] [media] [label + description] [meta]. The whole row is the label,
// so clicking anywhere on it toggles the native input inside.
import QIcon from '../components/Icon/QIcon.vue';

defineProps<{
  kind: 'checkbox' | 'radio';
  card?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  labelHidden?: boolean;
  label?: string;
  description?: string;
  meta?: string;
  hasMedia?: boolean;
  hasMeta?: boolean;
  hasDescription?: boolean;
}>();
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -- the label wraps the input, which is passed in as a vnode the linter cannot see -->
  <label
    :class="[
      'q-choice',
      `q-choice--${kind}`,
      card && 'q-choice--card',
      disabled && 'is-disabled',
      invalid && 'is-invalid',
      labelHidden && 'q-choice--label-hidden',
    ]"
  >
    <span class="q-choice__control">
      <slot name="input" />
      <span v-if="kind === 'checkbox'" class="q-choice__mark" aria-hidden="true">
        <QIcon name="check" class="q-choice__tick" /><QIcon name="minus" class="q-choice__dash" />
      </span>
    </span>
    <span v-if="hasMedia" class="q-choice__media" aria-hidden="true"><slot name="media" /></span>
    <span :class="['q-choice__text', labelHidden && 'q-visually-hidden']">
      <span class="q-choice__label"
        ><slot name="label">{{ label }}</slot></span
      >
      <span v-if="hasDescription" class="q-choice__desc"
        ><slot name="description">{{ description }}</slot></span
      >
    </span>
    <span v-if="hasMeta" class="q-choice__meta"
      ><slot name="meta">{{ meta }}</slot></span
    >
  </label>
</template>
