<!-- A German shop: strings names the landmark, navigate hands the clicks to your router. -->
<script setup lang="ts">
import { QBreadcrumbs } from '@frederikhd/quiet';
import { ref } from 'vue';

const went = ref('');
</script>

<template>
  <div class="stack">
    <QBreadcrumbs
      :strings="{ label: 'Brotkrümelnavigation' }"
      :items="[
        { label: 'Startseite', href: '#' },
        { label: 'Damen', href: '#damen' },
        { label: 'Hemden', href: '#damen/hemden' },
        { label: 'Leinenhemd, blau' },
      ]"
      @navigate="
        (item, e) => {
          e.preventDefault();
          went = `Weiter zu ${item.label}`;
        }
      "
    />
    <p class="log" role="status">{{ went }}</p>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: var(--space-3);
}
.log {
  margin: 0;
  min-height: 18px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
