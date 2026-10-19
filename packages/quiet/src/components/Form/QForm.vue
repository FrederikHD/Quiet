<script setup lang="ts">
import { computed, nextTick, provide, ref, watch } from 'vue';
import { useConfig } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import { FOCUSABLE } from '../../utils/dom';
import { FORM_DEFAULT_STRINGS, FORM_KEY, type FormStrings, type LabelPlacement, type Markers } from '../Field/context';
import QIcon from '../Icon/QIcon.vue';

export interface FormError {
  /** The control (or group) to jump to. */
  id?: string;
  /** What's wrong and how to fix it — the same text as the Field's error. */
  message: string;
}

export interface FormProps {
  /** For every field inside. auto (default): label above until the field is 520px wide, then beside — measured per field. top: always above. side: beside from 400px, else above. */
  labelPlacement?: LabelPlacement;
  /** Width of side labels, any CSS length. Default 200px. */
  labelWidth?: string;
  /** required (default): an asterisk on required fields. optional: "(optional)" on optional fields — best for checkout. none: no markers. */
  markers?: Markers;
  /** comfortable or compact: sets data-density on the form, sizing the fields and controls inside. Default: inherited. */
  density?: 'comfortable' | 'compact';
  /** Translations for the built-in words of every field inside and of the error summary. */
  strings?: FormStrings;
  /** Errors to list in a summary at the top after a failed submit. Each links to its control by id. Focus moves to the summary after each submit that leaves errors, and when errors first appear — not while people are fixing them. */
  errors?: FormError[] | null;
  /** Default true. Set false to keep focus where it is (e.g. live validation); the summary is then announced as an alert. */
  focusErrorSummary?: boolean;
  /** Default true: the browser's own validation bubbles are off; show errors through Field instead. */
  noValidate?: boolean;
}

const props = withDefaults(defineProps<FormProps>(), {
  labelPlacement: 'auto',
  markers: 'required',
  labelWidth: undefined,
  density: undefined,
  strings: undefined,
  errors: undefined,
  focusErrorSummary: true,
  noValidate: true,
});
const emit = defineEmits<{
  /** The form was submitted. Call event.preventDefault() unless you want a native post. */
  submit: [event: SubmitEvent];
}>();
defineSlots<{
  /** The form's sections, fields and actions. */
  default(): unknown;
}>();

const config = useConfig();
const strings = computed(() => ({ ...FORM_DEFAULT_STRINGS, ...(config.strings.form as FormStrings), ...props.strings }));
const list = computed(() => (props.errors?.length ? props.errors : null));

provide(
  FORM_KEY,
  computed(() => ({
    labelPlacement: props.labelPlacement,
    markers: props.markers,
    strings: props.strings,
    summaryShown: !!list.value,
  })),
);

const summary = ref<HTMLElement | null>(null);
const summaryId = useQuietId('q-form-summary-');
const submits = ref(0);

// Focus the summary after a submit, or when errors first appear (e.g. from the server) — never while someone is
// correcting them, and not just because the app rebuilt the list.
watch(
  [submits, () => !!list.value],
  async ([, hasErrors]) => {
    if (!hasErrors || !props.focusErrorSummary) return;
    await nextTick();
    summary.value?.focus({ preventScroll: true });
    summary.value?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  },
  { immediate: true },
);

function onSubmit(e: SubmitEvent) {
  submits.value++;
  emit('submit', e);
}

function jump(id: string, e: MouseEvent) {
  let el = document.getElementById(id);
  if (!el) return;
  // A group's id: go to its first control.
  if (!el.matches(FOCUSABLE)) el = el.querySelector<HTMLElement>(FOCUSABLE) ?? el;
  e.preventDefault();
  const target = el;
  const go = () => {
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };
  // Hidden in a closed tab? Ask it to open first (Tabs listens), then focus once it's shown.
  if (!target.getClientRects().length) {
    target.dispatchEvent(new CustomEvent('q-reveal', { bubbles: true }));
    setTimeout(go, 0);
  } else go();
}
</script>

<template>
  <form
    class="q-form"
    :novalidate="noValidate"
    :data-density="density"
    :style="labelWidth ? { '--q-label-w': labelWidth } : undefined"
    @submit="onSubmit"
  >
    <div
      v-if="list"
      ref="summary"
      class="q-form__summary"
      tabindex="-1"
      :role="focusErrorSummary ? 'region' : 'alert'"
      :aria-labelledby="`${summaryId}-title`"
    >
      <div :id="`${summaryId}-title`" class="q-form__summary-title">
        <span class="q-lead" aria-hidden="true"><QIcon name="alert-circle" size="sm" /></span>
        <span>{{ strings.errorSummaryTitle }}</span>
      </div>
      <ul class="q-form__summary-list">
        <li v-for="(er, i) in list" :key="er.id ?? i">
          <a v-if="er.id" :href="`#${er.id}`" @click="jump(er.id, $event)">{{ er.message }}</a>
          <template v-else>{{ er.message }}</template>
        </li>
      </ul>
    </div>
    <slot />
  </form>
</template>
