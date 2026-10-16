# Badge

A status pill for orders, payments, fulfilment and stock: "Paid", "Unfulfilled", "Out of stock".

## Anatomy

- **Shape:** a pill (`radius-full`), padded `space-1` × `space-2`.
- **Text:** `label` type, 13/16 medium.
- **Colour:** the tone's tint background with its strong colour for the text.
- **Icon** (optional): a 14px icon before the word.
- **Long text** ends in an ellipsis.

## Tones

One mapping, used everywhere:

| Tone | Use for |
| --- | --- |
| `success` | Paid, Fulfilled, Delivered, In stock, Active |
| `warning` | Pending, Unfulfilled, Low stock, Partially refunded |
| `info` | Processing, Shipped, In transit, Pre-order |
| `danger` | Payment failed, Cancelled, Out of stock |
| `neutral` (default) | Draft, Archived, Refunded |
| `sale` | The storefront Sale tag: white on `sale` |

## Rules

- Always a word. The colour repeats the meaning but never carries it alone.
- One badge per fact. An order with a payment status and a fulfilment status shows two badges, in two columns.
- A badge is not a button and is not clickable. To filter by a status, use the table's filter.
- Keep the wording to one or two words.

## What you provide

The text, plus an optional `tone` and `icon`.
