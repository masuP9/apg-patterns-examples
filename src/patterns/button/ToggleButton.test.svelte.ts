import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import ToggleButton from "./ToggleButton.svelte";

describe("ToggleButton (Svelte)", () => {
  // 🔴 High Priority: APG 準拠の核心
  describe("APG: キーボード操作", () => {
    it("Space キーでトグルする", async () => {
      const user = userEvent.setup();
      render(ToggleButton, {
        props: { children: "Mute" },
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
        props: { children: "Mute" },
      });
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("aria-pressed", "false");
      button.focus();
      await user.keyboard("{Enter}");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("disabled 時は Tab キースキップ", async () => {
      const user = userEvent.setup();
      const container = document.createElement("div");
      document.body.appendChild(container);

      // Render three buttons manually to test tab order
      const { unmount: unmount1 } = render(ToggleButton, {
        target: container,
        props: { children: "Button 1" },
      });
      const { unmount: unmount2 } = render(ToggleButton, {
        target: container,
        props: { children: "Button 2", disabled: true },
      });
      const { unmount: unmount3 } = render(ToggleButton, {
        target: container,
        props: { children: "Button 3" },
      });

      await user.tab();
      expect(screen.getByRole("button", { name: "Button 1" })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("button", { name: "Button 3" })).toHaveFocus();

      unmount1();
      unmount2();
      unmount3();
      document.body.removeChild(container);
    });
  });

  describe("APG: ARIA 属性", () => {
    it('role="button" を持つ（暗黙的）', () => {
      render(ToggleButton, {
        props: { children: "Mute" },
      });
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it('初期状態で aria-pressed="false"', () => {
      render(ToggleButton, {
        props: { children: "Mute" },
      });
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it('クリック後に aria-pressed="true" に変わる', async () => {
      const user = userEvent.setup();
      render(ToggleButton, {
        props: { children: "Mute" },
      });
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("aria-pressed", "false");
      await user.click(button);
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it('type="button" が設定されている', () => {
      render(ToggleButton, {
        props: { children: "Mute" },
      });
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("disabled 状態で aria-pressed 変更不可", async () => {
      const user = userEvent.setup();
      render(ToggleButton, {
        props: { children: "Mute", disabled: true },
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
        props: { children: "Mute" },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("アクセシブルネームが設定されている", () => {
      render(ToggleButton, {
        props: { children: "Mute Audio" },
      });
      expect(
        screen.getByRole("button", { name: /Mute Audio/i })
      ).toBeInTheDocument();
    });
  });

  describe("Props", () => {
    it("initialPressed=true で押下状態でレンダリングされる", () => {
      render(ToggleButton, {
        props: { children: "Mute", initialPressed: true },
      });
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("onToggle が状態変化時に呼び出される", async () => {
      const handleToggle = vi.fn();
      const user = userEvent.setup();
      render(ToggleButton, {
        props: { children: "Mute", onToggle: handleToggle },
      });

      await user.click(screen.getByRole("button"));
      expect(handleToggle).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole("button"));
      expect(handleToggle).toHaveBeenCalledWith(false);
    });
  });

  // 🟢 Low Priority: 拡張性
  describe("HTML 属性継承", () => {
    it("デフォルトで apg-toggle-button クラスが設定される", () => {
      render(ToggleButton, {
        props: { children: "Mute" },
      });
      const button = screen.getByRole("button");
      expect(button).toHaveClass("apg-toggle-button");
    });

    it("data-* 属性が継承される", () => {
      render(ToggleButton, {
        props: { children: "Mute", "data-testid": "custom-toggle" },
      });
      expect(screen.getByTestId("custom-toggle")).toBeInTheDocument();
    });
  });
});
