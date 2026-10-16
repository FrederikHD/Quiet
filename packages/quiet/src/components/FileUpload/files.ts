/** 2.4 MB, 340 KB. */
export function formatSize(bytes: number): string {
  return bytes >= 1048576
    ? `${(bytes / 1048576).toFixed(bytes >= 10485760 ? 0 : 1).replace('.0', '')} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Whether a file fits an accept list like ".pdf,application/pdf" or "image/*". */
export function fileMatches(file: File, accept: string | undefined): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || '').toLowerCase();
  return accept.split(',').some((raw) => {
    const a = raw.trim().toLowerCase();
    if (!a) return false;
    if (a.startsWith('.')) return name.endsWith(a);
    if (a.endsWith('/*')) return type.startsWith(a.slice(0, -1));
    return type === a;
  });
}
