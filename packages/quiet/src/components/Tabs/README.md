# Tabs

Switches between views of one thing without leaving the page: an order's details and its timeline, the sections of a long settings form, saved filters over one table, or a period switch on a chart.

## When to use

- **Tabs:** a few views of the same object or list, where people move back and forth. Up to about 6 labels of one or two words.
- **Not Tabs:** steps people must do in order (use Steps), content to read top to bottom (use headings or Disclosures), or moving between pages of the app (use Nav — or the link mode below for a row of sub-pages).

## Variants

- **line** (default) — tabs on a `line` rule. The chosen tab has `ink` text and a 2px `brand` bar; the others are `ink-muted`, and hovering shows a `line-strong` bar. For sections of a page.
- **segmented** — a `surface-sunken` track with the chosen tab raised on `surface-raised`. For switching how something is shown: Today | 7 days | 30 days, Grid | List. Usually `size="slim"`.

## Size

Tabs are as tall as a control (40px comfortable, 32px compact). `size="slim"` is 28px on desktop, like the other slim controls, and takes the density height again below 640px.

- **`fill`** shares the width equally — segmented controls on phones, two or three line tabs in a narrow card.

## Content

- **A panel per tab:** put each tab's panel in a `#panel-<value>` slot (`#panel-details`, `#panel-timeline`). All panels stay mounted (the hidden ones with `hidden`), so form fields keep what people typed when they switch.
- **One shared panel:** give no tab a `#panel-<value>` slot and put the content in the default slot. Use it for saved filters over one table ("All · Unfulfilled 8 · Unpaid 2"); every tab controls the same panel.
- **Counts:** `count` shows a pill after the label (numbers are locale-formatted); add `countLabel` ("8 to fulfil") and screen readers hear "Unfulfilled, 8 to fulfil" instead of "Unfulfilled 8".
- **Icons:** `icon` puts an icon before the label. Use it on every tab or none.
- **Disabled:** `disabled` dims a tab; it can't be chosen and the arrow keys skip it.
- **Links:** give tabs an `href` and the row becomes navigation between pages: a `nav` named by `label`, links with `aria-current="page"` on the current one, no tab roles and no panels; the default slot shows under the row. Each click emits `@navigate(tab, event)` for client-side routing. On a page that is none of the sections (a checkout, an order confirmation) pass `:model-value="null"`: no tab is underlined.

## With forms

- A tab whose panel holds an invalid field shows a `danger` dot, and screen readers hear "has errors". It follows the form as people fix things.
- The Form error summary opens the right tab before it focuses the field.
- Put one Form around the Tabs and keep FormActions outside them, so one Save covers every tab.

## Keyboard and screen readers

- Tab moves into the row once (to the chosen tab) and then into the panel.
- Left / Right move along the tabs and choose as they go; Home / End jump to the ends; disabled tabs are skipped.
- `activation="manual"`: arrows only move focus, Enter or Space chooses — for panels that are slow to show.
- The row is a `tablist` named by `label`; each tab has `aria-selected` and `aria-controls`; each panel is a `tabpanel` labelled by its tab, and a Tab stop of its own unless `:panel-focusable="false"` (set that when the panel starts with a focusable control).
- Icons and the error dot are hidden from screen readers; the error is read as ", has errors" after the tab's name (`strings.hasErrors`).
- Link tabs are ordinary links: each is a Tab stop, and the arrow keys do nothing special.

## Small widths

The row never wraps. When the tabs don't fit, it scrolls sideways (touch or arrow keys), the cut-off edge fades out, and the chosen tab is scrolled into view. Labels never truncate.

## Focus

Tabs show focus as a 2px `brand` ring inside the tab, because the row can scroll and would clip a ring outside.

## What you provide

- **Required:** `label` (names the row: "Order"), `tabs` (`{ value, label, icon?, count?, countLabel?, href?, disabled? }`; `null` and `false` entries are skipped).
- **Optional:** `defaultValue` (the first tab when you don't use `v-model`), `variant` (`line` | `segmented`, default `line`), `fill`, `size` (`default` | `slim`, default `default`), `activation` (`auto` | `manual`, default `auto`), `panelFocusable` (default `true`).
- **v-model:** `v-model` (the chosen tab's `value`; with link tabs, `null` for none).
- **Events:** `@navigate(tab, event)` when a link tab is clicked.
- **Slots:** `#panel-<value>` (each tab's panel), the default slot (one shared panel, or content under a row of link tabs).
- **Translations:** `strings` — `hasErrors` ("has errors"). Or set it once with `configure({ strings: { tabs: { hasErrors: 'enthält Fehler' } } })`.
