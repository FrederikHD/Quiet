<!-- A detail page's header: the back link as a button for a client-side router, badges after the title, a rich subtitle. -->
<script setup lang="ts">
import { QBadge, QButton, QPage } from 'quiet';
import { ref } from 'vue';

const went = ref('');
</script>

<template>
  <div class="frame">
    <QPage title="Order #10530" :back="{ label: 'Orders' }" @back="went = 'Back to Orders'">
      <template #title-meta>
        <QBadge tone="success">Paid</QBadge>
        <QBadge tone="warning">Unfulfilled</QBadge>
      </template>
      <template #subtitle>13 October at 09:41 · from the <a href="#online-store">online store</a></template>
      <template #actions><QButton icon-start="package">Print packing slip</QButton></template>
      <p class="log" role="status">{{ went }}</p>
    </QPage>
  </div>
</template>

<style scoped>
.frame { border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); }
.log { margin: 0; min-height: 18px; font: var(--text-small); color: var(--ink-muted); }
a { color: inherit; }
</style>
