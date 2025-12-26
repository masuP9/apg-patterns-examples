import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import Accordion from "./Accordion.vue";
import type { AccordionItem } from "./Accordion.vue";

// テスト用のアコーディオンデータ
const defaultItems: AccordionItem[] = [
  { id: "section1", header: "Section 1", content: "Content 1" },
  { id: "section2", header: "Section 2", content: "Content 2" },
  { id: "section3", header: "Section 3", content: "Content 3" },
];

const itemsWithDisabled: AccordionItem[] = [
  { id: "section1", header: "Section 1", content: "Content 1" },
  { id: "section2", header: "Section 2", content: "Content 2", disabled: true },
  { id: "section3", header: "Section 3", content: "Content 3" },
];

const itemsWithDefaultExpanded: AccordionItem[] = [
  { id: "section1", header: "Section 1", content: "Content 1", defaultExpanded: true },
  { id: "section2", header: "Section 2", content: "Content 2" },
  { id: "section3", header: "Section 3", content: "Content 3" },
];

// 7個以上のアイテム（region role テスト用）
const manyItems: AccordionItem[] = Array.from({ length: 7 }, (_, i) => ({
  id: `section${i + 1}`,
  header: `Section ${i + 1}`,
  content: `Content ${i + 1}`,
}));

describe("Accordion (Vue)", () => {
  // 🔴 High Priority: APG 準拠の核心
  describe("APG: キーボード操作", () => {
    it("Enter でパネルを開閉する", async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: defaultItems } });

      const button = screen.getByRole("button", { name: "Section 1" });
      button.focus();

      expect(button).toHaveAttribute("aria-expanded", "false");
      await user.keyboard("{Enter}");
      expect(button).toHaveAttribute("aria-expanded", "true");
      await user.keyboard("{Enter}");
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("Space でパネルを開閉する", async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: defaultItems } });

      const button = screen.getByRole("button", { name: "Section 1" });
      button.focus();

      expect(button).toHaveAttribute("aria-expanded", "false");
      await user.keyboard(" ");
      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("ArrowDown で次のヘッダーにフォーカス移動", async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: defaultItems } });

      const button1 = screen.getByRole("button", { name: "Section 1" });
      button1.focus();

      await user.keyboard("{ArrowDown}");

      const button2 = screen.getByRole("button", { name: "Section 2" });
      expect(button2).toHaveFocus();
    });

    it("ArrowUp で前のヘッダーにフォーカス移動", async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: defaultItems } });

      const button2 = screen.getByRole("button", { name: "Section 2" });
      button2.focus();

      await user.keyboard("{ArrowUp}");

      const button1 = screen.getByRole("button", { name: "Section 1" });
      expect(button1).toHaveFocus();
    });

    it("ArrowDown で最後のヘッダーにいる場合、移動しない（ループなし）", async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: defaultItems } });

      const button3 = screen.getByRole("button", { name: "Section 3" });
      button3.focus();

      await user.keyboard("{ArrowDown}");

      expect(button3).toHaveFocus();
    });

    it("ArrowUp で最初のヘッダーにいる場合、移動しない（ループなし）", async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: defaultItems } });

      const button1 = screen.getByRole("button", { name: "Section 1" });
      button1.focus();

      await user.keyboard("{ArrowUp}");

      expect(button1).toHaveFocus();
    });

    it("Home で最初のヘッダーに移動", async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: defaultItems } });

      const button3 = screen.getByRole("button", { name: "Section 3" });
      button3.focus();

      await user.keyboard("{Home}");

      const button1 = screen.getByRole("button", { name: "Section 1" });
      expect(button1).toHaveFocus();
    });

    it("End で最後のヘッダーに移動", async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: defaultItems } });

      const button1 = screen.getByRole("button", { name: "Section 1" });
      button1.focus();

      await user.keyboard("{End}");

      const button3 = screen.getByRole("button", { name: "Section 3" });
      expect(button3).toHaveFocus();
    });

    it("disabled ヘッダーをスキップして移動", async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: itemsWithDisabled } });

      const button1 = screen.getByRole("button", { name: "Section 1" });
      button1.focus();

      await user.keyboard("{ArrowDown}");

      const button3 = screen.getByRole("button", { name: "Section 3" });
      expect(button3).toHaveFocus();
    });

    it("enableArrowKeys=false で矢印キーナビゲーション無効", async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: defaultItems, enableArrowKeys: false } });

      const button1 = screen.getByRole("button", { name: "Section 1" });
      button1.focus();

      await user.keyboard("{ArrowDown}");

      expect(button1).toHaveFocus();
    });
  });

  describe("APG: ARIA 属性", () => {
    it("ヘッダーボタンが aria-expanded を持つ", () => {
      render(Accordion, { props: { items: defaultItems } });
      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        expect(button).toHaveAttribute("aria-expanded");
      });
    });

    it('開いたパネルで aria-expanded="true"', async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: defaultItems } });

      const button = screen.getByRole("button", { name: "Section 1" });
      await user.click(button);

      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it('閉じたパネルで aria-expanded="false"', () => {
      render(Accordion, { props: { items: defaultItems } });
      const button = screen.getByRole("button", { name: "Section 1" });

      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("ヘッダーの aria-controls がパネル id と一致", () => {
      render(Accordion, { props: { items: defaultItems } });
      const button = screen.getByRole("button", { name: "Section 1" });
      const ariaControls = button.getAttribute("aria-controls");

      expect(ariaControls).toBeTruthy();
      expect(document.getElementById(ariaControls!)).toBeInTheDocument();
    });

    it('6個以下のパネルで role="region" を持つ', () => {
      render(Accordion, { props: { items: defaultItems } });
      const regions = screen.getAllByRole("region");

      expect(regions).toHaveLength(3);
    });

    it('7個以上のパネルで role="region" を持たない', () => {
      render(Accordion, { props: { items: manyItems } });
      const regions = screen.queryAllByRole("region");

      expect(regions).toHaveLength(0);
    });

    it("パネルの aria-labelledby がヘッダー id と一致", () => {
      render(Accordion, { props: { items: defaultItems } });
      const button = screen.getByRole("button", { name: "Section 1" });
      const regions = screen.getAllByRole("region");

      expect(regions[0]).toHaveAttribute("aria-labelledby", button.id);
    });

    it('disabled 項目が aria-disabled="true" を持つ', () => {
      render(Accordion, { props: { items: itemsWithDisabled } });
      const disabledButton = screen.getByRole("button", { name: "Section 2" });

      expect(disabledButton).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("APG: 見出し構造", () => {
    it("headingLevel=3 で h3 要素を使用", () => {
      render(Accordion, { props: { items: defaultItems, headingLevel: 3 } });
      const headings = document.querySelectorAll("h3");

      expect(headings).toHaveLength(3);
    });

    it("headingLevel=2 で h2 要素を使用", () => {
      render(Accordion, { props: { items: defaultItems, headingLevel: 2 } });
      const headings = document.querySelectorAll("h2");

      expect(headings).toHaveLength(3);
    });
  });

  // 🟡 Medium Priority: アクセシビリティ検証
  describe("アクセシビリティ", () => {
    it("axe による WCAG 2.1 AA 違反がない", async () => {
      const { container } = render(Accordion, { props: { items: defaultItems } });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Props", () => {
    it("defaultExpanded で初期展開状態を指定できる", () => {
      render(Accordion, { props: { items: itemsWithDefaultExpanded } });
      const button = screen.getByRole("button", { name: "Section 1" });

      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("allowMultiple=false で1つのみ展開（デフォルト）", async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: defaultItems } });

      const button1 = screen.getByRole("button", { name: "Section 1" });
      const button2 = screen.getByRole("button", { name: "Section 2" });

      await user.click(button1);
      expect(button1).toHaveAttribute("aria-expanded", "true");

      await user.click(button2);
      expect(button1).toHaveAttribute("aria-expanded", "false");
      expect(button2).toHaveAttribute("aria-expanded", "true");
    });

    it("allowMultiple=true で複数展開可能", async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: defaultItems, allowMultiple: true } });

      const button1 = screen.getByRole("button", { name: "Section 1" });
      const button2 = screen.getByRole("button", { name: "Section 2" });

      await user.click(button1);
      await user.click(button2);

      expect(button1).toHaveAttribute("aria-expanded", "true");
      expect(button2).toHaveAttribute("aria-expanded", "true");
    });

    it("@expandedChange が展開状態変化時に発火する", async () => {
      const handleExpandedChange = vi.fn();
      const user = userEvent.setup();
      render(Accordion, {
        props: { items: defaultItems, onExpandedChange: handleExpandedChange },
      });

      await user.click(screen.getByRole("button", { name: "Section 1" }));

      expect(handleExpandedChange).toHaveBeenCalledWith(["section1"]);
    });
  });

  describe("異常系", () => {
    it("disabled 項目はクリックで開閉しない", async () => {
      const user = userEvent.setup();
      render(Accordion, { props: { items: itemsWithDisabled } });

      const disabledButton = screen.getByRole("button", { name: "Section 2" });

      expect(disabledButton).toHaveAttribute("aria-expanded", "false");
      await user.click(disabledButton);
      expect(disabledButton).toHaveAttribute("aria-expanded", "false");
    });

    it("disabled かつ defaultExpanded の項目は展開されない", () => {
      const items: AccordionItem[] = [
        { id: "section1", header: "Section 1", content: "Content 1", disabled: true, defaultExpanded: true },
      ];
      render(Accordion, { props: { items } });

      const button = screen.getByRole("button", { name: "Section 1" });
      expect(button).toHaveAttribute("aria-expanded", "false");
    });
  });
});
