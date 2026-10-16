// What CheckboxGroup and RadioGroup tell the Checkboxes and Radios inside them.
import { inject, type ComputedRef, type InjectionKey } from 'vue';

export interface ChoiceGroupContext {
  name: string;
  /** CheckboxGroup: the ticked values (null = each checkbox manages itself). RadioGroup: the chosen value. */
  value: string[] | string | null;
  invalid: boolean;
  disabled: boolean;
  card: boolean;
  /** swatches / buttons layouts: colour dots or size tiles instead of rows. */
  tile: 'swatches' | 'buttons' | null;
  describedBy?: string;
  /** A required group around one checkbox marks that checkbox required. */
  requiredSingle: boolean;
  /** The group's id goes to this option, so the Form's error summary can jump to it. */
  firstId?: string;
  firstValue?: string;
  toggle(value: string, on: boolean): void;
  select(value: string): void;
}

export const CHECK_GROUP_KEY: InjectionKey<ComputedRef<ChoiceGroupContext> | null> = Symbol('quiet-checkbox-group');
export const RADIO_GROUP_KEY: InjectionKey<ComputedRef<ChoiceGroupContext> | null> = Symbol('quiet-radio-group');

export function useCheckGroup() {
  return inject(CHECK_GROUP_KEY, null);
}
export function useRadioGroup() {
  return inject(RADIO_GROUP_KEY, null);
}
