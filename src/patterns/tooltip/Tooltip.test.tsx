import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  // 🔴 High Priority: APG 準拠の核心
  describe("APG: ARIA 属性", () => {
    it('role="tooltip" を持つ', () => {
      render(
        <Tooltip content="This is a tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument();
    });

    it("非表示時は aria-hidden が true", () => {
      render(
        <Tooltip content="This is a tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      const tooltip = screen.getByRole("tooltip", { hidden: true });
      expect(tooltip).toHaveAttribute("aria-hidden", "true");
    });

    it("表示時は aria-hidden が false", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole("button");

      await user.hover(trigger);
      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toHaveAttribute("aria-hidden", "false");
      });
    });

    it("表示時のみ aria-describedby が設定される", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole("button");
      const wrapper = trigger.parentElement;

      // 非表示時は aria-describedby がない
      expect(wrapper).not.toHaveAttribute("aria-describedby");

      await user.hover(trigger);
      await waitFor(() => {
        expect(wrapper).toHaveAttribute("aria-describedby");
      });

      const tooltipId = wrapper?.getAttribute("aria-describedby");
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toHaveAttribute("id", tooltipId);
    });
  });

  describe("APG: キーボード操作", () => {
    it("Escape キーで閉じる", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole("button");

      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveAttribute(
          "aria-hidden",
          "false"
        );
      });

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.getByRole("tooltip", { hidden: true })).toHaveAttribute(
          "aria-hidden",
          "true"
        );
      });
    });

    it("フォーカスで表示される", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.tab();
      expect(screen.getByRole("button")).toHaveFocus();

      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveAttribute(
          "aria-hidden",
          "false"
        );
      });
    });

    it("フォーカスアウトで閉じる", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Tooltip content="This is a tooltip" delay={0}>
            <button>First</button>
          </Tooltip>
          <button>Second</button>
        </>
      );

      await user.tab();
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveAttribute(
          "aria-hidden",
          "false"
        );
      });

      await user.tab();
      await waitFor(() => {
        expect(screen.getByRole("tooltip", { hidden: true })).toHaveAttribute(
          "aria-hidden",
          "true"
        );
      });
    });
  });

  describe("ホバー操作", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("ホバーで表示される", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole("button");

      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveAttribute(
          "aria-hidden",
          "false"
        );
      });
    });

    it("ホバー解除で閉じる", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole("button");

      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveAttribute(
          "aria-hidden",
          "false"
        );
      });

      await user.unhover(trigger);
      await waitFor(() => {
        expect(screen.getByRole("tooltip", { hidden: true })).toHaveAttribute(
          "aria-hidden",
          "true"
        );
      });
    });

    it("delay 後に表示される", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={100}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole("button");

      await user.hover(trigger);

      // delay 前は非表示（直後）
      expect(screen.getByRole("tooltip", { hidden: true })).toHaveAttribute(
        "aria-hidden",
        "true"
      );

      // delay 後は表示
      await waitFor(
        () => {
          expect(screen.getByRole("tooltip")).toHaveAttribute(
            "aria-hidden",
            "false"
          );
        },
        { timeout: 200 }
      );
    });
  });

  // 🟡 Medium Priority: アクセシビリティ検証
  describe("アクセシビリティ", () => {
    it("axe による WCAG 2.1 AA 違反がない（非表示状態）", async () => {
      const { container } = render(
        <Tooltip content="This is a tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("axe による WCAG 2.1 AA 違反がない（表示状態）", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByRole("button"));
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toHaveAttribute(
          "aria-hidden",
          "false"
        );
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("tooltip がフォーカスを受け取らない", () => {
      render(
        <Tooltip content="This is a tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      const tooltip = screen.getByRole("tooltip", { hidden: true });
      expect(tooltip).not.toHaveAttribute("tabindex");
    });
  });

  describe("Props", () => {
    it("placement prop で位置を変更できる", () => {
      render(
        <Tooltip content="Tooltip" placement="bottom">
          <button>Hover me</button>
        </Tooltip>
      );
      const tooltip = screen.getByRole("tooltip", { hidden: true });
      expect(tooltip).toHaveClass("top-full");
    });

    it("disabled の場合、tooltip が表示されない", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip" delay={0} disabled>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole("button");

      await user.hover(trigger);
      // disabled なので表示されない (delay=0 なので即時)
      expect(screen.getByRole("tooltip", { hidden: true })).toHaveAttribute(
        "aria-hidden",
        "true"
      );
    });

    it("id prop でカスタム ID を設定できる", () => {
      render(
        <Tooltip content="Tooltip" id="custom-tooltip-id">
          <button>Hover me</button>
        </Tooltip>
      );
      const tooltip = screen.getByRole("tooltip", { hidden: true });
      expect(tooltip).toHaveAttribute("id", "custom-tooltip-id");
    });

    it("onOpenChange が状態変化時に呼び出される", async () => {
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip" delay={0} onOpenChange={handleOpenChange}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole("button");

      await user.hover(trigger);
      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(true);
      });

      await user.unhover(trigger);
      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("controlled open prop で制御できる", () => {
      const { rerender } = render(
        <Tooltip content="Tooltip" open={false}>
          <button>Hover me</button>
        </Tooltip>
      );

      expect(screen.getByRole("tooltip", { hidden: true })).toHaveAttribute(
        "aria-hidden",
        "true"
      );

      rerender(
        <Tooltip content="Tooltip" open={true}>
          <button>Hover me</button>
        </Tooltip>
      );

      expect(screen.getByRole("tooltip")).toHaveAttribute(
        "aria-hidden",
        "false"
      );
    });
  });

  // 🟢 Low Priority: 拡張性
  describe("HTML 属性継承", () => {
    it("className が正しくマージされる", () => {
      render(
        <Tooltip content="Tooltip" className="custom-class">
          <button>Hover me</button>
        </Tooltip>
      );
      const wrapper = screen.getByRole("button").parentElement;
      expect(wrapper).toHaveClass("custom-class");
      expect(wrapper).toHaveClass("apg-tooltip-trigger");
    });

    it("tooltipClassName が適用される", () => {
      render(
        <Tooltip content="Tooltip" tooltipClassName="custom-tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      const tooltip = screen.getByRole("tooltip", { hidden: true });
      expect(tooltip).toHaveClass("custom-tooltip");
    });
  });
});
