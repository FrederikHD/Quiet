<!-- Several cards per row with columns; each stays at least 180px wide, so phones get fewer per row. -->
<script setup lang="ts">
import { QCheckbox, QCheckboxGroup } from 'quiet';
import { ref } from 'vue';

const channels = ref<string[]>(['web', 'pos']);
</script>

<template>
  <QCheckboxGroup v-model="channels" label="Sell on" layout="cards" :columns="3" label-placement="top">
    <QCheckbox value="web" label="Online store" description="shop.example.com" />
    <QCheckbox value="pos" label="Point of sale" description="3 stores" />
    <QCheckbox value="market" label="Marketplaces" description="Zalando, Amazon" meta="+5 %" />
  </QCheckboxGroup>
</template>
