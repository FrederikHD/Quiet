<script setup lang="ts">
// One part of an address: a Field with its Select (country) or Input, and the autocomplete token for it.
import { computed } from 'vue';
import QField from '../Field/QField.vue';
import QInput from '../Input/QInput.vue';
import QSelect from '../Select/QSelect.vue';
import { AUTOCOMPLETE, addressFormats, type AddressFieldKey } from './address';

const props = defineProps<{
  part: AddressFieldKey;
  id: string;
  label: string;
  required: boolean;
  value?: string;
  country?: string;
  error?: string;
  hint?: string;
  width?: 'xs' | 's' | 'm' | 'l';
  disabled?: boolean;
  /** "shipping ", "billing ", "section-gift shipping " … */
  autocompletePrefix: string;
  countries: { value: string; label: string }[];
  countryPlaceholder?: string;
}>();
const emit = defineEmits<{ change: [key: AddressFieldKey, value: string] }>();

const fmt = computed(() => addressFormats[props.country ?? ''] ?? {});
const inputmode = computed(() =>
  props.part === 'postalCode' && fmt.value.numeric ? 'numeric' : props.part === 'phone' ? 'tel' : undefined,
);
</script>

<template>
  <QField :id="id" :label="label" :required="required" :error="error" :hint="hint" :width="width" :disabled="disabled">
    <QSelect
      v-if="part === 'country'"
      :model-value="value ?? ''"
      :placeholder="countryPlaceholder"
      required
      :autocomplete="autocompletePrefix + AUTOCOMPLETE.country"
      :options="countries"
      @update:model-value="emit('change', 'country', $event ?? '')"
    />
    <QInput
      v-else
      :model-value="value ?? ''"
      :autocomplete="autocompletePrefix + AUTOCOMPLETE[part]"
      :type="part === 'phone' ? 'tel' : 'text'"
      :inputmode="inputmode"
      :autocapitalize="part === 'postalCode' ? 'characters' : undefined"
      :spellcheck="false"
      @update:model-value="emit('change', part, String($event ?? ''))"
    />
  </QField>
</template>
