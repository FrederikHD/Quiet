import { QTable } from 'quiet';
import { defineStory } from './story';

export default defineStory({
  component: QTable,
  name: 'QTable',
  props: {
    caption: 'Orders',
    rowKey: 'id',
    selectable: true,
    columns: [
      { key: 'id', header: 'Order', sortable: true },
      { key: 'customer', header: 'Customer', sortable: true },
      { key: 'status', header: 'Status' },
      { key: 'total', header: 'Total', numeric: true, sortable: true },
    ],
    rows: [
      { id: '#10500', customer: 'Anna Schmidt', status: 'Unfulfilled', total: 19.9 },
      { id: '#10499', customer: 'Noah Koch', status: 'Unfulfilled', total: 57.03 },
      { id: '#10498', customer: 'Lea Fischer', status: 'Shipped', total: 94.16 },
      { id: '#10497', customer: 'Ben Klein', status: 'Fulfilled', total: 131.29 },
    ],
  },
  model: { prop: 'selected', value: [] },
  hide: ['totalCount'],
  layout: 'block',
});
