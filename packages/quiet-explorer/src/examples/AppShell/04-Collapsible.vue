<!-- From 1024px, the round button on the column's edge hides the navigation, so a wide table or form gets the whole
     width, and brings it back. v-model:collapsed lets the app remember the choice. -->
<script setup lang="ts">
import { QAppShell, QNav, QPage, QTable } from '@frederikhd/quiet';
import { ref } from 'vue';

const collapsed = ref(false);
</script>

<template>
  <div class="box">
    <QAppShell v-model:collapsed="collapsed" brand="Leinen & Co" collapsible contained :toaster="false">
      <template #nav>
        <QNav
          :items="[
            { label: 'Orders', href: '#orders', icon: 'bag', current: true },
            { label: 'Products', href: '#products', icon: 'package' },
            { label: 'Customers', href: '#customers', icon: 'user' },
          ]"
        />
      </template>
      <QPage title="Orders">
        <QTable
          caption="Orders"
          caption-hidden
          :columns="[
            { key: 'order', header: 'Order' },
            { key: 'customer', header: 'Customer' },
            { key: 'total', header: 'Total', align: 'end' },
          ]"
          :rows="[
            { id: 1, order: '#1042', customer: 'Anna Schmidt', total: '118,00 €' },
            { id: 2, order: '#1041', customer: 'Jonas Weber', total: '79,00 €' },
          ]"
        />
      </QPage>
    </QAppShell>
  </div>
</template>

<style scoped>
.box {
  height: 400px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  overflow: hidden;
}
</style>
