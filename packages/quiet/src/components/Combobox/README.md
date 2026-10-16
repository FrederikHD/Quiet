# Combobox

Picks one or several values from a list people search — products, customers, countries, tax rates — with a search field, rich options and a status line that says whether the list is complete.

## When to use

- **Combobox** — the list is long (more than about 15), people know what they're looking for and would rather type than scroll, or the list lives on the server and is fetched as they type. Also whenever people pick **several** values.
- **Select** — a short, known list (4–15) with no need to search; it uses the phone's own picker.
- **RadioGroup** — 2–5 options people should compare before choosing; all of them stay visible.

## Anatomy

Closed, it looks exactly like Select: the Input box, the value (or the `placeholder` in `ink-muted`) and a `chevron-down`. With `multiple`, chosen values appear as Tags (`variant="field"`) inside the box, each with a remove ×, up to `maxChips` (default 5) and then "+3 more"; the box grows to fit them.

Open, a panel the width of the field sits under it: a search field on top, the list, and a status line at the bottom. It opens on whichever side has room and never runs off the screen — when space is short the list gets shorter and scrolls. On screens under 640px it opens in a Dialog instead — a floating card over the dimmed page — with the field's label and a Done button at the top, so the keyboard never covers the results and nothing outside needs scrolling. `dialog="always"` uses the Dialog on every screen; `dialog="never"` keeps the dropdown.

## Options

`{ value, label, description?, meta?, image?, swatch?, disabled? }`:

- `label` — the name: "Linen shirt, blue, M".
- `description` — one line in `ink-muted` under it: SKU and stock, a customer's email.
- `meta` — right-aligned, tabular, medium weight in `ink` (the same as `meta` on Checkbox and Radio): price, tax rate, order count.
- `image` / `swatch` — a 32px thumbnail (URL) or colour swatch.
- `disabled` — shown in `ink-muted` and can't be chosen: out of stock, already in the collection. Say why in the `description`.

The value is the option object (or an array of them with `multiple`), so the chosen labels stay visible even when they're not in the current search results.

## Static or fetched

- **Static** — pass `options`. The search filters as people type, ignoring case and accents ("rhon" finds "Rhön"; it also matches `description` and an optional `keywords` string). The first `limit` (default 50) matches show.
- **Fetched** — pass `search(query, { signal })` returning `{ options, total }` (or just an array). It's called when the panel opens (empty query) and 250ms after typing stops (`debounce`). Older requests are aborted and their answers ignored, so fast typing never shows stale results. Return at most `limit` options and the real `total`.

## Status line

Always visible under the list, and read out by screen readers as it changes:

- More results than shown — "Showing 50 of 1,240. Type to search for more."
- All results shown — "16 results".
- Nothing found — "No matches for “xyz”".
- Waiting — "Searching…" with a spinner; the previous results stay, dimmed.
- Failed — "Couldn't load the results." in `danger` with a Try again button.

Translate every phrase with `strings` (German: "Zeige 50 von 1.240. Für mehr Ergebnisse suchen.", "Keine Treffer für „xyz“", "Suche läuft …", "Erneut versuchen", "Fertig", "Entfernen: …"). Or set it once for the whole shop with `configure` (see Conventions in the brand book).

## Keyboard and screen readers

- The closed box is a button named by its label and current value ("Product, Linen shirt, blue, M"); with `multiple`, "3 selected: …".
- The closed box opens with Enter, Space, ↓ or ↑ — or by typing, which opens it and starts the search with that letter.
- Opening moves focus to the search field. ↑ ↓ move through the options (disabled ones are skipped), Enter chooses, Escape closes and returns focus to the box, Tab moves on to the next field.
- Single: choosing closes the panel. Multiple: the panel stays open so people can pick several; Escape, Done, a click outside or Tab closes it.
- Inside a Dialog, the first Escape closes the list and the second the dialog.
- The field is a combobox with a listbox (`aria-activedescendant`), the standard pattern screen readers know.

## Other options

- `clearable` (single) — a × in the box to remove the choice, for optional fields.
- `name` — adds hidden inputs with the chosen values, for plain form posts.
- `size`, `invalid`, `disabled`, `readonly`, `prefix-icon` — as on Select. Use it inside Field for its label, hint and errors.

## Built from

Input box and Select styles, Popover (Dialog on phones), Tag (variant field) for chosen options.

## What you provide

The label (via Field), `options` or `search`, `v-model`, a `placeholder` ("Choose a product", "Add products"), `searchPlaceholder` ("Search products"), and translated `strings` for non-English shops.
