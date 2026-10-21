// toast('Product saved') from anywhere; a Toaster (AppShell has one) shows it top-centre.
import { reactive, type InjectionKey } from 'vue';

export interface ToastAction {
  /** The button's text, usually "Undo". */
  label: string;
  /** Runs when it's pressed; the toast then closes. */
  onClick: () => void;
}
export interface ToastOptions {
  /** neutral (default), success (check icon), error (announced immediately). */
  tone?: 'neutral' | 'success' | 'error';
  /** One action, usually Undo. */
  action?: ToastAction;
  /** Milliseconds. Default 5000; 8000 with an action or as an error; 0 = until dismissed. */
  duration?: number;
}
export interface ToastItem {
  id: number;
  message: string;
  tone: 'neutral' | 'success' | 'error';
  action?: ToastAction;
  duration: number;
}

export const toastState = reactive({ list: [] as ToastItem[] });
let seq = 0;

/** Shows a toast and returns its id. Needs one Toaster on the page (AppShell has one). At most three show at once. */
export function toast(message: string, options: ToastOptions = {}): number {
  const id = ++seq;
  const tone: ToastItem['tone'] = options.tone === 'error' || options.tone === 'success' ? options.tone : 'neutral';
  const duration = options.duration ?? (options.action || tone === 'error' ? 8000 : 5000);
  toastState.list = [...toastState.list, { id, message, tone, action: options.action, duration }].slice(-3);
  return id;
}

/** Removes a toast early. */
export function dismissToast(id: number): void {
  toastState.list = toastState.list.filter((t) => t.id !== id);
}
toast.dismiss = dismissToast;

/** From the Toaster to its toasts: call before a toast goes, so focus inside it isn't dropped on the page. */
export const toastHandBackKey: InjectionKey<(toastEl: HTMLElement) => void> = Symbol('quiet-toast-hand-back');
