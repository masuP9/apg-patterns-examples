import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import ToggleButton from "./ToggleButton.vue";

describe("ToggleButton (Vue)", () => {
  // 🔴 High Priority: APG 準拠の核心
  describe("APG: キーボード操作", () => {
    it("Space キーでトグルする", async () => {
      const user = userEvent.setup();
      render(ToggleButton, {
        slots: { default: "Mute" },
      });
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("aria-pressed", "false");
      button.focus();
      await user.keyboard(" ");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("Enter キーでトグルする", async () => {
      const user = userEvent.setup();
      render(ToggleButton, {
        slots: { default: "Mute" },
      });
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("aria-pressed", "false");
      button.focus();
      await user.keyboard("{Enter}");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("Tab キーでフォーカス移動可能", async () => {
      const user = userEvent.setup();
      render({
        components: { ToggleButton },
        template: `
          <ToggleButton>Button 1</ToggleButton>
          <ToggleButton>Button 2</ToggleButton>
        `,
      });

      await user.tab();
      expect(screen.getByRole("button", { name: "Button 1" })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("button", { name: "Button 2" })).toHaveFocus();
    });

    it("disabled 時は Tab キースキップ", async () => {
      const user = userEvent.setup();
      render({
        components: { ToggleButton },
        template: `
          <ToggleButton>Button 1</ToggleButton>
          <ToggleButton disabled>Button 2</ToggleButton>
          <ToggleButton>Button 3</ToggleButton>
        `,
      });

      await user.tab();
      expect(screen.getByRole("button", { name: "Button 1" })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("button", { name: "Button 3" })).toHaveFocus();
    });
  });

  describe("APG: ARIA 属性", () => {
    it('role="button" を持つ（暗黙的）', () => {
      render(ToggleButton, {
        slots: { default: "Mute" },
      });
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it('初期状態で aria-pressed="false"', () => {
      render(ToggleButton, {
        slots: { default: "Mute" },
      });
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it('クリック後に aria-pressed="true" に変わる', async () => {
      const user = userEvent.setup();
      render(ToggleButton, {
        slots: { default: "Mute" },
      });
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("aria-pressed", "false");
      await user.click(button);
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it('type="button" が設定されている', () => {
      render(ToggleButton, {
        slots: { default: "Mute" },
      });
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("disabled 状態で aria-pressed 変更不可", async () => {
      const user = userEvent.setup();
      render(ToggleButton, {
        props: { disabled: true },
        slots: { default: "Mute" },
      });
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("aria-pressed", "false");
      await user.click(button);
      expect(button).toHaveAttribute("aria-pressed", "false");
    });
  });

  // 🟡 Medium Priority: アクセシビリティ検証
  describe("アクセシビリティ", () => {
    it("axe による WCAG 2.1 AA 違反がない", async () => {
      const { container } = render(ToggleButton, {
        slots: { default: "Mute" },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("アクセシブルネームが設定されている", () => {
      render(ToggleButton, {
        slots: { default: "Mute Audio" },
      });
      expect(
        screen.getByRole("button", { name: /Mute Audio/i })
      ).toBeInTheDocument();
    });
  });

  describe("Props", () => {
    it("initialPressed=true で押下状態でレンダリングされる", () => {
      render(ToggleButton, {
        props: { initialPressed: true },
        slots: { default: "Mute" },
      });
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("onToggle が状態変化時に呼び出される", async () => {
      const handleToggle = vi.fn();
      const user = userEvent.setup();
      render(ToggleButton, {
        props: { onToggle: handleToggle },
        slots: { default: "Mute" },
      });

      await user.click(screen.getByRole("button"));
      expect(handleToggle).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole("button"));
      expect(handleToggle).toHaveBeenCalledWith(false);
    });

    it("@toggle イベントが状態変化時に発火する", async () => {
      const handleToggle = vi.fn();
      const user = userEvent.setup();
      render(ToggleButton, {
        props: { onToggle: handleToggle },
        slots: { default: "Mute" },
      });

      await user.click(screen.getByRole("button"));
      expect(handleToggle).toHaveBeenCalledWith(true);
    });
  });

  // 🟢 Low Priority: 拡張性
  describe("HTML 属性継承", () => {
    it("class が正しくマージされる", () => {
      render(ToggleButton, {
        attrs: { class: "custom-class" },
        slots: { default: "Mute" },
      });
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
      expect(button).toHaveClass("apg-toggle-button");
    });

    it("data-* 属性が継承される", () => {
      render(ToggleButton, {
        attrs: { "data-testid": "custom-toggle" },
        slots: { default: "Mute" },
      });
      expect(screen.getByTestId("custom-toggle")).toBeInTheDocument();
    });
  });
});
