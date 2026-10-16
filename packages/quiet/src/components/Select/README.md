# Select

Picks one value from a short, known list — a native `<select>` in the Input's box, so phones show their own picker and keyboards, screen readers and autofill work as people expect.

## When to use

- **Select** — one choice from about 4 to 15 options that people recognise: order status, shipping method, sort order, country in a short list, size.
- **RadioGroup** — 2 to 5 options that people should compare before choosing: delivery speed, payment method. Seeing them all at once beats opening a list.
- **Combobox** — long lists people search rather than scroll (all countries, products, customers), lists fetched from the server, or picking several values. A native select can't search.
- **Toggle buttons** (Button `pressed`) — switching a view, not entering a value: Grid / List.

## Anatomy

The Input box (`surface-raised`, `line-strong` border, `radius-md`) with an optional `prefix` icon, the value, and a `chevron-down` in `ink-muted` at the right. The whole box opens the list.

## Options

- Pass `options` as strings, `{ value, label, disabled }`, or groups `{ label, options }` — or `<option>` / `<optgroup>` in the default slot.
- Order options the way people look for them: by frequency for statuses, alphabetically for countries (with the 2–3 most common first in a group), by size order for S–XL — never by database id.
- Labels are short and parallel: "Newest first", "Price: low to high", "Price: high to low". A select can't wrap its text, so a long label gets cut off on a phone — keep labels to about 20 characters and put details (delivery times, conditions) in the Field's hint.
- In a connected FieldGroup the select's part is measured, so its longest option always fits beside the chevron; short labels ("DE +49", "per month") keep the other part roomy.

## Placeholder

- `placeholder` shows while nothing is chosen, in `ink-muted`: "Choose a country", "Select a size".
- On a **required** select the placeholder can't be picked again once something is chosen. On an **optional** select it stays as the "none" choice — label it that way: "No category".
- If there's a sensible default (the shop's own country, "Newest first"), preselect it and skip the placeholder.

## Size, density and states

Exactly as Input: `size="default"` follows `data-density` (40px comfortable, 32px compact), `slim` 28px for filter bars and table toolbars (back office, desktop), `large` 48px for the storefront (size and variant pickers on the product page). 16px text on phones. Focus thickens the border to 2px `brand` (`danger` while invalid). `invalid` gives the `danger` border; the message comes from Field. Disabled matches Input. `readOnly` (or Field's `readOnly`) shows the value like a read-only Input — `ink` on a `surface-sunken` box, no chevron — and keeps it in form posts; unlike a read-only Input it can't take focus, because a native select has no read-only mode. In a connected FieldGroup it joins like any Input: Amount | Currency.

## What you provide

- A label: wrap it in Field (preferred), or pass `id` + your own `<label for>`, or `aria-label` in a toolbar where the context names it. The component warns without one.
- `v-model`; `name`, `required`, `autocomplete` (`country`, `address-level1`…) as on a native select.
- The component ref exposes `focus()` and `select` (the `<select>`); `class` and `style` go on the outer box.
