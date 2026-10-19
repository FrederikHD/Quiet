<script setup lang="ts">
import { QButton, QField, QInput, QSelect, QTabs } from '@frederikhd/quiet';
import { computed, reactive, ref, watch } from 'vue';
import type { PropMeta } from '../../plugins/quiet-meta';
import type { Details, Entry } from '../catalog';
import CodeBlock from '../pages/CodeBlock.vue';
import { templateFor } from './code';
import PreviewTarget from './PreviewTarget';
import PropControl from './PropControl.vue';

const props = defineProps<{ entry: Entry; details: Details }>();

const story = computed(() => props.details.story!);
const api = computed(() => props.details.apis.find((a) => a.name === story.value.name) ?? props.details.apis[0]);
const modelProp = computed(() => (story.value.model ? (story.value.model.prop ?? 'modelValue') : null));

// What the controls change. Objects and arrays are edited as JSON (as long as they hold no functions).
const values = reactive<Record<string, unknown>>({});
const slotText = reactive<Record<string, string>>({});
const json = reactive<Record<string, { text: string; error: string | null }>>({});
const log = ref<{ id: number; text: string }[]>([]);
let seq = 0;

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
  // The one slot with a control is the content (the default slot, when the story gives it as text: a Button's label).
  // Named slots are the rich versions of props (#title next to title, #prefix next to prefix), so the props are the
  // controls; the story's slot content still renders, and the API tab lists every slot.
  const content = story.value.slots?.default;
  if (typeof content === 'string') slotText.default = content;
  for (const p of api.value?.props ?? []) {
    if (p.control.kind !== 'json') continue;
    const v = values[p.name];
    json[p.name] = { text: v === undefined || hasFunction(v) ? '' : JSON.stringify(v, null, 2), error: null };
  }
  log.value = [];
}
function structuredCloneSafe<T>(v: T): T {
  if (hasFunction(v)) return v;
  return v === undefined ? v : JSON.parse(JSON.stringify(v));
}
watch(() => props.entry.folder, reset, { immediate: true });

// Every prop gets a control, except:
// - what the story manages itself (hide) and what only code can pass (functions, elements);
// - the default… twin of the v-model the playground binds: with v-model bound, defaultValue / defaultOpen do nothing.
// Those are listed under the controls with the reason, so nothing is silently missing.
const hidden = computed(() => new Set(story.value.hide ?? []));
const boundDefault = computed(() => {
  const m = modelProp.value;
  return m ? `default${m === 'modelValue' ? 'Value' : m.charAt(0).toUpperCase() + m.slice(1)}` : null;
});
const controls = computed<PropMeta[]>(() =>
  (api.value?.props ?? []).filter(
    (p) =>
      !hidden.value.has(p.name) &&
      p.name !== boundDefault.value &&
      p.control.kind !== 'code' &&
      !(p.control.kind === 'json' && hasFunction(values[p.name])),
  ),
);
const notEditable = computed(() =>
  (api.value?.props ?? [])
    .filter((p) => !controls.value.includes(p))
    .map((p) => ({
      name: p.name,
      why:
        p.control.kind === 'code'
          ? p.control.reason
          : hidden.value.has(p.name)
            ? 'set by this playground'
            : p.name === boundDefault.value
              ? `only without v-model; here v-model is bound`
              : 'set by the story in code',
    })),
);
// Plumbing rather than look and behaviour: folded under "More options" so the main controls stay about the component.
const isPlumbing = (p: PropMeta) =>
  ['id', 'name', 'mainId', 'panelClass', 'teleport'].includes(p.name) || /strings$/i.test(p.name);
// The v-model first: it's the value people try first.
const mainControls = computed(() =>
  controls.value
    .filter((p) => !isPlumbing(p))
    .sort((a, b) => Number(b.name === modelProp.value) - Number(a.name === modelProp.value)),
);
const moreControls = computed(() => controls.value.filter(isPlumbing));
const labelOf = (p: PropMeta) =>
  p.name !== modelProp.value ? p.name : p.name === 'modelValue' ? 'v-model' : `v-model:${p.name}`;
