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
- `image` / `swatch` — a 32px thumbnail (`{ src }`) or colour swatch.
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
- Failed — "Couldn't load the results." in `danger` with a Try again button; pressing it moves focus back to the search field.

Translate every phrase with `strings` (German: "Zeige 50 von 1.240. Für mehr Ergebnisse suchen.", "Keine Treffer für „xyz“", "Suche läuft …", "Erneut versuchen", "Fertig", "Entfernen: …"). Or set it once for the whole shop with `configure({ strings: { combobox: { … } } })`.

## Keyboard and screen readers

- The closed box is a button named by its label and current value ("Product, Linen shirt, blue, M"); with `multiple`, "3 selected: …".
- The closed box opens with Enter, Space, ↓ or ↑ — or by typing, which opens it and starts the search with that letter. A box partly out of view scrolls into view first. If the page scrolls it away while the list is open, the list closes and focus goes back to the box.
- Opening moves focus to the search field. ↑ ↓ move through the options (disabled ones are skipped; they wrap at the ends), Enter chooses, Escape closes and returns focus to the box. In the dropdown, Tab closes it and moves on to the next field; in the phone Dialog, Tab moves to Done.
- Single: choosing closes the panel. Multiple: the panel stays open so people can pick several; Escape, a click outside, Tab (in the dropdown) or Done (in the phone Dialog) closes it.
- Inside a Dialog, the first Escape closes the list and the second the dialog.
- The search field is a combobox with a listbox (`aria-activedescendant`), the standard pattern screen readers know; with `multiple` the listbox is multi-selectable. Chosen options are marked selected, disabled ones unavailable.
- The status line is a `role="status"` region and also describes the search field.
- With `multiple`, each Tag's × is a button named "Remove Linen shirt"; removing a tag returns focus to the box. "+3 more" is hidden from screen readers, which hear the full list on the box.
- `clearable` adds a × button named "Clear" after the box; it returns focus to the box.
- `required` is read out on the search field (`aria-required`). Read-only and disabled boxes are skipped by Tab and can't be opened.

## Other options

- `clearable` (single) — a × in the box to remove the choice, for optional fields.
- `name` — adds hidden inputs with the chosen values, for plain form posts.
- `size`, `invalid`, `disabled`, `readonly`, `prefixIcon` — as on Select. Use it inside Field for its label, hint and errors.
- `required` — read out on the search field. Use `required` on the Field for the marker.
- `id` — the id of the box's button; inside a Field the Field's id wins.
- The component ref exposes `focus()`, `open()` and `close()`.

## Built from

Input box and Select styles, Popover (Dialog on phones), Tag (variant field) for chosen options.

## What you provide

- **Required:** a label (via Field, or `aria-label`), and `options` or `search`.
- **Optional:** `placeholder` ("Choose a product", "Add products"), `searchPlaceholder` (default "Search"), `multiple`, `maxChips` (default 5), `clearable`, `debounce` (default 250), `limit` (default 50), `dialog` (`auto` | `always` | `never`; default `auto`), `size` (`slim` | `default` | `large`; default `default`), `invalid`, `disabled`, `readonly`, `required`, `prefixIcon`, `name`, `id`.
- **v-model:** `v-model` (the chosen option object, or an array of them with `multiple`).
- **Translations:** `strings` — `searchPlaceholder` ("Search"), `noResults(query)` ("No matches for “xyz”", or "Nothing to choose from" with no query), `showing(shown, total)` ("Showing 50 of 1,240. Type to search for more."), `results(count)` ("16 results"), `loading` ("Searching…"), `error` ("Couldn’t load the results."), `retry` ("Try again"), `done` ("Done"), `clear` ("Clear"), `remove(label)` ("Remove Linen shirt"), `more(count)` ("+3 more"), `selected(count)` ("3 selected"); or `configure({ strings: { combobox: { … } } })`.
