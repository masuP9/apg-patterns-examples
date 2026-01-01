import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { h, ref } from "vue";
import Toolbar from "./Toolbar.vue";
import ToolbarButton from "./ToolbarButton.vue";
import ToolbarToggleButton from "./ToolbarToggleButton.vue";
import ToolbarSeparator from "./ToolbarSeparator.vue";

// ヘルパー: Toolbar と子コンポーネントをレンダリング
function renderToolbar(
  props: Record<string, unknown> = {},
  children: ReturnType<typeof h>[]
) {
  return render(Toolbar, {
    props,
    slots: {
      default: () => children,
    },
    global: {
      components: {
        ToolbarButton,
        ToolbarToggleButton,
        ToolbarSeparator,
      },
    },
  });
}

describe("Toolbar (Vue)", () => {
  // 🔴 High Priority: APG 準拠の核心
  describe("APG: ARIA 属性", () => {
    it('role="toolbar" が設定される', () => {
      renderToolbar(
        { "aria-label": "Test toolbar" },
        [h(ToolbarButton, null, () => "Button")]
      );
      expect(screen.getByRole("toolbar")).toBeInTheDocument();
    });

    it('aria-orientation がデフォルトで "horizontal"', () => {
      renderToolbar(
        { "aria-label": "Test toolbar" },
        [h(ToolbarButton, null, () => "Button")]
      );
      expect(screen.getByRole("toolbar")).toHaveAttribute(
        "aria-orientation",
        "horizontal"
      );
    });

    it('aria-orientation が orientation prop を反映する', () => {
      renderToolbar(
        { "aria-label": "Test toolbar", orientation: "vertical" },
        [h(ToolbarButton, null, () => "Button")]
      );
      expect(screen.getByRole("toolbar")).toHaveAttribute(
        "aria-orientation",
        "vertical"
      );
    });

    it("aria-label が透過される", () => {
      renderToolbar(
        { "aria-label": "Text formatting" },
        [h(ToolbarButton, null, () => "Button")]
      );
      expect(screen.getByRole("toolbar")).toHaveAttribute(
        "aria-label",
        "Text formatting"
      );
    });
  });

  describe("APG: キーボード操作 (Horizontal)", () => {
    it("ArrowRight で次のボタンにフォーカス移動", async () => {
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarButton, null, () => "First"),
        h(ToolbarButton, null, () => "Second"),
        h(ToolbarButton, null, () => "Third"),
      ]);

      const firstButton = screen.getByRole("button", { name: "First" });
      firstButton.focus();

      await user.keyboard("{ArrowRight}");

      expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
    });

    it("ArrowLeft で前のボタンにフォーカス移動", async () => {
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarButton, null, () => "First"),
        h(ToolbarButton, null, () => "Second"),
        h(ToolbarButton, null, () => "Third"),
      ]);

      const secondButton = screen.getByRole("button", { name: "Second" });
      secondButton.focus();

      await user.keyboard("{ArrowLeft}");

      expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    });

    it("ArrowRight で最後から先頭にラップしない（端で止まる）", async () => {
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarButton, null, () => "First"),
        h(ToolbarButton, null, () => "Second"),
        h(ToolbarButton, null, () => "Third"),
      ]);

      const thirdButton = screen.getByRole("button", { name: "Third" });
      thirdButton.focus();

      await user.keyboard("{ArrowRight}");

      expect(thirdButton).toHaveFocus();
    });

    it("ArrowLeft で先頭から最後にラップしない（端で止まる）", async () => {
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarButton, null, () => "First"),
        h(ToolbarButton, null, () => "Second"),
      ]);

      const firstButton = screen.getByRole("button", { name: "First" });
      firstButton.focus();

      await user.keyboard("{ArrowLeft}");

      expect(firstButton).toHaveFocus();
    });

    it("ArrowUp/Down は水平ツールバーでは無効", async () => {
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarButton, null, () => "First"),
        h(ToolbarButton, null, () => "Second"),
      ]);

      const firstButton = screen.getByRole("button", { name: "First" });
      firstButton.focus();

      await user.keyboard("{ArrowDown}");
      expect(firstButton).toHaveFocus();

      await user.keyboard("{ArrowUp}");
      expect(firstButton).toHaveFocus();
    });

    it("Home で最初のボタンにフォーカス移動", async () => {
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarButton, null, () => "First"),
        h(ToolbarButton, null, () => "Second"),
        h(ToolbarButton, null, () => "Third"),
      ]);

      const thirdButton = screen.getByRole("button", { name: "Third" });
      thirdButton.focus();

      await user.keyboard("{Home}");

      expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    });

    it("End で最後のボタンにフォーカス移動", async () => {
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarButton, null, () => "First"),
        h(ToolbarButton, null, () => "Second"),
        h(ToolbarButton, null, () => "Third"),
      ]);

      const firstButton = screen.getByRole("button", { name: "First" });
      firstButton.focus();

      await user.keyboard("{End}");

      expect(screen.getByRole("button", { name: "Third" })).toHaveFocus();
    });

    it("disabled アイテムをスキップして移動", async () => {
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarButton, null, () => "First"),
        h(ToolbarButton, { disabled: true }, () => "Second (disabled)"),
        h(ToolbarButton, null, () => "Third"),
      ]);

      const firstButton = screen.getByRole("button", { name: "First" });
      firstButton.focus();

      await user.keyboard("{ArrowRight}");

      expect(screen.getByRole("button", { name: "Third" })).toHaveFocus();
    });
  });

  describe("APG: キーボード操作 (Vertical)", () => {
    it("ArrowDown で次のボタンにフォーカス移動", async () => {
      const user = userEvent.setup();
      renderToolbar(
        { "aria-label": "Test toolbar", orientation: "vertical" },
        [
          h(ToolbarButton, null, () => "First"),
          h(ToolbarButton, null, () => "Second"),
          h(ToolbarButton, null, () => "Third"),
        ]
      );

      const firstButton = screen.getByRole("button", { name: "First" });
      firstButton.focus();

      await user.keyboard("{ArrowDown}");

      expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
    });

    it("ArrowUp で前のボタンにフォーカス移動", async () => {
      const user = userEvent.setup();
      renderToolbar(
        { "aria-label": "Test toolbar", orientation: "vertical" },
        [
          h(ToolbarButton, null, () => "First"),
          h(ToolbarButton, null, () => "Second"),
          h(ToolbarButton, null, () => "Third"),
        ]
      );

      const secondButton = screen.getByRole("button", { name: "Second" });
      secondButton.focus();

      await user.keyboard("{ArrowUp}");

      expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    });

    it("ArrowLeft/Right は垂直ツールバーでは無効", async () => {
      const user = userEvent.setup();
      renderToolbar(
        { "aria-label": "Test toolbar", orientation: "vertical" },
        [
          h(ToolbarButton, null, () => "First"),
          h(ToolbarButton, null, () => "Second"),
        ]
      );

      const firstButton = screen.getByRole("button", { name: "First" });
      firstButton.focus();

      await user.keyboard("{ArrowRight}");
      expect(firstButton).toHaveFocus();

      await user.keyboard("{ArrowLeft}");
      expect(firstButton).toHaveFocus();
    });
  });
});

