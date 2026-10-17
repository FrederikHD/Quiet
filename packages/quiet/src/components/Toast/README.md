# Toast

A short confirmation that something happened — "Product saved", "Archived 1 product" — shown at the top of the screen for a few seconds.

```ts
import { toast } from 'quiet';

toast('Product saved');
toast('Archived 1 product', { action: { label: 'Undo', onClick: restore } });
toast('Couldn’t save — check your connection and try again.', { tone: 'error' });
```

Call `toast()` from anywhere. A `QToaster` shows the toasts. AppShell includes one; other apps place `<QToaster />` once.

## When to use

- **Toast:** the result of an action people just took, when the page itself doesn't show it clearly (saved, deleted, sent).
- **Field and Form messages:** anything about what someone typed. Errors that block a save belong in the form, never only in a toast.
- **Dialog:** anything people must answer.
- Don't toast what is already visible. If a status badge just changed on the page, that's enough.

## Anatomy

- **Shape:** a bar in inverted colours (`ink` background, `surface` text), `radius-md`, at least 48px tall.
- **Position:** top centre, up to 480px wide — under the AppShell top bar on phones and clear of the notch. It drops in from above; the newest sits nearest the top, errors first. At most three show at once.
- **Message:** one short sentence, in the past tense, about what happened.
- **Action** (optional): one underlined word, usually "Undo".
- **Close:** a × button.
- **Tone:** `neutral` (default); `success` adds a check icon, `error` a warning icon.
- **Stacking:** at most three at once, newest at the top; errors above the rest.

## Timing

- Toasts close themselves after 5 seconds, or 8 with an action or as an error.
- They pause while the pointer is over them or one has focus.
- `duration: 0` keeps a toast until it's dismissed. Use it for errors people must read.
- `toast.dismiss(id)` closes one early.

## Keyboard and screen readers

- **No focus moves:** a toast never takes focus, so people can keep working.
- **Announcements:** toasts are read out politely, in a `status` region; errors are read immediately, in an `alert` region. Both regions exist before the first toast, so it's announced too.
- **Inside dialogs:** a dialog leaves the toaster reachable, so a toast shown while a dialog is open is still read.
- **Undo by keyboard:** Tab reaches the action and the close button.

## Writing it

- Say what happened, in a few words: "Product saved", "Order #10530 fulfilled".
- No "Success!", no exclamation marks.
- Errors say how to fix it: "Couldn’t save — check your connection and try again."

## What you provide

- `toast(message, { tone, action: { label, onClick }, duration })`, which returns an id.
- One `<QToaster />`, unless AppShell already provides it. Translate its labels with `strings` or `configure({ strings: { toast: { dismiss, region } } })`.
