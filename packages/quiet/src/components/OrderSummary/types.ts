export interface OrderSummaryItem {
  id?: string;
  name: string;
  /** "Navy · M" */
  variant?: string;
  quantity?: number;
  /** The line's total (unit price × quantity). */
  price: number;
  compareAt?: number;
  image?: { src: string; alt?: string };
  href?: string;
}
export interface OrderSummaryRow {
  label: string;
  /** A small addition after the label: the discount code, "2–3 days". */
  detail?: string;
  /** Negative for discounts (shown as −8,30 € in success), 0 shows "Free", null/undefined shows `note`. */
  amount?: number | null;
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
