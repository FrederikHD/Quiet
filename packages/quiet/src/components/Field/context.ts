// How Form, Field, FieldGroup and the choice groups talk to what is inside them.
//
//   Form ── FORM_KEY ──▶ every Field / group (label placement, markers, strings, whether the summary shows)
//   FieldGroup ── GROUP_KEY ──▶ its Fields (the group's message ids, invalid and disabled)
//   Field ── FIELD_CONTROL_KEY ──▶ its one control (id, aria-describedby, required, disabled, invalid …)
//
// Controls read FIELD_CONTROL_KEY through useFieldControl(); a component that renders controls of its own
// (Combobox's search field, Pagination's page-size select) calls provideNoField() so they don't pick up its Field.
import { computed, inject, onBeforeUnmount, provide, watch, type ComputedRef, type InjectionKey } from 'vue';
import { useConfig } from '../../config';

export type LabelPlacement = 'auto' | 'top' | 'side';
export type Markers = 'required' | 'optional' | 'none';

export interface FormStrings {
  /** Shown after optional labels when markers="optional". Default "optional". */
  optional?: string;
  /** Not shown by Quiet's own markers: the asterisk is hidden from screen readers, which hear aria-required instead. Default "required". */
  required?: string;
  /** Prefix of the help button's name: "Help: SKU". Default "Help". */
  help?: string;
  /** Read before an error message by screen readers. Default "Error:". */
  errorPrefix?: string;
  /** Read before a warning message by screen readers. Default "Warning:". */
  warningPrefix?: string;
  /** Read before a success message by screen readers. Default "" (nothing). */
  successPrefix?: string;
  /** Heading of the error summary. Default "Please fix the following". */
  errorSummaryTitle?: string;
}

export const FORM_DEFAULT_STRINGS: Required<FormStrings> = {
  optional: 'optional',
  required: 'required',
  help: 'Help',
  errorPrefix: 'Error:',
  warningPrefix: 'Warning:',
  successPrefix: '',
  errorSummaryTitle: 'Please fix the following',
};

export interface FormContext {
  labelPlacement: LabelPlacement;
  markers: Markers;
  strings?: FormStrings;
  /** The error summary is showing and already announces the errors, so field messages stay quiet. */
  summaryShown: boolean;
}
export const FORM_KEY: InjectionKey<ComputedRef<FormContext>> = Symbol('quiet-form');

export interface GroupContext {
  describedBy?: string;
  invalid: boolean;
  disabled: boolean;
}
export const GROUP_KEY: InjectionKey<ComputedRef<GroupContext> | null> = Symbol('quiet-field-group');

export interface FieldControlContext {
  id: string;
  describedBy?: string;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  /** A control with an id of its own hands it to the Field, so the label and messages point at it. */
  claimId(id: string | undefined): void;
}
export const FIELD_CONTROL_KEY: InjectionKey<ComputedRef<FieldControlContext> | null> = Symbol('quiet-field-control');

/** The surrounding Field's wiring for a control, or null outside a Field. */
export function useFieldControl(): ComputedRef<FieldControlContext> | null {
  return inject(FIELD_CONTROL_KEY, null);
}

/**
 * The id a control renders. Inside a Field it is always the Field's: the Field's own `id`, else the control's
 * (handed over here), else a generated one. Outside a Field it is the control's own `id`.
 */
export function useControlId(
  field: ComputedRef<FieldControlContext> | null,
  own: () => string | undefined,
): ComputedRef<string | undefined> {
  if (field) {
    watch(own, (id) => field.value.claimId(id), { immediate: true });
    onBeforeUnmount(() => field.value.claimId(undefined));
  }
  return computed(() => (field ? field.value.id : own()));
}

/** Stops controls rendered inside this component from picking up the surrounding Field. */
export function provideNoField(): void {
  provide(FIELD_CONTROL_KEY, null);
  provide(GROUP_KEY, null);
}

export interface FieldCommonProps {
  /** The question the field asks: "Product title", "Email". Always give one (Field and FieldGroup also take a `#label` slot). */
  label?: string;
  /** Opens from a help icon after the label, as a Popover tip. One or two sentences (Field and FieldGroup also take a `#help` slot). */
  help?: string;
  /** Visible guidance under the control: format, limits, where it shows up (Field, FieldGroup, CheckboxGroup and RadioGroup also take a `#hint` slot). */
  hint?: string;
  /** Error message; also marks the control invalid. Wins over warning and success. */
  error?: string | null;
  /** Something to double-check that doesn't block saving. */
  warning?: string | null;
  /** Confirms a check passed: "Discount code applied". */
  success?: string | null;
  /** Marks the field required: an asterisk (or no "(optional)") and aria-required on the control. */
  required?: boolean;
  /** Overrides the Form's placement for this one field or group. */
  labelPlacement?: LabelPlacement;
  /** Width of a label beside the control, any CSS length. Default 200px. */
  labelWidth?: string;
  /** Overrides the Form's markers: required = asterisk on required fields, optional = "(optional)" on optional ones, none. */
  markers?: Markers;
  /** Translations for the built-in words; overrides the Form's. */
  strings?: FormStrings;
}

/** Shared setup of Field, FieldGroup, the choice groups and RatingInput. */
export function useFieldSetup(props: FieldCommonProps) {
  const form = inject(FORM_KEY, null);
  const group = inject(GROUP_KEY, null);
  const config = useConfig();
  const strings = computed<Required<FormStrings>>(() => ({
    ...FORM_DEFAULT_STRINGS,
    ...(config.strings.form as FormStrings | undefined),
    ...form?.value.strings,
    ...props.strings,
  }));
  const placement = computed<LabelPlacement>(() =>
    group?.value ? 'top' : (props.labelPlacement ?? form?.value.labelPlacement ?? 'auto'),
  );
  const markers = computed<Markers>(() => props.markers ?? form?.value.markers ?? 'required');
  const summaryShown = computed(() => !!form?.value.summaryShown);
  const status = computed<['error' | 'warning' | 'success', string] | [null, null]>(() =>
    props.error
      ? ['error', props.error]
      : props.warning
        ? ['warning', props.warning]
        : props.success
          ? ['success', props.success]
          : [null, null],
  );
  return { form, group, strings, placement, markers, summaryShown, status };
}
