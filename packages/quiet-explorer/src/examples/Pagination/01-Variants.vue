<script setup lang="ts">
import { QPagination } from 'quiet';
import { ref, watch } from 'vue';

const p1 = ref(1);
const size1 = ref(50);
watch(size1, () => (p1.value = 1));
const p2 = ref(4);
const shown2 = ref(4);
const busy = ref(false);
// Pretend each page loads from the server for a moment.
watch(p2, (p) => {
  busy.value = true;
  setTimeout(() => {
    shown2.value = p;
    busy.value = false;
  }, 350);
});
const p3 = ref(12);
const p4 = ref(1);
const p5 = ref(3);
</script>

<template>
  <div class="pv">
    <div>
      <p class="pv-title">Simple (default) — range, rows per page, previous and next; the Table footer</p>
      <div class="box"><QPagination v-model:page="p1" v-model:page-size="size1" :total="1240" :page-size-options="[25, 50, 100]" /></div>
    </div>
    <div>
      <p class="pv-title">Numbered pages, first and last, range on the left — loads for a moment (disabled meanwhile)</p>
      <div class="box">
        <QPagination v-model:page="p2" variant="pages" show-first-last align="between" :page-size="25" :total="612" :disabled="busy" />
      </div>
    </div>
    <div>
      <p class="pv-title">Compact with jump to page — type a number and press Enter</p>
      <div class="box"><QPagination v-model:page="p3" variant="compact" jump-to-page show-first-last :page-size="50" :total="4890" /></div>
    </div>
    <div data-density="compact">
      <p class="pv-title">Without a total (cursor API), compact density — 4 pages</p>
      <div class="box"><QPagination v-model:page="p4" :page-size="25" :has-next="p4 < 4" /></div>
    </div>
    <div>
      <p class="pv-title">Storefront — links (#page-n), default size, centred, no range</p>
      <QPagination
        v-model:page="p5"
        variant="pages"
        size="default"
        align="center"
        :show-range="false"
        :page-size="24"
        :total="230"
        :href-for="(n) => `#page-${n}`"
        @click.capture="(e: MouseEvent) => (e.target as Element).closest('a') && e.preventDefault()"
      />
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-6); }
.pv-title { margin: 0 0 var(--space-2); font: var(--text-caption); color: var(--ink-muted); }
.box { padding: var(--space-2) var(--space-4); background: var(--surface-raised); border: 1px solid var(--line); border-radius: var(--radius-lg); }
</style>
