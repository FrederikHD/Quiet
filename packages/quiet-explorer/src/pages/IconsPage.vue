<script setup lang="ts">
import { QIcon, QInput, QPage, iconNames, toast } from 'quiet';
import { computed, ref } from 'vue';

const query = ref('');
const shown = computed(() => iconNames.filter((n) => n.includes(query.value.trim().toLowerCase())));
async function copy(name: string) {
  try {
    await navigator.clipboard.writeText(`<QIcon name="${name}" />`);
    toast(`Copied <QIcon name="${name}" />`, { tone: 'success' });
  } catch {
    toast('Couldn’t copy to the clipboard.', { tone: 'error' });
  }
}
</script>

<template>
  <QPage :title="`Icons · ${iconNames.length}`" subtitle="Outline icons on a 20px grid, 1.5px round stroke, coloured by the text around them. Click one to copy it.">
    <QInput v-model="query" aria-label="Filter icons" placeholder="Filter icons" clearable class="ex-icon-filter">
      <template #prefix><QIcon name="search" /></template>
    </QInput>
    <ul class="ex-icons">
      <li v-for="name in shown" :key="name">
        <button type="button" class="ex-icon" :aria-label="`Copy ${name}`" @click="copy(name)">
          <QIcon :name="name" size="lg" />
          <span>{{ name }}</span>
        </button>
      </li>
    </ul>
  </QPage>
</template>
