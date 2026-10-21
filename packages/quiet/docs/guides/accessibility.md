# Accessibility

Quiet's components meet WCAG 2.2 AA in both themes and both densities, and are tested with axe and by keyboard in Chromium, Firefox and WebKit. A page built from them is only as accessible as the parts your app adds, though. This guide says which part is whose.

## What the components do

- **Keyboard:** everything that works with a pointer works with the keyboard, in the order it appears, with a visible focus ring. Menus, comboboxes, tabs, galleries and tables use the keys people expect (arrows, Home, End, Escape, Enter).
- **Focus:** a Dialog keeps focus inside and gives it back when it closes. When a control that had focus goes away (a toast closes, a bulk bar hides, a row is removed), focus moves somewhere sensible instead of dropping to the page.
- **Names and roles:** icon-only buttons have names, groups are named by their labels, and controls say whether they're required, invalid or expanded.
- **Announcements:** results that appear without a page load, such as "16 results", "Discount SAVE10 applied" or "8 characters left", are read out by screen readers through live regions.
- **Forms:** labels, hints and messages are linked to their controls, and the error summary takes focus after a failed submit. See [Forms](forms.md).
- **Contrast and size:** text, icons and borders meet contrast in both themes, targets are at least 24px (and 48px for storefront actions), and layouts work at 320px wide and at 200% zoom.
- **Motion:** animations are short, and turned off for people who ask for reduced motion.

## What your app does

### The page

- **`lang`** on `<html>`, matching the shop's language, so screen readers pronounce it right.
- **A title for every screen**: `document.title` such as "Orders · My shop". In a single-page app, set it on every route change.
- **One `h1`**: `QPage`'s `title` is the screen's `h1`. Headings below it go down one level at a time; components with headings (Card, FormSection, Review) take a `headingLevel` to fit in.
- **Landmarks**: `QAppShell` gives you the navigation, the main area and a skip link. A storefront with its own header needs its own `<header>`, `<nav>`, `<main>` and skip link.

### Moving between screens

A page load tells screen readers where they are; a client-side route change doesn't. After each change, move focus to the new screen's `h1` (give it `tabindex="-1"`), or to the `main` element. The `QAppShell`'s `main` already has `tabindex="-1"`.

### Content

- **Image text**: every `{ src, alt }` needs an `alt` that says what matters: "Linen shirt in navy, front". Images next to a label that already names the item (search suggestions, tiles) are decorative, and Quiet leaves their `alt` out.
- **Link and button text** that makes sense on its own: "Edit Linen shirt", not "Edit" ten times. Many components take a label for this (Table's `rowLabel`, ProductCard's name).
- **Messages that say how to fix things**: "Enter a price, like 49,90", not "Invalid".
- **Colour never alone**: status badges carry a word. Do the same in your own UI.

### Your own changes

- **Brand colours** need the contrast described in [Theming](theming.md).
- **Don't remove focus rings** or `outline` styles, and don't put `tabindex` above 0.
- **Toasts** are for confirming what just happened. Anything people must read or answer goes on the page or in a Dialog: a toast disappears, and some people never see it.
- **Your own controls** in a Field get their label and messages through `controlAttrs` or `useFieldControl()`.

## Development warnings

Some mistakes are caught while you develop, through Vue's `warn`: a control, table or dialog without a name, an icon-only button without an `aria-label`, a radio outside a RadioGroup, a ProductCard without an `href`, and others. They name the component they came from. Fix them before you ship: each one means someone can't use that part of the page.

## Testing your app

- **Keyboard only**: put the mouse away and do the main tasks (find a product, check out, edit a product). Watch where focus goes after each action.
- **A screen reader**: VoiceOver (macOS, iOS), NVDA (Windows) or TalkBack (Android), on the same tasks.
- **Zoom to 200%** and narrow the window to 320px: nothing should be cut off or need sideways scrolling, except tables and code.
- **axe** in your end-to-end tests (`@axe-core/playwright`) catches missing names, contrast and wrong roles on every screen you test.
