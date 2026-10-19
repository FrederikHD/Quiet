<script setup lang="ts">
// One suggestion row: picture or icon, label and description, price on the right.
import QLead from '../../internal/QLead.vue';
import type { SearchSuggestion } from './QSearchBox.vue';

defineProps<{ id: string; index: number; option: SearchSuggestion; active: boolean }>();
const emit = defineEmits<{ choose: []; hover: [] }>();
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/interactive-supports-focus -- options follow aria-activedescendant: focus stays in the search field, which handles the keys -->
  <li
    :id="id"
    :data-i="index"
    role="option"
    :aria-selected="active"
    :class="['q-search__opt', active && 'is-active']"
    @mousedown.prevent
    @click="emit('choose')"
    @mousemove="!active && emit('hover')"
  >
    <img v-if="option.image" class="q-search__img" :src="option.image" alt="" aria-hidden="true" />
    <QLead v-else-if="option.icon" :icon="option.icon" />
    <span class="q-search__text">
      <span class="q-search__label">{{ option.label }}</span>
      <span v-if="option.description" class="q-search__desc">{{ option.description }}</span>
    </span>
    <span v-if="option.meta != null" class="q-search__meta">{{ option.meta }}</span>
  </li>
</template>
