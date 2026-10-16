/// <reference types="vite/client" />

declare module 'virtual:quiet-meta' {
  import type { ComponentDoc } from '../plugins/quiet-meta';
  const docs: Record<string, ComponentDoc>;
  export default docs;
}
