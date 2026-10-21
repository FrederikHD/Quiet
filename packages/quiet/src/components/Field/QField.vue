<script setup lang="ts">
import { computed, provide, ref, useSlots } from 'vue';
import { useQuietId } from '../../composables/useQuietId';
import QFieldHelp from '../../internal/QFieldHelp.vue';
import QFieldMarker from '../../internal/QFieldMarker.vue';
import QFieldMessage from '../../internal/QFieldMessage.vue';
import { joinIds, textOf, warnOnce } from '../../utils/dom';
import { FIELD_CONTROL_KEY, useFieldSetup, type FieldCommonProps, type FieldControlContext } from './context';

export interface FieldProps extends FieldCommonProps {
  /** Id of the control; generated when missing. Use it to link errors in the Form summary. */
  id?: string;
  /** Keeps the label for screen readers but hides it — only when the context makes it obvious. */
  labelHidden?: boolean;
  /** Limits the control's width to fit the expected answer: xs 6rem, s 10rem, m 20rem, l 30rem. Default: full width. */
  width?: 'xs' | 's' | 'm' | 'l';
  /** Disables the control and greys the label. Say why in the hint. */
  disabled?: boolean;
  /** Shown and copyable, never editable: order number, created date. */
  readonly?: boolean;
}

const props = withDefaults(defineProps<FieldProps>(), {
  label: undefined,
  help: undefined,
  hint: undefined,
  error: undefined,
  warning: undefined,
  success: undefined,
  labelPlacement: undefined,
  labelWidth: undefined,
  markers: undefined,
  strings: undefined,
  id: undefined,
  width: undefined,
});
defineSlots<{
  /** Exactly one control. Quiet controls wire themselves up; bind `controlAttrs` onto a native one. */
  default(props: { controlAttrs: Record<string, unknown>; id: string; invalid: boolean }): unknown;
  /** Rich label content instead of `label`. */
  label?(): unknown;
  /** Rich help content instead of `help`. */
  help?(): unknown;
  /** Rich hint content instead of `hint`. */
  hint?(): unknown;
}>();

const slots = useSlots();
const { group, strings: fstrings, placement, markers, summaryShown, status } = useFieldSetup(props);
const autoId = useQuietId('q-field-');
// Like a <label for>: the Field's id, else the one on the control inside, else a generated one.
const claimedId = ref<string>();
const controlId = computed(() => props.id ?? claimedId.value ?? autoId);
const hintId = computed(() => `${controlId.value}-hint`);
const msgId = computed(() => `${controlId.value}-msg`);
const hasHint = computed(() => !!props.hint || !!slots.hint);
const isDisabled = computed(() => props.disabled || !!group?.value.disabled);
const isInvalid = computed(() => status.value[0] === 'error' || !!group?.value.invalid);

if (props.label == null && !slots.label) {
  warnOnce(
    'field-label',
    'Field: every field needs a label. Use labelHidden to hide it visually when the context makes it obvious.',
  );
}

const control = computed<FieldControlContext>(() => ({
  id: controlId.value,
  // The field's own message and hint first, then the group's (read with every field of the group).
  describedBy: joinIds(status.value[0] && msgId.value, hasHint.value && hintId.value, group?.value.describedBy),
  // A required group makes its parts required too (aria-required), though only the group shows the marker.
  required: props.required || !!group?.value.required,
  disabled: isDisabled.value,
  readOnly: props.readonly,
  invalid: isInvalid.value,
  claimId: (id) => (claimedId.value = id),
}));
provide(FIELD_CONTROL_KEY, control);

// For a native control: <QField v-slot="{ controlAttrs }"><input v-bind="controlAttrs" /></QField>
const controlAttrs = computed(() => ({
  id: control.value.id,
  'aria-describedby': control.value.describedBy,
  'aria-required': control.value.required ? 'true' : undefined,
  'aria-invalid': control.value.invalid ? 'true' : undefined,
  disabled: control.value.disabled || undefined,
  readonly: control.value.readOnly || undefined,
}));
</script>

<template>
  <div
    :class="[
      'q-field',
      `q-field--${placement}`,
      isDisabled && 'q-field--disabled',
      labelHidden && 'q-field--label-hidden',
    ]"
    :style="labelWidth ? { '--q-label-w': labelWidth } : undefined"
  >
    <div class="q-field__layout">
      <div :class="['q-field__labelcol', labelHidden && 'q-visually-hidden']">
        <label :id="`${controlId}-label`" class="q-field__label" :for="controlId">
          <slot name="label">{{ label }}</slot>
          <QFieldMarker :markers="markers" :required="required" :strings="fstrings" />
        </label>
        <QFieldHelp
          v-if="help || slots.help"
          :help="help"
          :label="label ?? textOf(slots.label?.())"
          :prefix="fstrings.help"
        >
          <slot v-if="slots.help" name="help" />
        </QFieldHelp>
      </div>
      <div class="q-field__controlcol">
        <div :class="['q-field__control', width && `q-field__control--${width}`]">
          <slot :id="controlId" :control-attrs="controlAttrs" :invalid="isInvalid" />
        </div>
        <QFieldMessage :id="msgId" :status="status[0]" :message="status[1]" :strings="fstrings" :quiet="summaryShown" />
        <div v-if="hasHint" :id="hintId" class="q-field__hint">
          <slot name="hint">{{ hint }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>
