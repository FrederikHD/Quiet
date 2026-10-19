<!-- The least an AppShell needs: a brand, a Nav and the page. Below 1024px the nav moves into a drawer behind the menu button. -->
<script setup lang="ts">
import { QAppShell, QEmptyState, QNav, QPage } from '@frederikhd/quiet';
</script>

<template>
  <div class="box">
    <QAppShell brand="Leinen & Co" contained :toaster="false">
      <template #nav>
        <QNav
          :items="[
            { label: 'Orders', href: '#orders', icon: 'bag' },
            { label: 'Products', href: '#products', icon: 'package', current: true },
            { label: 'Customers', href: '#customers', icon: 'user' },
          ]"
        />
      </template>
      <QPage title="Products">
        <QEmptyState title="No products yet" icon="package">Add your first product to start selling.</QEmptyState>
      </QPage>
    </QAppShell>
  </div>
</template>

<style scoped>
.box { height: 400px; border: 1px solid var(--line); border-radius: var(--radius-md); overflow: hidden; }
</style>
