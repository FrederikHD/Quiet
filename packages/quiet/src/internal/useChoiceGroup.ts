// Shared setup of CheckboxGroup and RadioGroup: Field's layout and wiring (label placement, markers, help, hint,
// messages) around a set of choices, plus the context the options read.
import { computed, provide, useSlots, type ComputedRef, type InjectionKey } from 'vue';
import { useQuietId } from '../composables/useQuietId';
import { flattenNodes, joinIds, textOf, warnOnce } from '../utils/dom';
import { useFieldSetup, type FieldCommonProps } from '../components/Field/context';
import type { ChoiceGroupContext } from './choice';

export type ChoiceLayout = 'list' | 'inline' | 'cards' | 'swatches' | 'buttons';

export interface ChoiceGroupProps extends FieldCommonProps {
  /** list (default): one option per row. inline: side by side, wrapping — 2–5 short options. cards: bordered tiles with description and meta. swatches / buttons: colour dots and size tiles (product options, filters). */
  layout?: ChoiceLayout;
  /** cards only: tiles per row (default 1). Each tile stays at least 180px wide, so rows drop to fewer tiles on narrow screens. */
  columns?: number;
  /** Name for form posts; generated when missing. */
  name?: string;
  /** Lands on the first enabled option (or the chosen radio) — use it to link errors in the Form summary. */
  id?: string;
  /** Disables every option in the group. */
  disabled?: boolean;
  /** Keeps the label for screen readers only (as on Field). */
  labelHidden?: boolean;
}

export function useChoiceGroup(
  kind: 'checkbox' | 'radio',
  props: ChoiceGroupProps,
  key: InjectionKey<ComputedRef<ChoiceGroupContext> | null>,
  value: () => string[] | string | null,
  set: (next: string[] | string) => void,
) {
  const slots = useSlots();
  const setup = useFieldSetup(props);
  const groupId = useQuietId(kind === 'radio' ? 'q-radiogroup-' : 'q-checkgroup-');
  const labelId = `${groupId}-label`;
  const hintId = `${groupId}-hint`;
  const msgId = `${groupId}-msg`;
  const status = setup.status;

  const layout = computed<ChoiceLayout>(() => {
    const l = props.layout ?? 'list';
    if (['list', 'inline', 'cards', 'swatches', 'buttons'].includes(l)) return l;
    warnOnce(
      `choice-layout-${kind}`,
      `${kind === 'radio' ? 'RadioGroup' : 'CheckboxGroup'}: layout is list, inline, cards, swatches or buttons.`,
    );
    return 'list';
  });
  const tile = computed(() => (layout.value === 'swatches' || layout.value === 'buttons' ? layout.value : null));

  // The options as written in the slot: their values, labels and whether they're disabled.
  function options() {
    return flattenNodes(slots.default?.() as never)
      .map((n) => n.props as { value?: string; label?: string; disabled?: boolean | '' } | null)
      .filter((p): p is { value?: string; label?: string; disabled?: boolean | '' } => !!p);
  }

  const ctx = computed<ChoiceGroupContext>(() => {
    const opts = options();
    const v = value();
    const enabled = opts.filter((o) => o.disabled == null || o.disabled === false);
    const firstValue = kind === 'radio' && v != null ? (v as string) : enabled[0]?.value;
    return {
      name: props.name ?? groupId,
      value: v,
      invalid: status.value[0] === 'error',
      disabled: !!props.disabled,
      card: layout.value === 'cards',
      tile: tile.value,
      describedBy: joinIds(status.value[0] && msgId, (props.hint || slots.hint) && hintId),
      requiredSingle: kind === 'checkbox' && !!props.required && opts.length === 1,
      firstId: props.id,
      firstValue,
      toggle(val, on) {
        const cur = (Array.isArray(v) ? v : []) as string[];
        set(on ? (cur.includes(val) ? cur : [...cur, val]) : cur.filter((x) => x !== val));
      },
      select(val) {
        set(val);
      },
    };
  });
  provide(key, ctx);

  // Swatches and size tiles show the chosen options' names beside the question: "Colour  Navy, Sand".
  function chosen(): string | null {
    const v = value();
    if (!tile.value || v == null) return null;
    const picked = options().filter((o) => (Array.isArray(v) ? v.includes(o.value ?? '') : o.value === v));
    return picked.length ? picked.map((o) => textOf(o.label)).join(', ') : null;
  }

  return { ...setup, groupId, labelId, hintId, msgId, layout, chosen, slots };
}
