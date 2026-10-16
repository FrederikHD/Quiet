// Stand-in product photos for the examples, drawn as small SVGs so the explorer needs no image files.

export const COLOURS: Record<string, [hue: number, sat: number, light: number]> = {
  Navy: [222, 32, 34],
  Sand: [38, 32, 62],
  Olive: [78, 28, 46],
  Rust: [16, 45, 50],
  Natural: [45, 12, 80],
  Sage: [120, 18, 58],
  Blue: [210, 38, 48],
};

/** The colour as a CSS swatch. */
export function swatchOf(name: string): string {
  const [h, s, l] = COLOURS[name] ?? [0, 0, 60];
  return `hsl(${h} ${s}% ${l}%)`;
}

/** A garment in a colour: view 0 front, 1 back, 2 folded. */
export function photo(name: string, view = 0): string {
  const [hue, sat, light] = COLOURS[name] ?? [0, 0, 60];
  const bg = `hsl(${hue} ${Math.round(sat * 0.5)}% ${Math.min(light + 30, 94)}%)`;
  const fg = `hsl(${hue} ${sat}% ${light}%)`;
  const shirt = `<path d="M110 60l40 20 40-20 40 34-20 28-14-10v108H104V112l-14 10-20-28z" fill="${fg}"/>`;
  const body =
    view === 1
      ? `${shirt}<path d="M150 80v148" stroke="rgba(0,0,0,.18)" stroke-width="2"/>`
      : view === 2
        ? `<rect x="70" y="70" width="160" height="160" rx="12" fill="${fg}"/><path d="M70 120h160M70 170h160" stroke="rgba(255,255,255,.25)" stroke-width="3"/>`
        : `${shirt}<circle cx="150" cy="104" r="3" fill="rgba(0,0,0,.25)"/><circle cx="150" cy="134" r="3" fill="rgba(0,0,0,.25)"/><circle cx="150" cy="164" r="3" fill="rgba(0,0,0,.25)"/>`;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 375"><rect width="300" height="375" fill="${bg}"/><g transform="translate(0 42)">${body}</g></svg>`)}`;
}

/** A small square picture in a hue (file previews, thumbnails). */
export function tile(hue: number): string {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="hsl(${hue} 30% 62%)"/><path d="M12 30l6-14 4 6 3-4 5 12z" fill="hsl(${hue} 30% 82%)"/></svg>`)}`;
}
