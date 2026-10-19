<!-- The #title slot, when the heading needs more than text: a status badge beside it. -->
<script setup lang="ts">
import { QBadge, QCard } from '@frederikhd/quiet';
</script>

<template>
  <QCard class="card">
    <template #title>Payment <QBadge tone="success">Paid</QBadge></template>
    <dl class="sums">
      <div>
        <dt>Subtotal</dt>
        <dd>118,00 €</dd>
      </div>
      <div>
        <dt>Shipping</dt>
        <dd>4,90 €</dd>
      </div>
      <div class="total">
        <dt>Total</dt>
        <dd>122,90 €</dd>
      </div>
    </dl>
  </QCard>
</template>

<style scoped>
.card {
  max-width: 400px;
}
.sums {
  display: grid;
  gap: var(--space-2);
  margin: 0;
}
.sums div {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  font-variant-numeric: tabular-nums;
}
.sums dd {
  margin: 0;
}
.total {
  font-weight: 600;
}
</style>
