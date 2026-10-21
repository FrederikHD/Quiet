# FormActions

The row of buttons that ends a form: secondary actions first, the primary action last.

```vue
<QFormActions>
  <QButton @click="cancel">Cancel</QButton>
  <QButton variant="primary" type="submit">Save</QButton>
</QFormActions>
```

## Alignment

- **end** (default) — Cancel, then Save, on the right. Edit screens and dialogs.
- **between** — a destructive action on the left (`danger-outline` Delete product), Cancel and Save on the right. Wrap the right-hand pair in a `<div>` and give it `display: flex` and a `space-2` gap yourself; FormActions only stacks it on small widths.
- **start** — a single action on the left under a short top-labelled form: newsletter sign-up, login.

```vue
<QFormActions align="between">
  <QButton variant="danger-outline">Delete product</QButton>
  <div class="end">
    <QButton>Cancel</QButton>
    <QButton variant="primary" type="submit">Save</QButton>
  </div>
</QFormActions>

<style scoped>
.end {
  display: flex;
  gap: var(--space-2);
}
</style>
```

## Sticky

`sticky` keeps the bar at the bottom of the scroll area on a `surface` background with a `line` rule above — long back-office edit screens, so Save is always in reach.

- **Edge to edge:** the bar has a negative side margin of `space-4` (16px) and `space-4` padding, so its background and rule reach the edges of a parent with `space-4` side padding. In a parent with other padding, the bar falls short of or overhangs the edges.
- **Keep it to Cancel and Save.** A sticky bar is always on screen, so it holds the actions you need all the time. Put Delete at the end of the form in its own non-sticky FormActions (`align="start"`), away from Save.
- **Focus stays visible:** while the bar is sticky, its height (plus 8px) becomes the bottom scroll padding of the page, or of the scrolling box it's in, so the browser scrolls a focused field clear of the bar.

## Small widths

When the row is narrower than 480px (it measures its own width, not the screen's), the buttons stack full width with the primary on top, ready for a thumb. A sticky bar is the exception: it stays one row high, with its buttons sharing the width and the primary on the right, so it takes about 72px of the screen rather than a stack. In the storefront checkout use `size="large"` buttons.

## Keyboard and screen readers

FormActions adds no roles or keys of its own. Tab follows the source order — secondary first, primary last — also when the stacked layout shows the primary on top. Give the submit button `type="submit"`, so Enter in a field submits the form.

## What you provide

The Buttons, primary last; the submit button gets `type="submit"`.

- **Optional:** `align` (`end` | `start` | `between`, default `end`), `sticky`.
- **Slots:** the default slot (the Buttons, primary last; with `align="between"`, the right-hand ones wrapped in a `<div>`).
