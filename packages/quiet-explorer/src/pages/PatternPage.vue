<script setup lang="ts">
import { QPage } from '@frederikhd/quiet';
import { computed, defineAsyncComponent } from 'vue';
import { patterns } from '../patterns';

const props = defineProps<{ slug: string }>();
const pattern = computed(() => patterns.find((p) => p.slug === props.slug)!);
const screen = computed(() => defineAsyncComponent(pattern.value.load));
const slugOf = (folder: string) => folder.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
</script>

<template>
  <QPage :title="pattern.title" :subtitle="pattern.summary" width="full">
    <p class="ex-uses">
      Built with
      <template v-for="(folder, i) in pattern.uses" :key="folder"
        ><RouterLink :to="`/components/${slugOf(folder)}`">{{ folder }}</RouterLink
        >{{ i < pattern.uses.length - 1 ? ', ' : '.' }}</template
      >
    </p>
    <div class="ex-pattern" data-testid="pattern"><component :is="screen" /></div>
  </QPage>
</template>

<style scoped>
.ex-uses {
  margin: 0;
  color: var(--ink-muted);
  font: var(--text-small);
}
.ex-uses a {
  color: var(--brand);
}
.ex-pattern {
  container-type: inline-size;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  overflow: hidden;
}
</style>
