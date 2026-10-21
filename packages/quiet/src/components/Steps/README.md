# Steps

Shows where someone is in a short flow that has to be done in order — checkout: Address → Shipping → Payment. Above the page title.

```vue
<QSteps
  :current="1"
  :steps="[
    { label: 'Address', href: '#checkout/address' },
    { label: 'Shipping', href: '#checkout/shipping' },
    { label: 'Payment', href: '#checkout/payment' },
  ]"
/>
```

## Behaviour

- **Done** steps show a check on `brand-tint` and lead back: a link with `href`, or a button that emits `@select(index, event)` when you listen to it; with neither they stay plain text, never a dead button. Screen readers hear "Address (completed)".
- The **current** step is filled `brand`, its label semibold, `aria-current="step"`.
- **Later** steps are plain text in `ink-muted` — people can't skip ahead, so they aren't links.
- A thin line joins the steps; it turns `brand` behind finished ones.
- Markers are 24px circles; steps are at least 32px tall.
- **Narrow** (under 520px of its own width): only the current step keeps its label; the others are numbered or checked circles (32px targets), still links where they were, and their labels are still read. A "Step 2 of 3" counter (`strings.step`) shows under the row; screen readers skip it.
- It's a `nav` landmark named "Checkout steps" (`strings.label`).
- `current` is clamped to the steps there are; `null` and `false` steps are skipped.

## Use it for

Three to five steps that build on each other. Keep the labels to one word. Decide in your app which steps are reachable, and send people back to the first unfinished one if they open a later URL directly.

## Not for

- Sections people can visit in any order — use Tabs.
- Progress of a task that runs by itself (an upload) — show a percentage or a message instead.

## Keyboard and screen readers

- A `nav` named "Checkout steps" with an ordered list; the current step has `aria-current="step"`.
- Finished steps are read as "Address (completed)" and are ordinary links or buttons: Tab reaches them, Enter follows them. The current and later steps are plain text, not Tab stops.
- The markers (numbers and checks) are hidden from screen readers.
- After `@select`, the chosen step becomes current and its button turns into plain text, so focus would be lost. Move focus yourself to that step's heading or first field.

## Built from

Icon (the check).

## What you provide

- **Required:** `steps` (`{ label, href?, key? }`), `current` (the index of the current step, from 0).
- **Events:** `@select(index, event)` when a finished step is chosen. Finished steps without `href` become buttons only while you listen to it.
- **Translations:** `strings` — `label` ("Checkout steps"), `done` ("completed"), `step` (`(i, n) => "Step i of n"`, the narrow counter). Or set them once with `configure({ strings: { steps: … } })`.
