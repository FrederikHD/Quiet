/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set by the Pages workflow: which of the two published explorers this build is. Unset in development. */
  readonly VITE_EXPLORER_CHANNEL?: 'release' | 'next';
  /** Set by the Pages workflow: the latest release's version (from its git tag), "0.4.0". */
  readonly VITE_RELEASED_VERSION?: string;
}

declare module 'virtual:quiet-meta' {
  import type { ComponentDoc } from '../plugins/quiet-meta';
  const docs: Record<string, ComponentDoc>;
  export default docs;
}
