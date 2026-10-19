import { enableAutoUnmount, mount } from '@vue/test-utils';
import { QTable, configure, type TableColumn } from '@frederikhd/quiet';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';

enableAutoUnmount(afterEach);
beforeAll(() => configure({ locale: 'en-US' }));

interface Order {
  id: number;
  customer: string;
  total: number | null;
}
const rows: Order[] = [
  { id: 3, customer: 'Mia', total: 20 },
  { id: 1, customer: 'anna', total: null },
  { id: 2, customer: 'Ben', total: 99.5 },
];
const columns: TableColumn<Order>[] = [
  { key: 'id', header: 'Order', sortable: true, format: (o) => `#${o.id}` },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'total', header: 'Total', numeric: true, sortable: true },
];

function table(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(QTable, { props: { caption: 'Orders', columns, rows, ...props } as never, slots: slots as never, attachTo: document.body });
}
const bodyText = (w: ReturnType<typeof table>) => w.findAll('tbody tr').map((r) => r.get('th').text());

describe('QTable', () => {
  it('renders a captioned table with explicit roles and a row header per row', () => {
    const w = table();
    const t = w.get('table.q-table__table');
    expect(t.attributes('role')).toBe('table');
    const cap = w.get('caption');
    expect(cap.text()).toBe('Orders');
    expect(t.attributes('aria-labelledby')).toBe(cap.attributes('id'));
    expect(w.findAll('thead th[role="columnheader"]').map((c) => c.text())).toEqual(['Order', 'Customer', 'Total']);
    const first = w.get('tbody tr');
    expect(first.attributes('role')).toBe('row');
    expect(first.get('th').attributes('role')).toBe('rowheader');
    expect(first.get('th').attributes('scope')).toBe('row');
    expect(bodyText(w)).toEqual(['#3', '#1', '#2']);
    expect(first.findAll('td')[1].classes()).toEqual(expect.arrayContaining(['is-end', 'is-numeric']));
    expect(first.findAll('td')[0].attributes('data-label')).toBe('Customer');
  });

  it('hides the caption visually with captionHidden and takes a caption slot', () => {
    const w = table({ captionHidden: true }, { caption: () => h('strong', 'Open orders') });
    expect(w.get('caption').classes()).toContain('q-visually-hidden');
    expect(w.get('caption strong').text()).toBe('Open orders');
  });

  it('sorts by a header click, reverses on the second, and sets aria-sort', async () => {
    const w = table();
    const btn = () => w.findAll('.q-table__sort')[1];
    await btn().trigger('click');
    expect(w.emitted('update:sort')![0]).toEqual([{ key: 'customer', direction: 'asc' }]);
    expect(bodyText(w)).toEqual(['#1', '#2', '#3']);
    expect(w.findAll('thead th')[1].attributes('aria-sort')).toBe('ascending');
    await btn().trigger('click');
    expect(w.findAll('thead th')[1].attributes('aria-sort')).toBe('descending');
    expect(bodyText(w)).toEqual(['#3', '#2', '#1']);
  });

  it('sorts numbers high to low first and keeps empty values last', async () => {
    const w = table();
    await w.findAll('.q-table__sort')[2].trigger('click');
    expect(bodyText(w)).toEqual(['#2', '#3', '#1']);
    await w.findAll('.q-table__sort')[2].trigger('click');
    expect(bodyText(w)).toEqual(['#3', '#2', '#1']);
  });

  it('starts from defaultSort, and only shows the sort with manualSort', () => {
    expect(bodyText(table({ defaultSort: { key: 'id', direction: 'asc' } }))).toEqual(['#1', '#2', '#3']);
    const m = table({ sort: { key: 'id', direction: 'asc' }, manualSort: true });
    expect(bodyText(m)).toEqual(['#3', '#1', '#2']);
    expect(m.findAll('thead th')[0].attributes('aria-sort')).toBe('ascending');
  });

  it('selects rows with named checkboxes and announces the count', async () => {
    const w = table({ selectable: true, rowLabel: (o: Order) => `order #${o.id}` });
    const boxes = w.findAll('tbody input[type="checkbox"]');
    expect(w.get(`label[for="${boxes[0].attributes('id')}"], tbody tr .q-choice`).text()).toContain('Select order #3');
    await boxes[0].setValue(true);
    expect(w.emitted('update:selected')!.at(-1)).toEqual([[3]]);
    expect(w.get('tbody tr').classes()).toContain('is-selected');
    expect(w.get('.q-table__bulk-count').text()).toBe('1 selected');
    expect(w.get('[role="status"]').text()).toBe('1 selected');
    const all = w.get('thead input[type="checkbox"]');
    expect((all.element as HTMLInputElement).indeterminate).toBe(true);
    await all.setValue(true);
    expect(w.emitted('update:selected')!.at(-1)).toEqual([[3, 1, 2]]);
    await w.findAll('.q-table__bulk button').at(-1)!.trigger('click');
    expect(w.emitted('update:selected')!.at(-1)).toEqual([[]]);
    expect(w.find('.q-table__bulk').exists()).toBe(false);
  });

  it('starts from defaultSelected and disables rows that cannot be picked', () => {
    const w = table({ selectable: true, defaultSelected: [2], isRowSelectable: (o: Order) => o.id !== 1 });
    const boxes = w.findAll<HTMLInputElement>('tbody input[type="checkbox"]');
    expect(boxes.map((b) => b.element.checked)).toEqual([false, false, true]);
    expect(boxes[1].element.disabled).toBe(true);
  });

  it('offers "Select all" across pages and passes allMatching to the bulk actions', async () => {
    const bulk = vi.fn(() => 'Export');
    const w = table({ selectable: true, selected: [3, 1, 2], totalCount: 1240 }, { 'bulk-actions': bulk });
    const more = w.get('.q-table__bulk-all');
    expect(more.text()).toBe('Select all 1,240');
    await more.trigger('click');
    expect(w.emitted('update:allMatching')![0]).toEqual([true]);
    expect(w.get('.q-table__bulk-count').text()).toBe('All 1,240 selected');
    expect(bulk).toHaveBeenLastCalledWith(expect.objectContaining({ allMatching: true, selected: [3, 1, 2] }));
  });

  it('makes the primary column a link and follows a click anywhere on the row', async () => {
    const onRowClick = vi.fn((_r: Order, e: MouseEvent) => e.preventDefault());
    const w = table({ rowHref: (o: Order) => `#o${o.id}`, onRowClick });
    const link = w.get('tbody tr th a.q-table__link');
    expect(link.attributes('href')).toBe('#o3');
    expect(w.get('tbody tr').classes()).toContain('is-clickable');
    await w.findAll('tbody tr')[1].findAll('td')[0].trigger('click');
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0][0]).toEqual(rows[1]);
  });

  it('uses a button when only onRowClick is given, and ignores clicks on controls', async () => {
    const onRowClick = vi.fn();
    const w = table({ onRowClick, selectable: true });
    expect(w.get('tbody th button.q-table__link').attributes('type')).toBe('button');
    await w.get('tbody tr input[type="checkbox"]').trigger('click');
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('renders rich cells, headers and row actions from slots', () => {
    const w = table(
      {},
      {
        'cell-customer': ({ row }: { row: Order }) => h('b', row.customer.toUpperCase()),
        'header-total': () => h('i', 'Sum'),
        'row-actions': ({ row }: { row: Order }) => h('button', { 'aria-label': `Edit #${row.id}` }),
      },
    );
    expect(w.get('tbody tr td b').text()).toBe('MIA');
    expect(w.get('thead .q-table__sort i').text()).toBe('Sum');
    expect(w.get('thead th.q-table__actions').text()).toBe('Actions');
    expect(w.get('tbody tr td.q-table__actions button').attributes('aria-label')).toBe('Edit #3');
  });

  it('shows skeleton rows while loading and the empty slot without rows', () => {
    const l = table({ rows: [], loading: true, skeletonRows: 3 });
    expect(l.findAll('.q-table__row--skeleton')).toHaveLength(3);
    expect(l.get('table').attributes('aria-busy')).toBe('true');
    expect(l.get('.q-table__row--skeleton').attributes('aria-hidden')).toBe('true');
    const e = table({ rows: [] }, { empty: 'No orders match' });
    expect(e.get('.q-table__empty').text()).toBe('No orders match');
    expect(e.get('.q-table__empty').attributes('colspan')).toBe('3');
    expect(table({ rows: [] }).get('.q-table__empty').text()).toBe('No results');
  });

  it('pins the first column in scroll mode and shows a select-all and sort bar in cards mode', async () => {
    expect(table().get('tbody th').classes()).toContain('is-pinned');
    expect(table({ pinFirst: false }).get('tbody th').classes()).not.toContain('is-pinned');
    const c = table({ mobile: 'cards', selectable: true });
    expect(c.classes()).toContain('q-table--cards');
    const bar = c.get('.q-table__mobilebar');
    expect(bar.text()).toContain('Select all');
    const sel = bar.get('select');
    expect(sel.attributes('aria-label')).toBe('Sort by');
    await sel.setValue('total:desc');
    expect(c.emitted('update:sort')!.at(-1)).toEqual([{ key: 'total', direction: 'desc' }]);
  });

  it('applies density, maxHeight, toolbar and footer', () => {
    const w = table({ density: 'compact', maxHeight: 300 }, { toolbar: 'Search', footer: 'Pages' });
    expect(w.attributes('data-density')).toBe('compact');
    expect(w.get('.q-table__scroll').attributes('style')).toContain('max-height: 300px');
    expect(w.get('.q-table__toolbar').text()).toBe('Search');
    expect(w.get('.q-table__footer').text()).toBe('Pages');
  });

  it('takes translations', () => {
    const w = table({ selectable: true, selected: [1], strings: { selected: (n: number) => `${n} ausgewählt` } });
    expect(w.get('.q-table__bulk-count').text()).toBe('1 ausgewählt');
  });
});
