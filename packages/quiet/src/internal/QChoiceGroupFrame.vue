<script setup lang="ts">
// The markup of CheckboxGroup and RadioGroup: the question, its marker, help and chosen names, the options, the
// message and the hint.
import type { FormStrings, LabelPlacement, Markers } from '../components/Field/context';
import QFieldHelp from './QFieldHelp.vue';
import QFieldMarker from './QFieldMarker.vue';
import QFieldMessage from './QFieldMessage.vue';
import type { ChoiceLayout } from './useChoiceGroup';

defineProps<{
  kind: 'checkbox' | 'radio';
  layout: ChoiceLayout;
  placement: LabelPlacement;
  label?: string;
  labelHidden?: boolean;
  labelWidth?: string;
  ariaLabel?: string;
  help?: string;
  hint?: string;
  hasHint: boolean;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
  markers: Markers;
  strings: Required<FormStrings>;
  status: ['error' | 'warning' | 'success', string] | [null, null];
  summaryShown: boolean;
  chosen: string | null;
  labelId: string;
  hintId: string;
  msgId: string;
}>();
</script>

<template>
  <div
    :class="[
      'q-field',
      'q-fgroup',
      'q-choicegroup',
      `q-choicegroup--${layout}`,
      `q-field--${placement}`,
      label == null && 'q-fgroup--unlabelled',
      disabled && 'q-field--disabled',
    ]"
    :role="kind === 'radio' ? 'radiogroup' : 'group'"
    :aria-labelledby="label != null ? labelId : undefined"
    :aria-label="label == null ? ariaLabel : undefined"
    :aria-required="kind === 'radio' && required ? 'true' : undefined"
    :aria-invalid="kind === 'radio' && status[0] === 'error' ? 'true' : undefined"
    :style="labelWidth ? { '--q-label-w': labelWidth } : undefined"
  >
    <div class="q-field__layout">
      <div :class="['q-field__labelcol', labelHidden && 'q-visually-hidden']">
        <span v-if="label != null" :id="labelId" class="q-field__label">
          {{ label }}<QFieldMarker :markers="markers" :required="required" :strings="strings" /><span
            v-if="chosen"
            class="q-choicegroup__chosen"
            aria-hidden="true"
            >{{ chosen }}</span
          >
        </span>
        <QFieldHelp v-if="label != null && help" :help="help" :label="label" :prefix="strings.help" />
      </div>
      <div class="q-field__controlcol">
        <div
          :class="['q-choicegroup__options', `q-choicegroup__options--${layout}`]"
          :style="layout === 'cards' && columns && columns > 1 ? { '--q-cols': columns } : undefined"
        >
          <slot />
        </div>
        <QFieldMessage :id="msgId" :status="status[0]" :message="status[1]" :strings="strings" :quiet="summaryShown" />
        <div v-if="hasHint" :id="hintId" class="q-field__hint">
          <slot name="hint">{{ hint }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>
