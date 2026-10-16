<script setup lang="ts">
// "*" after required labels (markers="required"), or "(optional)" after optional ones (markers="optional").
import type { FormStrings, Markers } from '../components/Field/context';

defineProps<{ markers: Markers; required?: boolean; strings: Required<FormStrings> }>();
</script>

<template>
  <span v-if="markers === 'required' && required" class="q-field__req" aria-hidden="true">*</span>
  <span v-else-if="markers === 'optional' && !required" class="q-field__opt">({{ strings.optional }})</span>
</template>
