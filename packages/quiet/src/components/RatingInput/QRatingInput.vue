<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import QFieldMarker from '../../internal/QFieldMarker.vue';
import QFieldMessage from '../../internal/QFieldMessage.vue';
import { joinIds } from '../../utils/dom';
import { useFieldSetup, type FormStrings, type Markers } from '../Field/context';
import { STAR_PATH, ratingDefaults, type RatingStrings } from '../Rating/stars';

export interface RatingInputProps {
  label?: string;
  required?: boolean;
  error?: string | null;
  hint?: string;
  /** Goes on the chosen star's radio (or the first), so the Form's error summary can jump to it. */
  id?: string;
  name?: string;
  disabled?: boolean;
  markers?: Markers;
  strings?: RatingStrings & FormStrings;
}

const props = withDefaults(defineProps<RatingInputProps>(), {
  label: undefined,
  error: undefined,
  hint: undefined,
  id: undefined,
  name: undefined,
  markers: undefined,
  strings: undefined,
});
/** 1–5, or 0 for none yet. */
const model = defineModel<number>({ default: 0 });

// Five stars to pick from — a radio group, so ← → and screen readers work as with any radios.
const strings = useStrings<Required<RatingStrings>>('rating', ratingDefaults(), () => props.strings);
const { markers, strings: fstrings, status, summaryShown } = useFieldSetup(props);
const gid = useQuietId('q-rinput-');
const hover = ref(0);
const shown = computed(() => hover.value || model.value);
const describedBy = computed(() => joinIds(status.value[0] && `${gid}-msg`, props.hint && `${gid}-hint`));
const inputId = (n: number) => (n === (model.value || 1) && props.id ? props.id : `${gid}-${n}`);
</script>

<template>
  <div
    class="q-field q-rinput q-field--top"
    role="radiogroup"
    :aria-labelledby="`${gid}-label`"
    :aria-required="required ? 'true' : undefined"
    :aria-invalid="status[0] === 'error' ? 'true' : undefined"
  >
    <div class="q-field__layout">
      <div class="q-field__labelcol">
        <span :id="`${gid}-label`" class="q-field__label">
          {{ label ?? strings.yours }}<QFieldMarker :markers="markers" :required="required" :strings="fstrings" />
        </span>
      </div>
      <div class="q-field__controlcol">
        <div class="q-rinput__row" @mouseleave="hover = 0">
          <label
            v-for="n in 5"
            :key="n"
            :class="['q-rinput__star', n <= shown && 'is-on', status[0] === 'error' && 'is-invalid']"
            @mouseenter="hover = n"
          >
            <input
              :id="inputId(n)"
              type="radio"
              class="q-rinput__input"
              :name="name ?? gid"
              :value="n"
              :checked="model === n"
              :required="required && n === 1"
              :disabled="disabled"
              :aria-describedby="describedBy"
              @change="model = n"
            />
            <svg viewBox="0 0 20 20" aria-hidden="true"><path :d="STAR_PATH" /></svg>
            <span class="q-visually-hidden">{{ strings.stars(n) }}, {{ strings.words[n - 1] }}</span>
          </label>
          <span class="q-rinput__word" aria-hidden="true">{{ shown ? strings.words[shown - 1] : '' }}</span>
        </div>
        <QFieldMessage :status="status[0]" :message="status[1]" :id="`${gid}-msg`" :strings="fstrings" :quiet="summaryShown" />
        <div v-if="hint" :id="`${gid}-hint`" class="q-field__hint">{{ hint }}</div>
      </div>
    </div>
  </div>
</template>