// Props named default… are read once, on mount: changing one starts the preview again.
const previewKey = computed(() => JSON.stringify(Object.entries(values).filter(([k]) => k.startsWith('default'))));
const defaults = computed(() =>
  Object.fromEntries((api.value?.props ?? []).map((p) => [p.name, parseDefault(p.default)])),
);
function parseDefault(d?: string): unknown {
  if (d == null) return undefined;
  try {
    return JSON.parse(d.replace(/'/g, '"'));
  } catch {
    return d;
  }
}
function setJson(name: string, text: string) {
  json[name].text = text;
  try {
    values[name] = text.trim() === '' ? undefined : JSON.parse(text);
    json[name].error = null;
  } catch (e) {
    json[name].error = (e as Error).message;
  }
}

const events = computed(() => (api.value?.events ?? []).map((e) => e.name));
function onEvent(name: string, args: unknown[]) {
  if (modelProp.value && name === `update:${modelProp.value}`) {
    values[modelProp.value] = args[0];
    if (modelProp.value in json && !hasFunction(args[0]))
      json[modelProp.value] = { text: JSON.stringify(args[0], null, 2) ?? '', error: null };
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
const storyText = computed(() =>
  Object.fromEntries(
    Object.entries(story.value.slots ?? {}).filter((e): e is [string, string] => typeof e[1] === 'string'),
  ),
);
const code = computed(() => templateFor(story.value, values, defaults.value, { ...storyText.value, ...slotText }));
const panel = ref('controls');
</script>

<template>
  <div class="ex-playground">
    <div class="ex-preview-bar">
      <QSelect
        v-model="view.theme"
        size="slim"
        aria-label="Preview theme"
        :options="[
          { value: 'inherit', label: 'Page theme' },
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]"
      />
      <QSelect
        v-model="view.density"
        size="slim"
        aria-label="Preview density"
        :options="[
          { value: 'inherit', label: 'Page density' },
          { value: 'comfortable', label: 'Comfortable' },
          { value: 'compact', label: 'Compact' },
        ]"
      />
      <QSelect
        v-model="view.width"
        size="slim"
        aria-label="Preview width"
        :options="[
          { value: 'full', label: 'Full width' },
          { value: 'tablet', label: 'Tablet · 768' },
          { value: 'phone', label: 'Phone · 375' },
        ]"
      />
      <QButton size="slim" variant="ghost" icon-start="refresh" @click="reset">Reset</QButton>
    </div>
    <div
      class="ex-preview"
      data-testid="playground-preview"
      :data-theme="view.theme === 'inherit' ? undefined : view.theme"
      :data-density="view.density === 'inherit' ? undefined : view.density"
    >
      <!-- A preview never posts a form: that would reload the explorer. The submit still reaches the component's own listeners. -->
      <div
        :class="['ex-preview__stage', story.layout === 'block' && 'is-block']"
        :style="{ maxWidth: WIDTHS[view.width] }"
        @submit.prevent
      >
        <QButton v-if="story.opener" @click="modelProp && (values[modelProp] = true)">{{ story.opener }}</QButton>
        <QField v-if="story.field" :label="story.field.label" :hint="story.field.hint">
          <PreviewTarget
            :key="previewKey"
            :story="story"
            :values="values"
            :slot-text="slotText"
            :events="events"
            @event="onEvent"
          />
        </QField>
        <PreviewTarget
          v-else
          :key="previewKey"
          :story="story"
          :values="values"
          :slot-text="slotText"
          :events="events"
          @event="onEvent"
        />
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
            <QField label="Content (default slot)" hint="Text; empty leaves it out.">
              <QInput v-model="slotText[name]" />
            </QField>
          </template>
          <PropControl
            v-for="p in mainControls"
            :key="p.name"
            :prop="p"
            :label="labelOf(p)"
            :value="values[p.name]"
            :fallback="defaults[p.name]"
            :json="json[p.name]"
            @set="values[p.name] = $event"
            @set-json="setJson(p.name, $event)"
          />
          <details v-if="moreControls.length" class="ex-controls__more" data-testid="playground-more">
            <summary>More options: {{ moreControls.map((p) => p.name).join(', ') }}</summary>
            <div class="ex-controls">
              <PropControl
                v-for="p in moreControls"
                :key="p.name"
                :prop="p"
                :label="labelOf(p)"
                :value="values[p.name]"
                :fallback="defaults[p.name]"
                :json="json[p.name]"
                @set="values[p.name] = $event"
                @set-json="setJson(p.name, $event)"
              />
            </div>
          </details>
          <p v-if="notEditable.length" class="ex-muted ex-controls__rest" data-testid="playground-not-editable">
            Not editable here:
            <template v-for="(n, i) in notEditable" :key="n.name"
              ><code>{{ n.name }}</code> ({{ n.why }}){{ i < notEditable.length - 1 ? ', ' : '.' }}
            </template>
          </p>
        </div>
      </template>
      <template #panel-code>
        <CodeBlock :code="code" lang="vue" />
      </template>
      <template #panel-events>
        <p v-if="!log.length" class="ex-muted">Use the component — what it emits shows up here.</p>
        <ol v-else class="ex-log" data-testid="playground-events">
          <li v-for="e in log" :key="e.id">
            <code>{{ e.text }}</code>
          </li>
        </ol>
      </template>
    </QTabs>
  </div>
</template>
