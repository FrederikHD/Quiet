# DiscountCode

A field for a discount or gift code, with Apply, and the codes that are in use as removable tags. In the checkout's order summary and in the cart.

```vue
<QDiscountCode
  collapsible
  :applied="codes.map((code) => ({ code, label: '−10 %' }))"
  :apply="async (code) => { const r = await api.check(code); if (!r.ok) return r.message; codes.push(code); }"
  @remove="(code) => (codes = codes.filter((c) => c !== code))"
/>
```

## Behaviour

- `collapsible` starts as a quiet "Add a discount code" button with a tag icon; it opens the field and puts the cursor in it.
- **Apply** (or Enter in the field) calls your `apply(code)` function. Return nothing if it worked, or the message to show ("“SUMMR” isn't a valid code") — directly or from a promise; Apply shows its spinner while it waits.
- A rejected code shows the message under the field in `danger` and keeps the text so it can be corrected. An accepted one clears the field and is announced ("Discount LINEN10 applied").
- Applied codes are Tags: tag icon, the code, what it does ("−10 %"), × — the whole tag is the button, named with all of its text ("Remove discount LINEN10 −10 %"). After removing, focus goes back to the field.
- It is **not a form** of its own: it usually sits inside the checkout's form, so Enter applies the code instead of submitting the page.
- Empty field + Apply: "Enter a discount code". A code that's already applied is quietly ignored.

## Keyboard and screen readers

An ordinary labelled field and button. Enter in the field applies the code. A rejected code is read as an error on the field; an accepted one is announced ("Discount LINEN10 applied"). Applied codes are buttons named "Remove discount LINEN10 −10 %" (their visible text is part of the name); after removing one, focus returns to the field.

## Built from

Input, Button and Tag (one per applied code), with the Field label and message styles.

## What you provide

The check and the effect on the totals — this only collects codes. Show the discount as its own row in OrderSummary.
