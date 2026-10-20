import { Comment, Fragment, Text, isVNode, warn, type VNode, type VNodeArrayChildren } from 'vue';

export const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

/** Joins element ids for aria-describedby / aria-labelledby; undefined when there are none. */
export function joinIds(...ids: (string | false | null | undefined)[]): string | undefined {
  const out = ids.filter(Boolean) as string[];
  return out.length ? out.join(' ') : undefined;
}

const warned = new Set<string>();
/**
 * Warns once per key, in development only. Vue's own `warn` decides: it logs in Vue's development build and does
 * nothing in production, so the app's bundler settles it and Quiet itself never reads the environment.
 */
export function warnOnce(key: string, message: string): void {
  if (warned.has(key)) return;
  warned.add(key);
  warn(`[Quiet] ${message}`);
}

/** Focusable elements inside root that are actually shown. */
export function visibleFocusables(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
}

/** The plain text of slot content or a string — used to name things for screen readers ("Remove Navy"). */
export function textOf(content: unknown): string {
  if (content == null || typeof content === 'boolean') return '';
  if (typeof content === 'string' || typeof content === 'number') return String(content);
  if (Array.isArray(content)) return content.map(textOf).join('');
  if (typeof content === 'function') return textOf((content as () => unknown)());
  if (isVNode(content)) {
    const v = content as VNode;
    if (v.type === Comment) return '';
    if (v.type === Text) return String(v.children ?? '');
    if (v.type === Fragment) return textOf(v.children as VNodeArrayChildren);
    if (typeof v.children === 'string') return v.children;
    if (Array.isArray(v.children)) return textOf(v.children);
    if (v.children && typeof v.children === 'object' && 'default' in v.children) {
      return textOf((v.children as { default?: () => unknown }).default?.());
    }
    return '';
  }
  return '';
}

/** True when a slot renders something other than comments and whitespace. */
export function hasContent(nodes: VNode[] | undefined): boolean {
  if (!nodes) return false;
  return nodes.some((n) => {
    if (n.type === Comment) return false;
    if (n.type === Text) return String(n.children ?? '').trim() !== '';
    if (n.type === Fragment) return hasContent(n.children as VNode[]);
    return true;
  });
}

/** CSS length from a number (px) or a string. */
export function cssLength(v: number | string | undefined): string | undefined {
  return v == null ? undefined : typeof v === 'number' ? `${v}px` : v;
}

/** Ids from useId() are safe in selectors and #links already; this strips anything else just in case. */
export function safeId(id: string): string {
  return id.replace(/[^A-Za-z0-9_-]/g, '');
}

/** Slot content as a flat list of real nodes (fragments unwrapped, comments dropped). */
export function flattenNodes(nodes: VNode[] | undefined): VNode[] {
  const out: VNode[] = [];
  for (const n of nodes ?? []) {
    if (n.type === Comment) continue;
    if (n.type === Fragment) out.push(...flattenNodes(n.children as VNode[]));
    else if (n.type === Text && !String(n.children ?? '').trim()) continue;
    else out.push(n);
  }
  return out;
}
