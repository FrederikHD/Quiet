/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set by the Pages workflow: which of the two published explorers this build is. Unset in development. */
  readonly VITE_EXPLORER_CHANNEL?: 'release' | 'next';
}

declare module 'virtual:quiet-meta' {
  import type { ComponentDoc } from '../plugins/quiet-meta';
  const docs: Record<string, ComponentDoc>;
  export default docs;
}
