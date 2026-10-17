<!-- In a dense list each row gets its own slim ⋯ menu, named after its row. -->
<script setup lang="ts">
import { QMenu } from 'quiet';
import { ref } from 'vue';

const orders = ['#10530', '#10529', '#10528'];
const chose = ref('');
</script>

<template>
  <div class="stack" data-density="compact">
    <ul class="list">
      <li v-for="o in orders" :key="o">
        <span>Order {{ o }}</span>
        <QMenu
          :label="`Actions for order ${o}`"
          size="slim"
          :items="[
            { label: 'Mark as fulfilled', icon: 'check' },
            { label: 'Print packing slip', icon: 'package' },
          ]"
          @select="(item) => (chose = `${item.label}: ${o}`)"
        />
      </li>
    </ul>
    <p class="log" role="status">{{ chose }}</p>
  </div>
</template>

<style scoped>
.stack { display: grid; gap: var(--space-3); max-width: 420px; }
.list { margin: 0; padding: 0; list-style: none; background: var(--surface-raised); border: 1px solid var(--line); border-radius: var(--radius-lg); }
.list li { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-1) var(--space-2) var(--space-1) var(--space-4); border-top: 1px solid var(--line); }
.list li:first-child { border-top: 0; }
.log { margin: 0; min-height: 18px; font: var(--text-small); color: var(--ink-muted); }
</style>
