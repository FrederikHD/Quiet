// Quiet's buttons, cards and breadcrumbs with an href stay real links (open in a new tab works); a plain click
// navigates in the app instead of loading the page again.
export function useInAppLink() {
  const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '');
  return (href: string) => (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    void navigateTo(href.startsWith(base) ? href.slice(base.length) || '/' : href);
  };
}
