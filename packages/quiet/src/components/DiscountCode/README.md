# DiscountCode

A field for a discount or gift code, with Apply, and the codes that are in use as removable tags. In the checkout's order summary and in the cart.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { AppliedCode } from '@frederikhd/quiet';

const codes = ref<AppliedCode[]>([]);
async function apply(code: string) {
  const r = await api.checkCode(code); // your shop's check
  if (!r.ok) return r.message; // shown under the field
  codes.value.push({ code, label: r.label }); // "−10 %"
}
function remove(code: string) {
  codes.value = codes.value.filter((c) => c.code !== code);
}
</script>

<template>
  <QDiscountCode collapsible :applied="codes" :apply="apply" @remove="remove" />
</template>
```

## Behaviour

- `collapsible` starts as a quiet "Add a discount code" button with a tag icon; it opens the field and puts the cursor in it. While codes are applied the field stays open.
- **Apply** (or Enter in the field) calls your `apply(code)` function. Return nothing if it worked, or the message to show ("“SUMMR” isn't a valid code") — directly or from a promise; Apply shows its spinner while it waits and keeps focus, ignoring presses. A rejected promise shows its error's message.
- A rejected code shows the message under the field in `danger`, keeps the text so it can be corrected, and puts focus back in the field. Typing clears the message. An accepted one clears the field, puts focus back in it, and is announced with the code as it appears in `applied` ("Discount LINEN10 applied", whatever case was typed).
- Applied codes are Tags: tag icon, the code, what it does ("−10 %"), × — the whole tag is the button, named with all of its text ("Remove discount LINEN10 −10 %"). Pressing it emits `@remove`; you take the code out of `applied`. Focus goes back to the field, and "Discount LINEN10 removed" is announced.
- It is **not a form** of its own: it usually sits inside the checkout's form, so Enter applies the code instead of submitting the page.
- Empty field + Apply: "Enter a discount code", and focus goes to the field. A code that's already applied is quietly ignored.

## Keyboard and screen readers

- An ordinary labelled field ("Discount code") and an Apply button. Enter in the field applies the code; it never submits the surrounding form.
- A rejected code: the field is marked invalid, the message is tied to it as its description and announced from a polite live region ("Error: …"), and focus returns to the field.
- An accepted or removed code is announced from a polite live region: "Discount LINEN10 applied", "Discount LINEN10 removed".
- Applied codes are buttons named "Remove discount LINEN10 −10 %" (their visible text is part of the name); after removing one, focus returns to the field.
- The code field takes no Field wiring from a Field around it: DiscountCode has its own label and message.

## Built from

Input, Button and Tag (one per applied code), with the Field label and message styles.

## What you provide

The check and the effect on the totals — this only collects codes. Show the discount as its own row in OrderSummary.

- **Required:** `apply(code)` (returns nothing when it worked, or the message why not, directly or from a promise).
- **Optional:** `applied` (`{ code, label? }[]`, default none), `collapsible`, `label` (default "Discount code"), `id` (on the code field; generated when missing), `disabled`.
- **Events:** `@remove(code)` when an applied code's tag is pressed.
- **Translations:** `strings`, or once with `configure({ strings: { discount: … } })` — `label` ("Discount code"), `apply` ("Apply"), `reveal` ("Add a discount code"), `empty` ("Enter a discount code"), `remove(code)` ("Remove discount LINEN10"), `applied(code)` ("Discount LINEN10 applied"), `removed(code)` ("Discount LINEN10 removed"). The "Error:" prefix comes from `configure({ strings: { form: … } })`.
