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

- **Done** steps show a check on `brand-tint` and are links back (with `href`, or buttons emitting `select` when you listen to it; with neither they stay plain text); screen readers hear "Address (completed)".
- The **current** step is filled `brand`, its label semibold, `aria-current="step"`.
- **Later** steps are plain text in `ink-muted` — people can't skip ahead, so they aren't links.
- A thin line joins the steps; it turns `brand` behind finished ones.
- **Narrow** (under 520px of its own width): only the current step keeps its label; the others are numbered or checked circles (32px targets), still links where they were.
- It's a `nav` landmark named "Checkout steps" (`strings.label`).

## Use it for

Three to five steps that build on each other. Keep the labels to one word.

## Not for

- Sections people can visit in any order — use Tabs.
- Progress of a task that runs by itself (an upload) — show a percentage or a message instead.

## Keyboard and screen readers

A `nav` named "Checkout steps"; the current step has `aria-current="step"`, finished ones are read as "Address (completed)" and are ordinary links or buttons.

## Built from

Icon (the check).

## What you provide

`steps`: `{ label, href? }`; `current`: the index of the current step. Decide in your app which steps are reachable and send people back to the first unfinished one if they open a later URL directly.
