<script setup lang="ts">
import { QButton, QCheckbox, QCheckboxGroup, QForm, QFormActions } from 'quiet';
import { computed, ref } from 'vue';

const stores = ['Berlin', 'Hamburg', 'Munich'];
const selected = ref<string[]>(['Berlin']);
const all = computed(() => selected.value.length === stores.length);
const some = computed(() => selected.value.length > 0 && !all.value);

const terms = ref(false);
const tried = ref(false);
</script>

<template>
  <div class="col">
    <p class="pv-title">Select all</p>
    <QCheckbox label="All stores" :model-value="all" :indeterminate="some" @update:model-value="selected = $event ? [...stores] : []" />
    <div class="indent">
      <QCheckboxGroup v-model="selected" aria-label="Stores">
        <QCheckbox v-for="s in stores" :key="s" :value="s" :label="s" />
      </QCheckboxGroup>
    </div>

    <p class="pv-title">Accepting the terms — press Place order</p>
    <QForm label-placement="top" @submit.prevent="tried = true">
      <QCheckboxGroup id="terms" required :error="tried && !terms ? 'Accept the terms to place your order' : null">
        <QCheckbox v-model="terms" value="yes" name="terms" label="I accept the terms and the cancellation policy" />
      </QCheckboxGroup>
      <QFormActions align="start"><QButton variant="primary" type="submit">Place order</QButton></QFormActions>
    </QForm>
  </div>
</template>

<style scoped>
.col { display: grid; gap: var(--space-1); max-width: 480px; }
.pv-title { margin: var(--space-4) 0 var(--space-1); font: var(--text-caption); color: var(--ink-muted); }
.pv-title:first-child { margin-top: 0; }
.indent { padding-left: calc(18px + var(--space-3)); }
</style>
