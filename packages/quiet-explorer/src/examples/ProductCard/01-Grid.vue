<script setup lang="ts">
import { QProductCard } from 'quiet';
import { ref } from 'vue';
import { photo, swatchOf } from '../../fixtures/pictures';

const log = ref('');
const all = ['Navy', 'Sand', 'Olive', 'Rust', 'Natural', 'Sage'].map((n) => ({ label: n, color: swatchOf(n) }));
function open(e: MouseEvent, name: string) {
  e.preventDefault();
  log.value = `Opened ${name}`;
}
</script>

<template>
  <div>
    <div class="grid">
      <QProductCard
        name="Linen shirt"
        href="#shirt"
        :image="{ src: photo('Navy') }"
        :hover-image="{ src: photo('Navy', 1) }"
        :price="59"
        :swatches="all"
        quick-add
        @navigate="open($event, 'Linen shirt')"
        @quick-add="log = 'Added Linen shirt to the cart'"
      />
      <QProductCard
        name="Linen trousers"
        href="#trousers"
        :image="{ src: photo('Sand', 2) }"
        :price="59"
        :compare-at="79"
        :badges="[{ label: 'Sale', tone: 'sale' }]"
        :swatches="all.slice(1, 3)"
        quick-add
        @navigate="open($event, 'Linen trousers')"
        @quick-add="log = 'Added Linen trousers to the cart'"
      />
      <QProductCard
        name="Linen dress, wide-cut with pockets"
        vendor="Leinenweberei Rhön"
        href="#dress"
        :image="{ src: photo('Olive') }"
        :price="99"
        price-from
        :badges="[{ label: 'New', tone: 'info' }]"
        :swatches="all.slice(2, 4)"
        @navigate="open($event, 'Linen dress')"
      />
      <QProductCard
        name="Linen apron"
        href="#apron"
        :image="{ src: photo('Rust', 2) }"
        :price="35"
        sold-out
        :badges="[{ label: 'Sold out', tone: 'neutral' }]"
        :swatches="all.slice(3, 4)"
        quick-add
        @navigate="open($event, 'Linen apron')"
      />
    </div>
    <p class="log" role="status">{{ log }}</p>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(200px, calc(50% - 8px)), 1fr)); gap: var(--space-6) var(--space-4); }
.log { margin: var(--space-4) 0 0; min-height: 18px; font: var(--text-small); color: var(--ink-muted); }
</style>
