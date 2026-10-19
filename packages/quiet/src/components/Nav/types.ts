import type { IconName } from '../Icon/icons';

export interface NavItem {
  /** The page's name. */
  label: string;
  /** Where it goes. Without href the item is a button; handle it with Nav's `navigate` event. */
  href?: string;
  /** An icon name; shown on top-level items only. */
  icon?: IconName;
  /** The page being shown: highlighted, aria-current="page". */
  current?: boolean;
  /** A count of work waiting (orders to fulfil). */
  badge?: string | number;
  /** What the count means, for screen readers: "12 to fulfil". */
  badgeLabel?: string;
  /** Sub-pages, shown while this item or one of them is current. */
  items?: NavItem[];
  /** Force the sub-pages open (true) or closed (false); by default they show while this item or one of them is current. */
  expanded?: boolean;
  /** Stable key for the list (default: href, else the index). Handy to tell items apart in `navigate`. */
  key?: string;
}
export interface NavSection {
  /** Heads the section ("Shop") and names its group for screen readers. */
  title?: string;
  /** The section's links. */
  items: NavItem[];
}
