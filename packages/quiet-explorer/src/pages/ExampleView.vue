<script setup lang="ts">
import { QButton, QCard } from 'quiet';
import { ref } from 'vue';
import type { Example } from '../catalog';
import CodeBlock from './CodeBlock.vue';

defineProps<{ example: Example }>();
const showSource = ref(false);
</script>

<template>
  <QCard :title="example.title" :heading-level="2" class="ex-example" data-testid="example">
    <template #actions>
      <QButton size="slim" variant="ghost" icon-start="eye" :pressed="showSource" @click="showSource = !showSource">Source</QButton>
    </template>
    <div class="ex-example__stage"><component :is="example.component" /></div>
    <CodeBlock v-if="showSource" :code="example.source" lang="vue" />
  </QCard>
</template>
