<script setup lang="ts">
import { QButton, QCheckbox, QField, QInput, QSelect, QTabs, QTextarea } from 'quiet';
import { computed, reactive, ref, watch } from 'vue';
import type { PropMeta } from '../../plugins/quiet-meta';
import type { Entry } from '../catalog';
import CodeBlock from '../pages/CodeBlock.vue';
import { templateFor } from './code';
import PreviewTarget from './PreviewTarget';

const props = defineProps<{ entry: Entry }>();

const story = computed(() => props.entry.story!);
const api = computed(() => props.entry.apis.find((a) => a.name === story.value.name) ?? props.entry.apis[0]);
const modelProp = computed(() => (story.value.model ? (story.value.model.prop ?? 'modelValue') : null));

// What the controls change. Objects and arrays are edited as JSON (as long as they hold no functions).
const values = reactive<Record<string, unknown>>({});
const slotText = reactive<Record<string, string>>({});
const json = reactive<Record<string, { text: string; error: string | null }>>({});
const log = ref<{ id: number; text: string }[]>([]);
let seq = 0;

const isPlain = (v: unknown) => v !== null && typeof v === 'object' && !hasFunction(v);
function hasFunction(v: unknown): boolean {
  if (typeof v === 'function') return true;
  if (v && typeof v === 'object') return Object.values(v as object).some(hasFunction);
  return false;
}

function reset() {
  for (const k of Object.keys(values)) delete values[k];
  for (const k of Object.keys(slotText)) delete slotText[k];
  for (const k of Object.keys(json)) delete json[k];
  Object.assign(values, structuredCloneSafe(story.value.props ?? {}));
  if (modelProp.value) values[modelProp.value] = structuredCloneSafe(story.value.model!.value);
  for (const [n, c] of Object.entries(story.value.slots ?? {})) if (typeof c === 'string') slotText[n] = c;
  for (const [k, v] of Object.entries(values)) if (isPlain(v)) json[k] = { text: JSON.stringify(v, null, 2), error: null };
  log.value = [];
}
function structuredCloneSafe<T>(v: T): T {
  if (hasFunction(v)) return v;
  return v === undefined ? v : JSON.parse(JSON.stringify(v));
}
watch(() => props.entry.folder, reset, { immediate: true });

