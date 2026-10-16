# FormActions

The row of buttons that ends a form: secondary actions first, the primary action last.

## Alignment

- **end** (default) — Cancel, then Save, on the right. Edit screens and dialogs.
- **between** — a destructive action on the left (`danger-outline` Delete product), Cancel and Save on the right. Wrap the right-hand pair in a `<div>` with a `space-2` gap.
- **start** — a single action on the left under a short top-labelled form: newsletter sign-up, login.

## Sticky

`sticky` keeps the bar at the bottom of the scroll area on a `surface` background with a `line` rule above — long back-office edit screens, so Save is always in reach.

- **Keep it to Cancel and Save.** A sticky bar is always on screen, so it holds the actions you need all the time. Put Delete at the end of the form in its own non-sticky FormActions (`align="start"`), away from Save.
- **Focus stays visible:** the page scrolls a focused field clear of the bar.

## Small widths

Below 480px the buttons stack full width with the primary on top, ready for a thumb. A sticky bar is the exception: it stays one row high, with its buttons sharing the width and the primary on the right, so it takes 72px of the screen rather than a stack. In the storefront checkout use `size="large"` buttons.

## What you provide

The Buttons, primary last; the submit button gets `type="submit"`.
