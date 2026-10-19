<!-- On phones the search opens in a dialog; inline keeps the list in the flow, where the keyboard can't cover it. -->
<script setup lang="ts">
import { QButton, QDialog, QSearchBox, type SearchSuggestion } from '@frederikhd/quiet';
import { computed, ref } from 'vue';

const open = ref(false);
const q = ref('');
const suggestions = computed<SearchSuggestion[]>(() =>
  q.value.trim() ? ['Linen shirt', 'Linen trousers', 'Linen dress'].filter((n) => n.toLowerCase().includes(q.value.trim().toLowerCase())).map((label) => ({ label, icon: 'search' as const })) : [],
);
</script>

<template>
  <QButton icon-start="search" @click="open = true">Search</QButton>
  <QDialog v-model:open="open" title="Search">
    <QSearchBox v-model="q" inline autofocus label="Search the shop" :suggestions="suggestions" @select="open = false" @submit="open = false" />
  </QDialog>
</template>
