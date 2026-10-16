<script setup lang="ts">
import { QIcon, iconNames } from 'quiet';
</script>

<template>
  <div class="pv">
    <div v-for="n in iconNames" :key="n" class="cell">
      <div class="pair"><QIcon :name="n" /><QIcon :name="n" size="sm" /></div>
      <span class="name">{{ n }}</span>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); gap: var(--space-3) var(--space-2); }
.cell { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); padding: var(--space-2) 0; color: var(--ink); }
.pair { display: flex; align-items: center; gap: var(--space-3); }
.name { font: var(--text-caption); color: var(--ink-muted); }
</style>
