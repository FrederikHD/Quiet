<!-- The #description-<key> slots hold links, badges and other rich content. -->
<script setup lang="ts">
import { QBadge, QDescriptionList } from 'quiet';
</script>

<template>
  <QDescriptionList
    :items="[
      { term: 'Order', description: '#10421' },
      { key: 'status', term: 'Status' },
      { key: 'email', term: 'Email' },
    ]"
  >
    <template #description-status><QBadge tone="success">Paid</QBadge></template>
    <template #description-email><a href="mailto:anna.schmidt@example.com">anna.schmidt@example.com</a></template>
  </QDescriptionList>
</template>
