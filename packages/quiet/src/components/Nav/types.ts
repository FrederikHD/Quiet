import type { IconName } from '../Icon/icons';

export interface NavItem {
  label: string;
  href?: string;
  /** Top-level items only. */
  icon?: IconName;
  /** The page being shown: highlighted, aria-current="page". */
  current?: boolean;
  /** A count of work waiting (orders to fulfil). */
  badge?: string | number;
  /** What the count means, for screen readers: "12 to fulfil". */
  badgeLabel?: string;
  /** Sub-pages, shown while this item or one of them is current. */
  items?: NavItem[];
  /** Force the sub-pages open or closed. */
  expanded?: boolean;
  key?: string;
}
export interface NavSection {
  title?: string;
  items: NavItem[];
}
