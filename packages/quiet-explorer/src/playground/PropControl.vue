<script setup lang="ts">
// One playground control for one prop, picked by the prop's type (see PropControl in plugins/quiet-meta.ts).
import { QCheckbox, QField, QInput, QSelect, QTextarea } from '@frederikhd/quiet';
import { computed } from 'vue';
import type { PropMeta } from '../../plugins/quiet-meta';

const props = defineProps<{
  prop: PropMeta;
  /** What the control shows as its name: the prop, or "v-model:open" for the model. */
  label: string;
  /** The current value (undefined: not set, so the component's default applies). */
  value: unknown;
  /** The prop's default, shown when nothing is set. */
  fallback: unknown;
  /** JSON controls: the text being edited and its parse error. */
  json?: { text: string; error: string | null };
}>();
const emit = defineEmits<{ set: [value: unknown]; 'set-json': [text: string] }>();

const shown = computed(() => (props.value === undefined ? props.fallback : props.value));
// Enum values are JSON texts ('"md"', '2', 'null'), so numbers, booleans and null come back as themselves.
const enumOptions = computed(() =>
  props.prop.control.kind === 'enum'
    ? props.prop.control.values.map((v) => ({ value: v, label: v.startsWith('"') ? JSON.parse(v) : v }))
    : [],
);
const enumValue = computed(() => (shown.value === undefined ? '' : JSON.stringify(shown.value)));
const longJson = computed(() => (props.json?.text.length ?? 0) > 300);
</script>

<template>
  <QCheckbox
    v-if="prop.control.kind === 'boolean'"
    :label="label"
    :description="prop.description"
    :model-value="!!shown"
    @update:model-value="emit('set', $event ? true : fallback === true ? false : undefined)"
  />
  <QField v-else-if="prop.control.kind === 'enum'" :label="label" :hint="prop.description">
    <QSelect
      :model-value="enumValue"
      :placeholder="prop.required ? undefined : '—'"
      :options="enumOptions"
      @update:model-value="emit('set', $event ? JSON.parse($event) : undefined)"
    />
  </QField>
  <QField v-else-if="prop.control.kind === 'number'" :label="label" :hint="prop.description">
    <QInput
      type="number"
      numeric
      :model-value="(shown as number | undefined) ?? null"
      @update:model-value="emit('set', $event === '' || $event == null ? undefined : Number($event))"
    />
  </QField>
  <QField v-else-if="prop.control.kind === 'string'" :label="label" :hint="prop.description">
    <QInput
      :model-value="(value as string | undefined) ?? ''"
      @update:model-value="emit('set', $event === '' ? undefined : $event)"
    />
  </QField>
  <QField v-else :label="`${label} (JSON)`" :hint="prop.description" :error="json?.error" class="ex-json">
    <!-- Long values (image data URIs, big lists) start folded so the other controls stay in view. -->
    <details v-if="longJson" class="ex-json__fold">
      <summary>Show {{ label }} ({{ json!.text.length.toLocaleString('de-DE') }} characters)</summary>
      <QTextarea
        :model-value="json?.text"
        :rows="6"
        :max-rows="14"
        auto-grow
        spellcheck="false"
        @update:model-value="emit('set-json', $event ?? '')"
      />
    </details>
    <QTextarea
      v-else
      :model-value="json?.text"
      :rows="json?.text ? 4 : 2"
      :max-rows="10"
      auto-grow
      spellcheck="false"
      :placeholder="prop.type"
      @update:model-value="emit('set-json', $event ?? '')"
    />
  </QField>
</template>
