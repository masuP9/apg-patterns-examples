/**
 * AccessibilityDocs Smoke Test
 *
 * Verifies that all AccessibilityDocs components render without empty content elements.
 * This catches:
 *   - `set:html` on self-closing non-void elements (content silently discarded)
 *   - Data format mismatches (e.g. markdown passed where HTML is expected)
 *
 * @see https://github.com/masuP9/apg-patterns-examples/issues/143
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';

// Import all AccessibilityDocs components
import AccordionDocs from './accordion/AccessibilityDocs.astro';
import AlertDocs from './alert/AccessibilityDocs.astro';
import AlertDialogDocs from './alert-dialog/AccessibilityDocs.astro';
import BreadcrumbDocs from './breadcrumb/AccessibilityDocs.astro';
import ButtonDocs from './button/AccessibilityDocs.astro';
import CarouselDocs from './carousel/AccessibilityDocs.astro';
import CheckboxDocs from './checkbox/AccessibilityDocs.astro';
import ComboboxDocs from './combobox/AccessibilityDocs.astro';
import DataGridDocs from './data-grid/AccessibilityDocs.astro';
import DialogDocs from './dialog/AccessibilityDocs.astro';
import DisclosureDocs from './disclosure/AccessibilityDocs.astro';
import FeedDocs from './feed/AccessibilityDocs.astro';
import GridDocs from './grid/AccessibilityDocs.astro';
import LandmarksDocs from './landmarks/AccessibilityDocs.astro';
import LinkDocs from './link/AccessibilityDocs.astro';
import ListboxDocs from './listbox/AccessibilityDocs.astro';
import MenuButtonDocs from './menu-button/AccessibilityDocs.astro';
import MenubarDocs from './menubar/AccessibilityDocs.astro';
import MeterDocs from './meter/AccessibilityDocs.astro';
import RadioGroupDocs from './radio-group/AccessibilityDocs.astro';
import SliderDocs from './slider/AccessibilityDocs.astro';
import SliderMultithumbDocs from './slider-multithumb/AccessibilityDocs.astro';
import SpinbuttonDocs from './spinbutton/AccessibilityDocs.astro';
import SwitchDocs from './switch/AccessibilityDocs.astro';
import TabsDocs from './tabs/AccessibilityDocs.astro';
import ToggleButtonDocs from './toggle-button/AccessibilityDocs.astro';
import ToolbarDocs from './toolbar/AccessibilityDocs.astro';
import TooltipDocs from './tooltip/AccessibilityDocs.astro';
import TreeViewDocs from './tree-view/AccessibilityDocs.astro';
import TreegridDocs from './treegrid/AccessibilityDocs.astro';
import WindowSplitterDocs from './window-splitter/AccessibilityDocs.astro';

const accessibilityDocsComponents: Record<string, any> = {
  accordion: AccordionDocs,
  alert: AlertDocs,
  'alert-dialog': AlertDialogDocs,
  breadcrumb: BreadcrumbDocs,
  button: ButtonDocs,
  carousel: CarouselDocs,
  checkbox: CheckboxDocs,
  combobox: ComboboxDocs,
  'data-grid': DataGridDocs,
  dialog: DialogDocs,
  disclosure: DisclosureDocs,
  feed: FeedDocs,
  grid: GridDocs,
  landmarks: LandmarksDocs,
  link: LinkDocs,
  listbox: ListboxDocs,
  'menu-button': MenuButtonDocs,
  menubar: MenubarDocs,
  meter: MeterDocs,
  'radio-group': RadioGroupDocs,
  slider: SliderDocs,
  'slider-multithumb': SliderMultithumbDocs,
  spinbutton: SpinbuttonDocs,
  switch: SwitchDocs,
  tabs: TabsDocs,
  'toggle-button': ToggleButtonDocs,
  toolbar: ToolbarDocs,
  tooltip: TooltipDocs,
  'tree-view': TreeViewDocs,
  treegrid: TreegridDocs,
  'window-splitter': WindowSplitterDocs,
};

/** CSS selector for elements that should always have content */
const CONTENT_ELEMENTS = 'li, td, th';

describe('AccessibilityDocs smoke test — no empty content elements', () => {
  let container: AstroContainer;

  beforeAll(async () => {
    container = await AstroContainer.create();
  });

  for (const [name, Component] of Object.entries(accessibilityDocsComponents)) {
    for (const locale of ['en', 'ja'] as const) {
      it(`${name} (${locale}) has no empty content elements`, async () => {
        const html = await container.renderToString(Component, {
          props: { locale },
        });
        const doc = new JSDOM(html).window.document;

        const emptyElements = Array.from(doc.querySelectorAll(CONTENT_ELEMENTS)).filter(
          (el) => el.innerHTML.trim() === ''
        );

        expect(
          emptyElements,
          `Found ${emptyElements.length} empty element(s) in ${name} (${locale}): ` +
            emptyElements
              .map((el) => {
                const tag = el.tagName.toLowerCase();
                const cls = el.className ? ` class="${el.className}"` : '';
                return `<${tag}${cls}>`;
              })
              .join(', ')
        ).toHaveLength(0);
      });
    }
  }
});
