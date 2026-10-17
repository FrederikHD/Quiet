# Disclosure

A heading that opens and closes what's under it. Filter groups in the shop, product details and care, FAQs, rarely used sections of a back-office form.

```vue
<QDisclosure title="Colour" meta="Navy, Sand" default-open>
  <QCheckboxGroup v-model="colours" label="Colour" label-hidden layout="swatches">…</QCheckboxGroup>
</QDisclosure>
```

## Behaviour

- The whole row is one button (`aria-expanded`), inside a heading (`headingLevel`, default 3), so the page outline still lists it.
- Title in label weight; `meta` beside it in `ink-muted` — what's chosen or a count, so a closed group still says what it holds. The chevron turns when open.
- A `line` divider under each; stack several and they form an accordion. Each opens on its own — opening one never closes another.
- The content stacks with `--field-gap` between its direct children, like a Card body, so several fields or paragraphs need no wrapper.
- Closed content is `hidden` (not in the tab order, not read). Printing opens everything.
- 40px tall, 48px on phones.

## Not for

- Switching between views of the same thing — use Tabs.
- Content most people need — don't hide it. Shipping costs and returns stay visible on a product page; care instructions can fold.

## Keyboard and screen readers

The button says whether it's open (`aria-expanded`) and which panel it controls. Enter or Space toggles it; closed content leaves the tab order.

## Built from

Icon (the chevron).

## What you provide

A `title`, the content, and `meta` when the closed group should still say what it holds.
