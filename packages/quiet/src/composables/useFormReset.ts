import { onBeforeUnmount, onMounted, type Ref } from 'vue';

/**
 * Calls onReset after the element's <form> is reset. The native values are back to their defaults by then,
 * so uncontrolled components can follow them.
 */
export function useFormReset(el: Ref<HTMLElement | null | undefined>, onReset: () => void): void {
  let form: HTMLFormElement | null = null;
  const handle = () => setTimeout(onReset, 0);
  onMounted(() => {
    const node = el.value as (HTMLElement & { form?: HTMLFormElement | null }) | null | undefined;
    form = node?.form ?? node?.closest?.('form') ?? null;
    form?.addEventListener('reset', handle);
  });
  onBeforeUnmount(() => form?.removeEventListener('reset', handle));
}
