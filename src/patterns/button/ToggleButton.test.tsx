import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { ToggleButton } from "./ToggleButton";

describe("ToggleButton", () => {
  // 🔴 High Priority: APG 準拠の核心
  describe("APG: キーボード操作", () => {
    it("Space キーでトグルする", async () => {
      const user = userEvent.setup();
      render(<ToggleButton>Mute</ToggleButton>);
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("aria-pressed", "false");
      button.focus();
      await user.keyboard(" ");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("Enter キーでトグルする", async () => {
      const user = userEvent.setup();
      render(<ToggleButton>Mute</ToggleButton>);
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("aria-pressed", "false");
      button.focus();
      await user.keyboard("{Enter}");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("Tab キーでフォーカス移動可能", async () => {
      const user = userEvent.setup();
      render(
        <>
          <ToggleButton>Button 1</ToggleButton>
          <ToggleButton>Button 2</ToggleButton>
        </>
      );

      await user.tab();
      expect(screen.getByRole("button", { name: "Button 1" })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("button", { name: "Button 2" })).toHaveFocus();
    });

    it("disabled 時は Tab キースキップ", async () => {
      const user = userEvent.setup();
      render(
        <>
          <ToggleButton>Button 1</ToggleButton>
          <ToggleButton disabled>Button 2</ToggleButton>
          <ToggleButton>Button 3</ToggleButton>
        </>
      );

      await user.tab();
      expect(screen.getByRole("button", { name: "Button 1" })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("button", { name: "Button 3" })).toHaveFocus();
    });
  });

  describe("APG: ARIA 属性", () => {
    it('role="button" を持つ（暗黙的）', () => {
      render(<ToggleButton>Mute</ToggleButton>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it('初期状態で aria-pressed="false"', () => {
      render(<ToggleButton>Mute</ToggleButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it('クリック後に aria-pressed="true" に変わる', async () => {
      const user = userEvent.setup();
      render(<ToggleButton>Mute</ToggleButton>);
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("aria-pressed", "false");
      await user.click(button);
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it('type="button" が設定されている', () => {
      render(<ToggleButton>Mute</ToggleButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("disabled 状態で aria-pressed 変更不可", async () => {
      const user = userEvent.setup();
      render(<ToggleButton disabled>Mute</ToggleButton>);
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("aria-pressed", "false");
      await user.click(button);
      expect(button).toHaveAttribute("aria-pressed", "false");
    });
  });

  // 🟡 Medium Priority: アクセシビリティ検証
  describe("アクセシビリティ", () => {
    it("axe による WCAG 2.1 AA 違反がない", async () => {
      const { container } = render(<ToggleButton>Mute</ToggleButton>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("アクセシブルネームが設定されている", () => {
      render(<ToggleButton>Mute Audio</ToggleButton>);
      expect(
        screen.getByRole("button", { name: /Mute Audio/i })
      ).toBeInTheDocument();
    });
  });

  describe("Props", () => {
    it("initialPressed=true で押下状態でレンダリングされる", () => {
      render(<ToggleButton initialPressed>Mute</ToggleButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("onPressedChange が状態変化時に呼び出される", async () => {
      const handlePressedChange = vi.fn();
      const user = userEvent.setup();
      render(
        <ToggleButton onPressedChange={handlePressedChange}>Mute</ToggleButton>
      );

      await user.click(screen.getByRole("button"));
      expect(handlePressedChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole("button"));
      expect(handlePressedChange).toHaveBeenCalledWith(false);
    });
  });

  describe("カスタムインジケーター", () => {
    it("デフォルトで●/○インジケーターが表示される", () => {
      render(<ToggleButton>Mute</ToggleButton>);
      const button = screen.getByRole("button");
      const indicator = button.querySelector(".apg-toggle-indicator");
      expect(indicator).toHaveTextContent("○");
    });

    it("pressedIndicator でカスタムインジケーターを設定できる", () => {
      render(
        <ToggleButton initialPressed pressedIndicator="🔇">
          Mute
        </ToggleButton>
      );
      const button = screen.getByRole("button");
      const indicator = button.querySelector(".apg-toggle-indicator");
      expect(indicator).toHaveTextContent("🔇");
    });

    it("unpressedIndicator でカスタムインジケーターを設定できる", () => {
      render(
        <ToggleButton unpressedIndicator="🔊">Mute</ToggleButton>
      );
      const button = screen.getByRole("button");
      const indicator = button.querySelector(".apg-toggle-indicator");
      expect(indicator).toHaveTextContent("🔊");
    });

    it("トグル時にカスタムインジケーターが切り替わる", async () => {
      const user = userEvent.setup();
      render(
        <ToggleButton pressedIndicator="🔇" unpressedIndicator="🔊">
          Mute
        </ToggleButton>
      );
      const button = screen.getByRole("button");
      const indicator = button.querySelector(".apg-toggle-indicator");

      expect(indicator).toHaveTextContent("🔊");
      await user.click(button);
      expect(indicator).toHaveTextContent("🔇");
      await user.click(button);
      expect(indicator).toHaveTextContent("🔊");
    });

    it("ReactNode としてカスタムインジケーターを渡せる", () => {
      render(
        <ToggleButton
          initialPressed
          pressedIndicator={<span data-testid="custom-icon">X</span>}
        >
          Mute
        </ToggleButton>
      );
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("カスタムインジケーターでも aria-hidden が維持される", () => {
      render(
        <ToggleButton pressedIndicator="🔇" unpressedIndicator="🔊">
          Mute
        </ToggleButton>
      );
      const button = screen.getByRole("button");
      const indicator = button.querySelector(".apg-toggle-indicator");
      expect(indicator).toHaveAttribute("aria-hidden", "true");
    });

    it("カスタムインジケーターでも axe 違反がない", async () => {
      const { container } = render(
        <ToggleButton pressedIndicator="🔇" unpressedIndicator="🔊">
          Mute
        </ToggleButton>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: 拡張性
  describe("HTML 属性継承", () => {
    it("className が正しくマージされる", () => {
      render(<ToggleButton className="custom-class">Mute</ToggleButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
      expect(button).toHaveClass("apg-toggle-button");
    });

    it("data-* 属性が継承される", () => {
      render(<ToggleButton data-testid="custom-toggle">Mute</ToggleButton>);
      expect(screen.getByTestId("custom-toggle")).toBeInTheDocument();
    });

    it("子要素が React ノードでも正常動作", () => {
      render(
        <ToggleButton>
          <span>Icon</span> Text
        </ToggleButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Icon");
      expect(button).toHaveTextContent("Text");
    });
  });
});
