<script setup lang="ts">
import { QDiscountCode } from 'quiet';
import { ref } from 'vue';

const KNOWN: Record<string, string> = { LINEN10: '−10 %', FREESHIP: 'Free shipping' };
const open = ref<string[]>(['LINEN10']);
const folded = ref<string[]>([]);

// Your check goes here: return nothing when the code works, or the message why not.
function makeChecker(list: typeof open) {
  return (code: string) =>
    new Promise<string | void>((resolve) =>
      setTimeout(() => {
        const k = code.toUpperCase();
        if (!KNOWN[k]) return resolve(`“${code}” isn’t a valid code`);
        list.value = [...list.value, k];
        resolve();
      }, 400),
    );
}
const applyOpen = makeChecker(open);
const applyFolded = makeChecker(folded);
</script>

<template>
  <div class="pv">
    <div>
      <p class="pv-title">Open, one code applied (try FREESHIP)</p>
      <QDiscountCode
        :applied="open.map((code) => ({ code, label: KNOWN[code] }))"
        :apply="applyOpen"
        @remove="(code) => (open = open.filter((c) => c !== code))"
      />
    </div>
    <div>
      <p class="pv-title">Collapsible (in an order summary)</p>
      <QDiscountCode
        collapsible
        :applied="folded.map((code) => ({ code, label: KNOWN[code] }))"
        :apply="applyFolded"
        @remove="(code) => (folded = folded.filter((c) => c !== code))"
      />
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-8); max-width: 420px; }
.pv-title { margin: 0 0 var(--space-3); font: var(--text-caption); color: var(--ink-muted); }
</style>
