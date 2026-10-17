// The template for what the playground shows, so it can be copied into an app.
import type { Story } from '../stories/story';

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function literal(v: unknown): string {
  if (typeof v === 'function') return '…';
  return JSON.stringify(v, null, 0)
    .replace(/"([A-Za-z_$][\w$]*)":/g, '$1: ')
    .replace(/"/g, "'")
    .replace(/,(?=[{[\w'])/g, ', ');
}

function attr(name: string, value: unknown): string | null {
  const k = kebab(name);
  if (value === undefined || value === false) return null;
  if (value === null) return `:${k}="null"`;
  if (value === true) return k;
  if (typeof value === 'string') return `${k}="${value.replace(/"/g, '&quot;')}"`;
  if (typeof value === 'function') return `:${k}="${name}"`;
  return `:${k}="${literal(value)}"`;
}

export function templateFor(story: Story, props: Record<string, unknown>, defaults: Record<string, unknown>, slotText: Record<string, string>): string {
  const attrs: string[] = [];
  if (story.model) attrs.push(story.model.prop && story.model.prop !== 'modelValue' ? `v-model:${kebab(story.model.prop)}="${story.model.prop}"` : 'v-model="value"');
  for (const [k, v] of Object.entries(props)) {
    if (k === story.model?.prop || (story.model && !story.model.prop && k === 'modelValue')) continue;
    if (JSON.stringify(v) === JSON.stringify(defaults[k])) continue;
    const a = attr(k, v);
    if (a) attrs.push(a);
  }
  const named = Object.entries(slotText).filter(([n, t]) => n !== 'default' && t);
  const inner = [
    ...(slotText.default ? [slotText.default] : []),
    ...named.map(([n, t]) => `<template #${n}>${t}</template>`),
  ];
  const open = attrs.length > 2 || attrs.join(' ').length > 60 ? `<${story.name}\n  ${attrs.join('\n  ')}\n` : `<${story.name}${attrs.length ? ' ' + attrs.join(' ') : ''}`;
  let code = inner.length ? `${open}>${inner.length > 1 || open.includes('\n') ? `\n  ${inner.join('\n  ')}\n` : inner[0]}</${story.name}>` : `${open}${open.endsWith('\n') ? '' : ' '}/>`;
  if (story.field) code = `<QField label="${story.field.label}"${story.field.hint ? ` hint="${story.field.hint}"` : ''}>\n  ${code.replace(/\n/g, '\n  ')}\n</QField>`;
  return code;
}
