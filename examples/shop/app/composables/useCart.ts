// The cart: shared across pages with useState, kept in this browser with localStorage. The server always renders an
// empty cart; the saved one is read after the page has hydrated, so the two never disagree.
import { productBySlug } from '~/data/products';

export interface CartLine {
  slug: string;
  colour: string;
  size: string;
  quantity: number;
}

const KEY = 'quiet-example-cart';

export function useCart() {
  const lines = useState<CartLine[]>('cart', () => []);
  const loaded = useState('cart-loaded', () => false);

  onMounted(() => {
    if (loaded.value) return;
    loaded.value = true;
    try {
      lines.value = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    } catch {
      /* private mode or a broken entry: start empty */
    }
    // Detached: it keeps saving after the page that started it is left.
    effectScope(true).run(() =>
      watch(
        lines,
        (l) => {
          try {
            localStorage.setItem(KEY, JSON.stringify(l));
          } catch {
            /* nothing to keep it in */
          }
        },
        { deep: true },
      ),
    );
  });

  const count = computed(() => lines.value.reduce((n, l) => n + l.quantity, 0));
  const subtotal = computed(() =>
    lines.value.reduce((n, l) => n + (productBySlug(l.slug)?.price ?? 0) * l.quantity, 0),
  );

  function add(line: CartLine) {
    const same = lines.value.find((l) => l.slug === line.slug && l.colour === line.colour && l.size === line.size);
    if (same) same.quantity += line.quantity;
    else lines.value.push({ ...line });
  }
  function clear() {
    lines.value = [];
  }

  return { lines, count, subtotal, add, clear };
}
