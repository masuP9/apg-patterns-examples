/// <reference types="astro/client" />

declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
  const component: AstroComponentFactory;
  export default component;
}

declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    /** @see https://open-ui.org/components/focusgroup.explainer/ */
    focusgroup?: string;
  }
}
