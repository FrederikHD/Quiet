<script setup lang="ts">
// What the open Combobox shows — in a dropdown, or in a Dialog on phones: a search field, the list and a status
// line that says whether the list is complete.
import { nextTick, ref, watch } from 'vue';
import QButton from '../Button/QButton.vue';
import QIcon from '../Icon/QIcon.vue';
import QInput from '../Input/QInput.vue';
import type { ComboboxOption, ComboboxResult } from './types';

const props = defineProps<{
  listId: string;
  statusId: string;
  label: string;
  query: string;
  result: ComboboxResult;
  active: number;
  multiple: boolean;
  required: boolean;
  searchPlaceholder: string;
  statusText: string;
  emptyText: string;
  clearLabel: string;
  retryLabel: string;
  isSelected: (o: ComboboxOption) => boolean;
}>();
const emit = defineEmits<{
  'update:query': [value: string];
  'update:active': [index: number];
  choose: [option: ComboboxOption];
  keydown: [event: KeyboardEvent];
  retry: [];
}>();

const search = ref<InstanceType<typeof QInput> | null>(null);
const list = ref<HTMLElement | null>(null);

// Keep the active option in view.
watch(
  () => props.active,
  async (i) => {
    await nextTick();
    const el = list.value?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView?.({ block: 'nearest' });
  },
);

defineExpose({ focus: () => search.value?.focus(), input: () => search.value?.input ?? null });
</script>

<template>
  <div class="q-combo__panel">
    <div class="q-combo__search">
      <QInput
        ref="search"
        :model-value="query"
        clearable
        :clear-label="clearLabel"
        :placeholder="searchPlaceholder"
        role="combobox"
        :aria-label="label"
        aria-expanded="true"
        :aria-controls="listId"
        aria-autocomplete="list"
        :aria-activedescendant="active >= 0 && result.options[active] ? `${listId}-${active}` : undefined"
        :aria-describedby="statusId"
        :aria-required="required ? 'true' : undefined"
        autocomplete="off"
        autocorrect="off"
        :spellcheck="false"
        @update:model-value="emit('update:query', String($event ?? ''))"
        @keydown="emit('keydown', $event)"
      >
        <template #prefix><QIcon name="search" /></template>
      </QInput>
    </div>
    <ul
      :id="listId"
      ref="list"
      role="listbox"
      :class="['q-combo__list', result.status === 'loading' && 'is-loading']"
      :aria-label="label"
      :aria-multiselectable="multiple ? 'true' : undefined"
    >
      <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/interactive-supports-focus -- options follow aria-activedescendant: focus stays in the search field, which handles the keys -->
      <li
        v-for="(o, i) in result.options"
        :id="`${listId}-${i}`"
        :key="o.value"
        role="option"
        :aria-selected="isSelected(o)"
        :aria-disabled="o.disabled ? 'true' : undefined"
        :class="[
          'q-combo__option',
          i === active && 'is-active',
          isSelected(o) && 'is-selected',
          o.disabled && 'is-disabled',
        ]"
        @mousedown.prevent
        @click="emit('choose', o)"
        @mousemove="i !== active && !o.disabled && emit('update:active', i)"
      >
        <span v-if="multiple" class="q-combo__check" aria-hidden="true"
          ><QIcon v-if="isSelected(o)" name="check"
        /></span>
        <span
          v-if="o.image || o.swatch"
          class="q-combo__media"
          aria-hidden="true"
          :style="o.swatch ? { background: o.swatch } : undefined"
        >
          <img v-if="o.image" :src="o.image.src" alt="" />
        </span>
        <span class="q-combo__text">
          <span class="q-combo__label">{{ o.label ?? o.value }}</span>
          <span v-if="o.description" class="q-combo__desc">{{ o.description }}</span>
        </span>
        <span v-if="o.meta" class="q-combo__meta">{{ o.meta }}</span>
        <span v-if="!multiple && isSelected(o)" class="q-combo__tick" aria-hidden="true"><QIcon name="check" /></span>
      </li>
    </ul>
    <div
      v-if="!result.options.length && result.status !== 'loading' && result.status !== 'error'"
      class="q-combo__empty"
      aria-hidden="true"
    >
      {{ emptyText }}
    </div>
    <div :class="['q-combo__footer', result.status === 'error' && 'is-error']">
      <span v-if="result.status === 'loading'" class="q-combo__spinner" aria-hidden="true" />
      <span :id="statusId" role="status" class="q-combo__status">{{ statusText }}</span>
      <QButton v-if="result.status === 'error'" size="slim" variant="ghost" @click="emit('retry')">{{
        retryLabel
      }}</QButton>
    </div>
  </div>
</template>
