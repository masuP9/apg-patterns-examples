import type { Preview } from "@storybook/react";
import React from "react";
import "tailwindcss/tailwind.css";
import "../src/styles/index.css"; // Tailwind CSS
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
    (Story) => (
      <div style={{ padding: "2rem" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
