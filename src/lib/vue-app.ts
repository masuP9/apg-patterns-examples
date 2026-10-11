import type { App } from 'vue';

// @astrojs/vue gives every server-rendered island its own idPrefix ("s0", "s1", ...),
// but client:only islands get none, so useId() returns "v-0" in each of them and
// ids collide across the page (issue #253). Give those apps a page-unique prefix.
// Remove this once @astrojs/vue sets idPrefix for client:only islands itself
// (checked against @astrojs/vue 7.0.0, dist/client.js).
let clientOnlyAppCount = 0;

export default (app: App) => {
  app.config.idPrefix ??= `c${clientOnlyAppCount++}`;
};
