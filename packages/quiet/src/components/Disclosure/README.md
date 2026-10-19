# Disclosure

A heading that opens and closes what's under it. Filter groups in the shop, product details and care, FAQs, rarely used sections of a back-office form.

```vue
<QDisclosure title="Colour" meta="Navy, Sand" default-open>
  <QCheckboxGroup v-model="colours" label="Colour" label-hidden layout="swatches">…</QCheckboxGroup>
</QDisclosure>
```

## Behaviour

- The whole row is one button (`aria-expanded`), inside a heading (`headingLevel`, default 3), so the page outline still lists it. `:heading-level="null"` drops the heading, for a Disclosure that isn't a section (a filter group inside a form).
- Title in 15px semibold (`title`, or the `#title` slot); `meta` beside it in 13px `ink-muted` (or the `#meta` slot) — what's chosen or a count, so a closed group still says what it holds. A long meta is cut off with an ellipsis. The chevron turns when open.
- A `line` divider under each (`:divider="false"` removes it); stack several and they form an accordion. Each opens on its own — opening one never closes another.
- The content stacks with `--field-gap` between its direct children, like a Card body, so several fields or paragraphs need no wrapper.
- Starts closed. `defaultOpen` opens it on first render; `v-model:open` controls it.
- Closed content is `hidden` (not in the tab order, not read). Printing opens everything.
- At least as tall as a control (40px comfortable, 32px compact), 48px on phones.

## Not for

- Switching between views of the same thing — use Tabs.
- Content most people need — don't hide it. Shipping costs and returns stay visible on a product page; care instructions can fold.

## Keyboard and screen readers

- The button says whether it's open (`aria-expanded`) and which panel it controls (`aria-controls`). Its name is the title plus the meta. The chevron is hidden from screen readers.
- Enter or Space toggles it; focus stays on the button. Closed content leaves the tab order and isn't read.
- `region` makes the open panel a `role="region"` named by the button, so people can jump to it. Use it for long content only; a page full of regions is noise.

## Built from

Icon (the chevron).

## What you provide

- **Optional:** `title` ("Colour"), `meta` ("Navy, Sand"), `defaultOpen`, `headingLevel` (2–6 or `null`, default 3), `region`, `divider` (default `true`).
- **v-model:** `v-model:open` (open or not).
- **Slots:** the default slot (what opens and closes), `#title` and `#meta` (instead of the props).
