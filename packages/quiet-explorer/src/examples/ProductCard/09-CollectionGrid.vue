<!-- A collection page: two columns on phones, 200px+ columns above. On a computer the second image fades in on hover. -->
<script setup lang="ts">
import { QProductCard } from '@frederikhd/quiet';
import { ref } from 'vue';
import { photo, swatchOf } from '../../fixtures/pictures';

const colours = ['Navy', 'Sand', 'Olive', 'Rust'].map((n) => ({ label: n, color: swatchOf(n) }));
const log = ref('');
// The client-side router opens the product instead of a full page load.
function open(e: MouseEvent, name: string) {
  e.preventDefault();
  log.value = `Opened ${name}`;
}
</script>

<template>
  <div class="grid">
    <QProductCard
      name="Linen shirt"
      href="#linen-shirt"
      :image="{ src: photo('Navy') }"
      :hover-image="{ src: photo('Navy', 1) }"
      :price="59"
      :swatches="colours"
      quick-add
      @navigate="open($event, 'Linen shirt')"
      @quick-add="log = 'Added Linen shirt to the cart'"
    />
    <QProductCard
      name="Linen trousers"
      href="#linen-trousers"
      :image="{ src: photo('Sand', 2) }"
      :price="59"
      :compare-at="79"
      :badges="[{ label: 'Sale', tone: 'sale' }]"
      :swatches="colours.slice(1, 3)"
      @navigate="open($event, 'Linen trousers')"
    />
    <QProductCard
      name="Linen dress"
      href="#linen-dress"
      :image="{ src: photo('Olive') }"
      :price="99"
      :badges="[{ label: 'New', tone: 'info' }]"
      :rating="{ value: 4.6, count: 12 }"
      @navigate="open($event, 'Linen dress')"
    />
    <QProductCard
      name="Linen apron"
      href="#linen-apron"
      :image="{ src: photo('Rust', 2) }"
      :price="35"
      sold-out
      :badges="[{ label: 'Sold out', tone: 'neutral' }]"
      @navigate="open($event, 'Linen apron')"
    />
  </div>
  <p class="log" role="status">{{ log }}</p>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(200px, calc(50% - 8px)), 1fr));
  gap: var(--space-6) var(--space-4);
}
.log {
  margin: 0;
  min-height: 18px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
