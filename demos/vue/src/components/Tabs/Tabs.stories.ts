import type { Meta, StoryObj } from "@storybook/vue3";
import Tabs from "./Tabs.vue";

const meta: Meta<typeof Tabs> = {
  title: "APG/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Orientation of the tabs",
    },
    activation: {
      control: "select",
      options: ["auto", "manual"],
      description:
        "Activation mode - auto activates on focus, manual requires enter/space",
    },
    defaultSelectedId: {
      control: "text",
      description: "ID of the initially selected tab",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTabs = [
  {
    id: "tab1",
    label: "First Tab",
    content:
      "This is the content for the first tab. It demonstrates the basic tab functionality.",
  },
  {
    id: "tab2",
    label: "Second Tab",
    content:
      "This is the content for the second tab. Users can navigate using arrow keys.",
  },
  {
    id: "tab3",
    label: "Third Tab",
    content:
      "This is the content for the third tab. The component follows WAI-ARIA guidelines.",
  },
];

export const Default: Story = {
  args: {
    tabs: sampleTabs,
    defaultSelectedId: "tab1",
    orientation: "horizontal",
    activation: "automatic",
  },
};

export const Vertical: Story = {
  args: {
    tabs: sampleTabs.slice(0, 2),
    defaultSelectedId: "tab1",
    orientation: "vertical",
    activation: "automatic",
  },
};

export const ManualActivation: Story = {
  args: {
    tabs: sampleTabs,
    defaultSelectedId: "tab1",
    orientation: "horizontal",
    activation: "manual",
  },
};
