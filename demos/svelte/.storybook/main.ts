import type { StorybookConfig } from "@storybook/svelte-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/svelte-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
