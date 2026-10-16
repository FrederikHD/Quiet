<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import { useConfig, useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import QFieldMessage from '../../internal/QFieldMessage.vue';
import QButton from '../Button/QButton.vue';
import { FORM_DEFAULT_STRINGS, provideNoField, type FormStrings } from '../Field/context';
import QInput from '../Input/QInput.vue';
import QTag from '../Tag/QTag.vue';

export interface DiscountCodeStrings {
  label?: string;
  apply?: string;
  reveal?: string;
  empty?: string;
  remove?: (code: string) => string;
  applied?: (code: string) => string;
  removed?: (code: string) => string;
}
export interface AppliedCode {
  code: string;
  /** What it does: "−10 %". */
  label?: string;
}
export interface DiscountCodeProps {
  /** Checks a code: return nothing when it worked, or the message why not — directly or from a promise (Apply shows a spinner meanwhile). */
  apply: (code: string) => void | string | null | undefined | Promise<void | string | null | undefined>;
  /** The codes in use, shown as removable tags. */
  applied?: AppliedCode[];
  /** Start as a quiet "Add a discount code" button. */
  collapsible?: boolean;
  label?: string;
  id?: string;
  disabled?: boolean;
  strings?: DiscountCodeStrings;
}

const props = withDefaults(defineProps<DiscountCodeProps>(), {
  applied: () => [],
  label: undefined,
  id: undefined,
  strings: undefined,
});
const emit = defineEmits<{ /** An applied code's tag was pressed. */ remove: [code: string] }>();

provideNoField();
const config = useConfig();
const strings = useStrings<Required<DiscountCodeStrings>>(
  'discount',
  {
    label: 'Discount code',
    apply: 'Apply',
    reveal: 'Add a discount code',
    empty: 'Enter a discount code',
    remove: (c) => `Remove discount ${c}`,
    applied: (c) => `Discount ${c} applied`,
    removed: (c) => `Discount ${c} removed`,
  },
  () => props.strings,
);
const fstrings = computed(() => ({ ...FORM_DEFAULT_STRINGS, ...(config.strings.form as FormStrings) }));
const autoId = useQuietId('q-discount-');
const id = computed(() => props.id ?? autoId);
const msgId = computed(() => `${id.value}-msg`);
const code = ref('');
const error = ref<string | null>(null);
const busy = ref(false);
const open = ref(!props.collapsible);
const said = ref('');
const input = ref<InstanceType<typeof QInput> | null>(null);
let alive = true;
onBeforeUnmount(() => (alive = false));

function done(msg: string | null | undefined | void, c: string) {
  if (!alive) return;
  busy.value = false;
  if (msg) {
    error.value = msg;
    input.value?.focus();
    return;
  }
  error.value = null;
  code.value = '';
  said.value = strings.value.applied(c);
}
// Not a <form>: it lives inside the checkout's form, so Enter applies the code instead of submitting the page.
function apply() {
  const c = code.value.trim();
  if (!c) {
    error.value = strings.value.empty;
    return;
  }
  // A code that's already applied is quietly ignored.
  if (props.applied.some((a) => a.code.toLowerCase() === c.toLowerCase())) {
    code.value = '';
    error.value = null;
    return;
  }
  const r = props.apply(c);
  if (r && typeof (r as Promise<unknown>).then === 'function') {
    busy.value = true;
    (r as Promise<string | null | undefined | void>).then(
      (m) => done(m, c),
      (e: unknown) => done((e as Error)?.message ?? String(e), c),
    );
  } else done(r as string | null | undefined, c);
}
// After removing, focus goes back to the field.
async function remove(a: AppliedCode) {
  emit('remove', a.code);
  said.value = strings.value.removed(a.code);
  open.value = true;
  await nextTick();
  input.value?.focus();
}
async function reveal() {
  open.value = true;
  await nextTick();
  input.value?.focus();
}
function onInput(v: string | number | null | undefined) {
  code.value = String(v ?? '');
  if (error.value) error.value = null;
}
</script>

<template>
  <div class="q-discount">
    <div v-if="open || applied.length" class="q-discount__field">
      <label class="q-field__label" :for="id">{{ label ?? strings.label }}</label>
      <div class="q-discount__row">
        <QInput
          :id="id"
          ref="input"
          :model-value="code"
          :invalid="!!error"
          autocomplete="off"
          autocapitalize="characters"
          :spellcheck="false"
          :disabled="disabled"
          :aria-describedby="error ? msgId : undefined"
          @update:model-value="onInput"
          @keydown.enter.prevent="!busy && apply()"
        />
        <QButton :loading="busy" :disabled="disabled" @click="apply">{{ strings.apply }}</QButton>
      </div>
      <QFieldMessage :status="error ? 'error' : null" :message="error" :id="msgId" :strings="fstrings" />
    </div>
    <QButton v-else variant="ghost" size="slim" class="q-discount__reveal" icon-start="tag" :expanded="false" @click="reveal">
      {{ strings.reveal }}
    </QButton>
    <ul v-if="applied.length" class="q-discount__tags">
      <li v-for="a in applied" :key="a.code">
        <QTag icon="tag" :detail="a.label" removable :remove-label="strings.remove(a.code)" :disabled="disabled" class="q-discount__tag" @remove="remove(a)">
          {{ a.code }}
        </QTag>
      </li>
    </ul>
    <span class="q-visually-hidden" aria-live="polite">{{ said }}</span>
  </div>
</template>
