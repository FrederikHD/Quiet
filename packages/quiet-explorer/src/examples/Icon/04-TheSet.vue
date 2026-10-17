<!-- Every icon in the set, at md and sm. iconNames lists them in code. -->
<script setup lang="ts">
import { QIcon, iconNames } from 'quiet';
</script>

<template>
  <ul class="grid">
    <li v-for="n in iconNames" :key="n">
      <span class="pair"><QIcon :name="n" /><QIcon :name="n" size="sm" /></span>
      {{ n }}
    </li>
  </ul>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); gap: var(--space-3) var(--space-2); margin: 0; padding: 0; list-style: none; }
.grid li { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); padding: var(--space-2) 0; font: var(--text-caption); color: var(--ink-muted); }
.pair { display: flex; align-items: center; gap: var(--space-3); color: var(--ink); }
</style>
