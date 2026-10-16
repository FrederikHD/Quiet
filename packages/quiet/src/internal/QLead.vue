<script setup lang="ts">
// An icon in front of text, lined up with the middle of the text's capital letters (see .q-lead in lead.css).
import QIcon from '../components/Icon/QIcon.vue';
import type { IconName } from '../components/Icon/icons';

defineProps<{ icon?: IconName; size?: 'sm' | 'md' | 'lg' | 'control' }>();
</script>

<template>
  <span class="q-lead" aria-hidden="true"><slot><QIcon v-if="icon" :name="icon" :size="size ?? 'sm'" /></slot></span>
</template>
