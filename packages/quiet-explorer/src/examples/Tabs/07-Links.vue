<!-- With href the row is navigation between pages: links with aria-current and no panels. -->
<script setup lang="ts">
import { QTabs } from 'quiet';
import { ref } from 'vue';

const page = ref('orders');
</script>

<template>
  <QTabs
    v-model="page"
    label="Order pages"
    :tabs="[
      { value: 'orders', label: 'Orders', href: '#orders' },
      { value: 'drafts', label: 'Drafts', href: '#orders/drafts' },
      { value: 'abandoned', label: 'Abandoned checkouts', href: '#orders/abandoned' },
    ]"
    @navigate="(tab, e) => { e.preventDefault(); page = tab.value; }"
  />
</template>
