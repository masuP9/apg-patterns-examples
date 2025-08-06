import type { Meta, StoryObj } from "@storybook/vue3";
import ToggleButton from "./ToggleButton.vue";

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
      action: "toggle",
      description: "Event emitted when the button is toggled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialPressed: false,
    "aria-label": "Default toggle button",
  },
  render: (args) => ({
    components: { ToggleButton },
    setup() {
      return { args };
    },
    template: '<ToggleButton v-bind="args">Toggle Button</ToggleButton>',
  }),
};

export const EmailNotifications: Story = {
  args: {
    initialPressed: false,
    "aria-label": "Toggle email notifications",
  },
  render: (args) => ({
    components: { ToggleButton },
    setup() {
      return { args };
    },
    template:
      '<ToggleButton v-bind="args">📧 Email Notifications</ToggleButton>',
  }),
};

export const DarkMode: Story = {
  args: {
    initialPressed: false,
    "aria-label": "Toggle dark mode",
  },
  render: (args) => ({
    components: { ToggleButton },
    setup() {
      return { args };
    },
    template: '<ToggleButton v-bind="args">🌙 Dark Mode</ToggleButton>',
  }),
};

export const InitiallyPressed: Story = {
  args: {
    initialPressed: true,
    "aria-label": "Toggle that starts in pressed state",
  },
  render: (args) => ({
    components: { ToggleButton },
    setup() {
      return { args };
    },
    template: '<ToggleButton v-bind="args">Initially On</ToggleButton>',
  }),
};
