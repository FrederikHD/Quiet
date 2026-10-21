<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';
import { hasContent, warnOnce } from '../../utils/dom';
import QIcon from '../Icon/QIcon.vue';
import type { IconName } from '../Icon/icons';

export interface ButtonProps {
  /** Visual weight. primary = the one main action of the view; secondary = everything else (default); ghost = low-emphasis actions in toolbars and table rows; danger = destructive actions that stand alone (confirm dialogs); danger-outline = destructive actions beside ordinary ones. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-outline';
  /** default follows the nearest data-density (40px comfortable, 32px compact). slim is a fixed 28px for in-cell and filter-bar actions (back office, desktop; grows to default below 640px). large is a fixed 48px for storefront primary actions and mobile. */
  size?: 'slim' | 'default' | 'large';
  /** Shows a spinner, keeps the button's width, ignores presses (aria-disabled, so focus stays on it) and sets aria-busy. */
  loading?: boolean;
  /** Icon before the label (or use the `icon-start` slot). */
  iconStart?: IconName;
  /** Icon after the label, e.g. a chevron or arrow (or use the `icon-end` slot). */
  iconEnd?: IconName;
  /** Square button with only an icon. Inferred when there is an icon and no label; requires aria-label. */
  iconOnly?: boolean;
  /** Makes the button a toggle and sets aria-pressed. true = selected. secondary and ghost only. */
  pressed?: boolean;
  /** For buttons that open a menu or popover: sets aria-expanded and keeps the button highlighted while true. */
  expanded?: boolean;
  /** Stretches to the container's width (product page Add to cart, mobile sheets). */
  fullWidth?: boolean;
  /** A number on the button: the items in the cart, unread messages. A bubble on an icon-only button, a pill after the label otherwise. Hidden at 0; "99+" above 99. */
  count?: number;
  /** What the count means, read with the button's name: (n) => `${n} items` gives "Cart, 2 items". Default: the number. */
  countLabel?: (count: number) => string;
  /** Renders an <a> with button styling, for navigation. */
  href?: string;
  /** Defaults to "button" so it never submits a form by accident. */
  type?: 'button' | 'submit' | 'reset';
  /** Dimmed and not clickable. With href: an unfocusable link with aria-disabled. */
  disabled?: boolean;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'secondary',
  size: 'default',
  type: 'button',
  iconStart: undefined,
  iconEnd: undefined,
  iconOnly: undefined,
  pressed: undefined,
  expanded: undefined,
  href: undefined,
  count: undefined,
  countLabel: undefined,
});

defineSlots<{
  /** The label. Leave it out for an icon-only button (then pass aria-label). */
  default?(): unknown;
  /** Your own icon before the label. */
  'icon-start'?(): unknown;
  /** Your own icon after the label. */
  'icon-end'?(): unknown;
}>();

const slots = useSlots();
const attrs = useAttrs();

const hasLabel = () => hasContent(slots.default?.());
const hasStart = () => !!props.iconStart || !!slots['icon-start'];
const hasEnd = () => !!props.iconEnd || !!slots['icon-end'];
const isIconOnly = () => props.iconOnly ?? (!hasLabel() && (hasStart() || hasEnd()));
const isDisabled = computed(() => props.disabled || props.loading);
const hasCount = computed(() => props.count != null && props.count > 0);
const countText = computed(() => (props.count! > 99 ? '99+' : String(props.count)));
// Read with the button's name; the bubble itself is hidden from screen readers.
const countSpoken = computed(() => (props.countLabel ? props.countLabel(props.count!) : String(props.count)));
const isToggle = computed(
  () => props.pressed !== undefined && (props.variant === 'secondary' || props.variant === 'ghost'),
);

function classes() {
  return [
    'q-btn',
    `q-btn--${props.variant}`,
    props.size === 'large' && 'q-btn--large',
    props.size === 'slim' && 'q-btn--slim',
    isIconOnly() && 'q-btn--icon',
    props.fullWidth && 'q-btn--full',
    props.loading && 'q-btn--loading',
  ];
}

function stateAttrs() {
  if (isIconOnly() && !attrs['aria-label'] && !attrs['aria-labelledby'])
    warnOnce('icon-label', 'Button: an icon-only button needs an aria-label (or aria-labelledby).');
  if (props.pressed !== undefined && !isToggle.value)
    warnOnce(
      'pressed-variant',
      `Button: \`pressed\` only works on the secondary and ghost variants; ignored on "${props.variant}".`,
    );
  if (props.size === 'large' && props.variant === 'ghost')
    warnOnce(
      'large-ghost',
      'Button: size="large" is for storefront primary actions; a large ghost button is probably not what you want.',
    );
  return {
    // With an aria-label the button's content isn't read, so the count joins the label: "Cart, 2 items".
    'aria-label':
      hasCount.value && attrs['aria-label'] ? `${attrs['aria-label']}, ${countSpoken.value}` : attrs['aria-label'],
    'aria-pressed': isToggle.value ? String(!!props.pressed) : undefined,
    'aria-expanded': props.expanded !== undefined ? String(props.expanded) : undefined,
    'aria-busy': props.loading ? 'true' : undefined,
  };
}

// One element: <a> for navigation (href), <button> otherwise.
function rootAttrs(): Record<string, unknown> {
  const state = stateAttrs();
  if (props.href == null && props.loading && !props.disabled) {
    // Loading: not natively disabled, so keyboard focus stays on the button; presses (and form submits) are ignored.
    const { onClick: _ignored, ...rest } = attrs;
    return { ...rest, ...state, type: props.type, 'aria-disabled': 'true', onClick: ignore };
  }
  if (props.href == null) return { ...attrs, ...state, type: props.type, disabled: isDisabled.value };
  if (!isDisabled.value) return { ...attrs, ...state, href: props.href };
  // A disabled link can't be focused or followed, and is still announced as a dimmed link.
  const { onClick: _ignored, ...rest } = attrs;
  return {
    ...rest,
    ...state,
    role: 'link',
    'aria-disabled': 'true',
    tabindex: -1,
    onClick: ignore,
  };
}
function ignore(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
}
</script>

<template>
  <component :is="href != null ? 'a' : 'button'" v-bind="rootAttrs()" :class="classes()">
    <span class="q-btn__content">
      <span v-if="hasStart()" class="q-btn__icon" aria-hidden="true">
        <slot name="icon-start"><QIcon v-if="iconStart" :name="iconStart" /></slot>
      </span>
      <span v-if="hasLabel()" class="q-btn__label"><slot /></span>
      <span v-if="hasEnd()" class="q-btn__icon" aria-hidden="true">
        <slot name="icon-end"><QIcon v-if="iconEnd" :name="iconEnd" /></slot>
      </span>
      <span v-if="hasCount && !attrs['aria-label']" class="q-visually-hidden">, {{ countSpoken }}</span>
    </span>
    <span v-if="hasCount" class="q-btn__count" aria-hidden="true">{{ countText }}</span>
    <span v-if="loading" class="q-btn__spinner" aria-hidden="true" />
  </component>
</template>