describe("ToolbarButton (Vue)", () => {
  describe("ARIA 属性", () => {
    it('role="button" が暗黙的に設定される', () => {
      renderToolbar(
        { "aria-label": "Test toolbar" },
        [h(ToolbarButton, null, () => "Click me")]
      );
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it('type="button" が設定される', () => {
      renderToolbar(
        { "aria-label": "Test toolbar" },
        [h(ToolbarButton, null, () => "Click me")]
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
  });

  describe("機能", () => {
    it("クリックで click イベントが発火", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarButton, { onClick: handleClick }, () => "Click me"),
      ]);

      await user.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("disabled 時はフォーカス対象外（disabled属性で非フォーカス）", () => {
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarButton, { disabled: true }, () => "Click me"),
      ]);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });
});

describe("ToolbarToggleButton (Vue)", () => {
  describe("ARIA 属性", () => {
    it('role="button" が暗黙的に設定される', () => {
      renderToolbar(
        { "aria-label": "Test toolbar" },
        [h(ToolbarToggleButton, null, () => "Toggle")]
      );
      expect(screen.getByRole("button", { name: "Toggle" })).toBeInTheDocument();
    });

    it('type="button" が設定される', () => {
      renderToolbar(
        { "aria-label": "Test toolbar" },
        [h(ToolbarToggleButton, null, () => "Toggle")]
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it('aria-pressed="false" が初期状態で設定される', () => {
      renderToolbar(
        { "aria-label": "Test toolbar" },
        [h(ToolbarToggleButton, null, () => "Toggle")]
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    });

    it('aria-pressed="true" が押下状態で設定される', () => {
      renderToolbar(
        { "aria-label": "Test toolbar" },
        [h(ToolbarToggleButton, { defaultPressed: true }, () => "Toggle")]
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("機能", () => {
    it("クリックで aria-pressed がトグル", async () => {
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarToggleButton, null, () => "Toggle"),
      ]);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");

      await user.click(button);
      expect(button).toHaveAttribute("aria-pressed", "true");

      await user.click(button);
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it("Enter で aria-pressed がトグル", async () => {
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarToggleButton, null, () => "Toggle"),
      ]);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveAttribute("aria-pressed", "false");

      await user.keyboard("{Enter}");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("Space で aria-pressed がトグル", async () => {
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarToggleButton, null, () => "Toggle"),
      ]);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveAttribute("aria-pressed", "false");

      await user.keyboard(" ");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("pressed-change イベントが発火", async () => {
      const handlePressedChange = vi.fn();
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarToggleButton, { onPressedChange: handlePressedChange }, () => "Toggle"),
      ]);

      await user.click(screen.getByRole("button"));
      expect(handlePressedChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole("button"));
      expect(handlePressedChange).toHaveBeenCalledWith(false);
    });

    it("disabled 時はトグルしない", async () => {
      const user = userEvent.setup();
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarToggleButton, { disabled: true }, () => "Toggle"),
      ]);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");

      await user.click(button);

      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it("disabled 時はフォーカス対象外（disabled属性で非フォーカス）", () => {
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarToggleButton, { disabled: true }, () => "Toggle"),
      ]);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });
});

describe("ToolbarSeparator (Vue)", () => {
  describe("ARIA 属性", () => {
    it('role="separator" が設定される', () => {
      renderToolbar({ "aria-label": "Test toolbar" }, [
        h(ToolbarButton, null, () => "Before"),
        h(ToolbarSeparator),
        h(ToolbarButton, null, () => "After"),
      ]);
      expect(screen.getByRole("separator")).toBeInTheDocument();
    });

    it('horizontal toolbar 時に aria-orientation="vertical"', () => {
      renderToolbar(
        { "aria-label": "Test toolbar", orientation: "horizontal" },
        [
          h(ToolbarButton, null, () => "Before"),
          h(ToolbarSeparator),
          h(ToolbarButton, null, () => "After"),
        ]
      );
      expect(screen.getByRole("separator")).toHaveAttribute(
        "aria-orientation",
        "vertical"
      );
    });

    it('vertical toolbar 時に aria-orientation="horizontal"', () => {
      renderToolbar(
        { "aria-label": "Test toolbar", orientation: "vertical" },
        [
          h(ToolbarButton, null, () => "Before"),
          h(ToolbarSeparator),
          h(ToolbarButton, null, () => "After"),
        ]
      );
      expect(screen.getByRole("separator")).toHaveAttribute(
        "aria-orientation",
        "horizontal"
      );
    });
  });
});

describe("アクセシビリティ (Vue)", () => {
  it("axe による WCAG 2.1 AA 違反がない", async () => {
    const { container } = renderToolbar({ "aria-label": "Text formatting" }, [
      h(ToolbarToggleButton, null, () => "Bold"),
      h(ToolbarToggleButton, null, () => "Italic"),
      h(ToolbarSeparator),
      h(ToolbarButton, null, () => "Copy"),
      h(ToolbarButton, null, () => "Paste"),
    ]);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("vertical toolbar でも WCAG 2.1 AA 違反がない", async () => {
    const { container } = renderToolbar(
      { "aria-label": "Actions", orientation: "vertical" },
      [
        h(ToolbarButton, null, () => "New"),
        h(ToolbarButton, null, () => "Open"),
        h(ToolbarSeparator),
        h(ToolbarButton, null, () => "Save"),
      ]
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
