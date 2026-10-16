import type { App, Component, Plugin } from 'vue';
import { configure, type ConfigureOptions } from './config';
import * as components from './components';

export type QuietPluginOptions = ConfigureOptions & {
  /** Register every component globally (default true). Set false to import them where you use them. */
  components?: boolean;
};

/** app.use(Quiet, { locale: 'de-DE', strings: { … } }): configures Quiet and registers every Q component. */
export const Quiet: Plugin<[QuietPluginOptions?]> = {
  install(app: App, options: QuietPluginOptions = {}) {
    const { components: register = true, ...config } = options;
    configure(config);
    if (!register) return;
    for (const [name, component] of Object.entries(components)) {
      if (/^Q[A-Z]/.test(name)) app.component(name, component as Component);
    }
  },
};
