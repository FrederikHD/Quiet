export interface TableColumn<Row = Record<string, unknown>> {
  /** Field name in the row; also the sort key and the slot name (#cell-<key>, #header-<key>). */
  key: string;
  /** Header text. */
  header: string;
  /** Plain text for the cell, when it isn't row[key] as is: (row) => money(row.total). Rich cells use #cell-<key>. */
  format?: (row: Row, index: number) => string;
  /** Right-aligned, tabular figures; sorts high to low first. */
  numeric?: boolean;
  /** Cell and header alignment. Default start (numeric columns: end). */
  align?: 'start' | 'end' | 'center';
  /** The header becomes a sort button. */
  sortable?: boolean;
  /** The value to sort by; default row[key]. */
  sortValue?: (row: Row) => string | number | Date | null | undefined;
  /** The direction of the first click; default desc for numeric columns, asc for the rest. */
  sortFirst?: 'asc' | 'desc';
  /** Phone sort menu wording: [ascending, descending], e.g. ['Oldest first', 'Newest first']. */
  sortLabels?: [string, string];
  /** The column that names the row (row header, link target). Default: the first column. */
  primary?: boolean;
  /** One line with an ellipsis: true (18rem) or a CSS length. */
  truncate?: boolean | string;
  /** Let long text wrap (min 12rem). */
  wrap?: boolean;
  /** Column width, as a CSS length. */
  width?: string;
  /** Minimum column width, as a CSS length: 'min(11rem, 40cqi)' for long names in a pinned column. */
  minWidth?: string;
  /** false: hide this column in phone cards. */
  mobile?: boolean;
}

export interface TableSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface TableStrings {
  selectAll?: string;
  selectAllShort?: string;
  selectRow?: (label: string) => string;
  selected?: (count: number) => string;
  selectAllMatching?: (total: number) => string;
  allMatchingSelected?: (total: number) => string;
  clearSelection?: string;
  actions?: string;
  empty?: string;
  loading?: string;
  sortBy?: string;
  sortOption?: (header: string, direction: 'asc' | 'desc') => string;
}

export type RowKey = string | number;

/** Empty values last; dates and numbers by value; text naturally ("Item 2" before "Item 10"). */
export function compareValues(a: unknown, b: unknown): number {
  const an = a == null || a === '';
  const bn = b == null || b === '';
  if (an || bn) return an && bn ? 0 : an ? 1 : -1;
  const av = a instanceof Date ? a.getTime() : a;
  const bv = b instanceof Date ? b.getTime() : b;
  if (typeof av === 'number' && typeof bv === 'number') return av - bv;
  return String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });
}
