import type { Meta, StoryObj } from "@storybook/react-vite";
import ToggleButton from "./ToggleButton";

const meta: Meta<typeof ToggleButton> = {
  title: "APG/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs"],
  argTypes: {
    initialPressed: {
      control: "boolean",
      description: "Initial pressed state of the toggle button",
    },
    onToggle: {
      action: "toggled",
      description: "Callback function called when the button is toggled",
    },
    children: {
      control: "text",
      description: "Button content",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "🌙 Dark Mode",
  },
};

export const Disabled: Story = {
  args: {
    children: "🌙 Dark Mode",
    disabled: true,
  },
};