// Controls come from the component's own props, minus the v-model and anything the story hides.
const controls = computed<PropMeta[]>(() =>
  (api.value?.props ?? []).filter(
    (p) => p.name !== modelProp.value && !(story.value.hide ?? []).includes(p.name) && (p.control.kind !== 'other' || p.name in json),
  ),
);
const defaults = computed(() => Object.fromEntries((api.value?.props ?? []).map((p) => [p.name, parseDefault(p.default)])));
function parseDefault(d?: string): unknown {
  if (d == null) return undefined;
  try {
    return JSON.parse(d.replace(/'/g, '"'));
  } catch {
    return d;
  }
}
function enumValue(p: PropMeta): string {
  const v = values[p.name] ?? defaults.value[p.name];
  return v == null ? '' : String(v);
}
function setEnum(p: PropMeta, v: string | null | undefined) {
  const numeric = p.control.kind === 'enum' && p.control.values.every((x) => /^-?\d+$/.test(x));
  values[p.name] = v === '' || v == null ? undefined : numeric ? Number(v) : v;
}
function setJson(name: string, text: string) {
  json[name].text = text;
  try {
    values[name] = JSON.parse(text);
    json[name].error = null;
  } catch (e) {
    json[name].error = (e as Error).message;
  }
}

const events = computed(() => (api.value?.events ?? []).map((e) => e.name));
function onEvent(name: string, args: unknown[]) {
  if (modelProp.value && name === `update:${modelProp.value}`) {
    values[modelProp.value] = args[0];
    if (modelProp.value in json && isPlain(args[0])) json[modelProp.value] = { text: JSON.stringify(args[0], null, 2), error: null };
  }
  const shown = args.map((a) => (a instanceof Event ? `${a.constructor.name}` : safeJson(a))).join(', ');
  log.value = [{ id: ++seq, text: `${name}(${shown})` }, ...log.value].slice(0, 30);
}
function safeJson(v: unknown) {
  try {
    const s = JSON.stringify(v);
    return s && s.length > 120 ? `${s.slice(0, 117)}…` : (s ?? String(v));
  } catch {
    return String(v);
  }
}

// How the preview is shown: theme, density and width (components measure their own width, so this is how
// to see the phone layouts of Table, Field, FieldGroup …).
const view = reactive({ theme: 'inherit', density: 'inherit', width: 'full' });
const WIDTHS: Record<string, string | undefined> = { full: undefined, tablet: '768px', phone: '375px' };
const code = computed(() => templateFor(story.value, values, defaults.value, slotText));
const panel = ref('controls');
</script>

<template>
  <div class="ex-playground">
    <div class="ex-preview-bar">
      <QSelect v-model="view.theme" size="slim" aria-label="Preview theme" :options="[{ value: 'inherit', label: 'Page theme' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]" />
      <QSelect v-model="view.density" size="slim" aria-label="Preview density" :options="[{ value: 'inherit', label: 'Page density' }, { value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' }]" />
      <QSelect v-model="view.width" size="slim" aria-label="Preview width" :options="[{ value: 'full', label: 'Full width' }, { value: 'tablet', label: 'Tablet · 768' }, { value: 'phone', label: 'Phone · 375' }]" />
      <QButton size="slim" variant="ghost" icon-start="refresh" @click="reset">Reset</QButton>
    </div>
    <div
      class="ex-preview"
      data-testid="playground-preview"
      :data-theme="view.theme === 'inherit' ? undefined : view.theme"
      :data-density="view.density === 'inherit' ? undefined : view.density"
    >
      <!-- A preview never posts a form: that would reload the explorer. The submit still reaches the component's own listeners. -->
      <div :class="['ex-preview__stage', story.layout === 'block' && 'is-block']" :style="{ maxWidth: WIDTHS[view.width] }" @submit.prevent>
        <QButton v-if="story.opener" @click="modelProp && (values[modelProp] = true)">{{ story.opener }}</QButton>
        <QField v-if="story.field" :label="story.field.label" :hint="story.field.hint">
          <PreviewTarget :story="story" :values="values" :slot-text="slotText" :events="events" @event="onEvent" />
        </QField>
        <PreviewTarget v-else :story="story" :values="values" :slot-text="slotText" :events="events" @event="onEvent" />
      </div>
    </div>

    <QTabs
      v-model="panel"
      label="Playground"
      variant="segmented"
      size="slim"
      :tabs="[
        { value: 'controls', label: 'Props' },
        { value: 'code', label: 'Code' },
        { value: 'events', label: 'Events', count: log.length || undefined },
      ]"
      :panel-focusable="false"
    >
      <template #panel-controls>
        <div class="ex-controls" data-testid="playground-controls">
          <template v-for="(_text, name) in slotText" :key="`slot-${name}`">
            <QField :label="name === 'default' ? 'Slot: default' : `Slot: #${name}`">
              <QInput v-model="slotText[name]" />
            </QField>
          </template>
          <template v-for="p in controls" :key="p.name">
            <QCheckbox
              v-if="p.control.kind === 'boolean'"
              :label="p.name"
              :description="p.description"
              :model-value="!!(values[p.name] ?? defaults[p.name])"
              @update:model-value="values[p.name] = $event ? true : defaults[p.name] === true ? false : undefined"
            />
            <QField v-else-if="p.control.kind === 'enum'" :label="p.name" :hint="p.description">
              <QSelect
                :model-value="enumValue(p)"
                :placeholder="p.required ? undefined : '—'"
                :options="p.control.values"
                @update:model-value="setEnum(p, $event)"
              />
            </QField>
            <QField v-else-if="p.control.kind === 'number'" :label="p.name" :hint="p.description">
              <QInput
                type="number"
                :model-value="(values[p.name] as number | undefined) ?? (defaults[p.name] as number | undefined) ?? null"
                numeric
                @update:model-value="values[p.name] = $event === '' || $event == null ? undefined : Number($event)"
              />
            </QField>
            <QField v-else-if="p.control.kind === 'string'" :label="p.name" :hint="p.description">
              <QInput
                :model-value="(values[p.name] as string | undefined) ?? ''"
                @update:model-value="values[p.name] = $event === '' ? undefined : $event"
              />
            </QField>
            <QField v-else :label="`${p.name} (JSON)`" :hint="p.description" :error="json[p.name]?.error">
              <QTextarea :model-value="json[p.name]?.text" auto-grow :max-rows="14" spellcheck="false" class="ex-json" @update:model-value="setJson(p.name, $event ?? '')" />
            </QField>
          </template>
          <p v-if="modelProp" class="ex-muted">
            <code>v-model{{ modelProp === 'modelValue' ? '' : `:${modelProp}` }}</code> = <code>{{ safeJson(values[modelProp]) }}</code>
          </p>
        </div>
      </template>
      <template #panel-code>
        <CodeBlock :code="code" lang="vue" />
      </template>
      <template #panel-events>
        <p v-if="!log.length" class="ex-muted">Use the component — what it emits shows up here.</p>
        <ol v-else class="ex-log" data-testid="playground-events">
          <li v-for="e in log" :key="e.id"><code>{{ e.text }}</code></li>
        </ol>
      </template>
    </QTabs>
  </div>
</template>
