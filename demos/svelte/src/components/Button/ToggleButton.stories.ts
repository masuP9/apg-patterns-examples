// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from "@storybook/svelte-vite";

import ToggleButton from "./ToggleButton.svelte";

const meta = {
  title: "APG/ToggleButton",
  component: ToggleButton,
} satisfies Meta<typeof ToggleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "🌙 Dark Mode" },
};
