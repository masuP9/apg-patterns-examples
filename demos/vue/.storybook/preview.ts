import type { Preview } from "@storybook/vue3";
import "../../shared/styles/base.css"; // APG共通スタイル

const preview: Preview = {
  parameters: {
    layout: "centered",
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      template: '<div style="padding: 2rem;"><story /></div>',
    }),
  ],
};

export default preview;
