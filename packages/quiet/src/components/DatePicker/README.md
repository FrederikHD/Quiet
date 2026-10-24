# DatePicker

A date field: people type a date in the shop's format or pick one from a calendar. Use it instead of `<QInput type="date">`, whose popup looks different in every browser, can't be translated or styled, and shows the browser's language rather than the shop's.

## Anatomy

An Input holding the date as the shop's locale writes it ("24.10.2026" in German, "24/10/2026" in British English, "10/24/2026" in American English) and a calendar button at its end. The button opens a calendar under the field, aligned to its end: the month with buttons for the previous and next one, the weekdays, and the days. Today has a thin outline; the chosen day is filled in `brand`.

## Value

- `v-model` holds an ISO date, `"2026-10-24"`, or `null`. No time and no time zone: the 24th is the 24th everywhere.
- Typed text becomes the value when the field loses focus or on Enter. It accepts the locale's order with any separator ("24.10.2026", "24-10-26", "24102026") and ISO ("2026-10-24"), then shows the date in the locale's format.
- Text that isn't a date that can be chosen stays in the field for people to fix, the value is `null`, and `@invalid-text` gives the text and why: `format` (not a date), `range` (before `min` or after `max`) or `unavailable` (ruled out by `isDateDisabled`). Put your message in the Field's `error`.
- `name` submits the ISO date with a native `<form>`.

## Limits

- `min` and `max` (ISO dates) bound what can be chosen; the calendar doesn't go past their months.
- `isDateDisabled(date)` rules out single days: Sundays, holidays, sold-out delivery slots. They stay in the calendar, struck through, and can't be chosen.
- Say the rule in the Field's `hint` ("We deliver Monday to Saturday"): a struck-through day alone doesn't say why.

## Locale

- The format, the month and weekday names and the first day of the week (Monday in Germany, Sunday in the US) follow `configure({ locale })`.
- The placeholder shows the format, built from `strings.day`, `month` and `year` in the locale's order: "DD/MM/YYYY", "TT.MM.JJJJ" in German.
- Translate the button and the month buttons with `strings`, or once for the shop with `configure({ strings: { datePicker } })`.

## States

Sizes, invalid, read-only and disabled look like Input. A read-only DatePicker has no calendar button; a disabled one has a disabled button. `clearable` adds the Input's clear button.

## Keyboard and screen readers

- The field is a text input named by its Field. Alt+↓ opens the calendar. The calendar button ("Choose date") is the next tab stop.
- The calendar is a dialog named "Choose date". Focus goes to the chosen day, or today. Tab moves between the month buttons and the days.
- In the days (a grid): ←/→ a day, ↑/↓ a week, Home/End the start and end of the week, Page Up/Page Down a month, Shift+Page Up/Page Down a year. Enter or Space chooses the day and closes the calendar. Escape closes it without choosing. Focus returns to the calendar button.
- Each day is read with its full date ("Saturday, 24 October 2026"), today as the current date, the chosen day as selected, and ruled-out days as unavailable. The month and year are announced as they change.
- Typing in the field closes the calendar.

## What you provide

- A label: the Field component.
- **Optional:** `min`, `max`, `isDateDisabled`, `size` (`slim` | `default` | `large`), `clearable`, `invalid`, `disabled`, `readonly`, `required`, `id`, `name`, `strings`. Other attributes (`placeholder`, `autocomplete`, `inputmode` — `numeric` by default, so phones show digits) go to the native input.
- **v-model:** the ISO date or `null`.
- **Events:** `@invalid-text(text, reason)`.
- **Translations:** `strings` — `choose` ("Choose date"), `previousMonth` ("Previous month"), `nextMonth` ("Next month"), and the placeholder's parts `day` ("DD"), `month` ("MM"), `year` ("YYYY"); or `configure({ strings: { datePicker: { … } } })`. Month and weekday names come from the locale.
