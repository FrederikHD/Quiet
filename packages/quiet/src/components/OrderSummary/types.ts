import type { ImageSource, ItemKey } from '../../types';

export interface OrderSummaryItem {
  /** Stable key for the line. */
  id?: ItemKey;
  /** The product name. */
  name: string;
  /** "Navy · M" */
  variant?: string;
  /** Default 1; shown on the image from 2 up. */
  quantity?: number;
  /** The line's total (unit price × quantity). */
  price: number;
  /** The line's original total; above price it shows as a sale. */
  compareAt?: number;
  /** The product image; a placeholder shows without one. */
  image?: ImageSource;
  /** Links the name to the product page. */
  href?: string;
}
export interface OrderSummaryRow {
  /** "Shipping", "Discount". */
  label: string;
  /** A small addition after the label: the discount code, "2–3 days". */
  detail?: string;
  /** Negative for discounts (shown as −8,30 € in success), 0 shows "Free", null/undefined shows `note`. */
  amount?: number | null;
  /** Shown while amount is null: "Calculated at the next step". Default "—". */
  note?: string;
  /** false: show 0 as an amount instead of "Free". */
  free?: boolean;
}
export interface OrderSummaryStrings {
  title?: string;
  show?: string;
  hide?: string;
  subtotal?: string;
  total?: string;
  free?: string;
  quantity?: (n: number) => string;
  items?: (n: number) => string;
}
