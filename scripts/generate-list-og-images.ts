/**
 * List Page OGP Image Generator
 *
 * Generates Open Graph images for patterns list and practices list pages.
 * Each image features a grid of Lucide icons representing the available items.
 */

import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const OUTPUT_DIR = join(PROJECT_ROOT, 'public/og-images');

// OGP image dimensions
const WIDTH = 1200;
const HEIGHT = 630;

const SITE_NAME = 'APG Patterns Examples';

// Pattern ID to Lucide icon name mapping
const PATTERN_ICONS: Record<string, string> = {
  accordion: 'chevrons-down-up',
  alert: 'alert-circle',
  'alert-dialog': 'alert-triangle',
  breadcrumb: 'chevron-right',
  button: 'square',
  carousel: 'gallery-horizontal',
  checkbox: 'check-square',
  combobox: 'chevrons-up-down',
  'data-grid': 'table-2',
  dialog: 'message-square',
  disclosure: 'chevron-down',
  feed: 'rss',
  grid: 'grid-3x3',
  landmarks: 'layout',
  link: 'link',
  listbox: 'list',
  'menu-button': 'menu',
  menubar: 'panel-top-open',
  meter: 'gauge',
  'radio-group': 'circle-dot',
  slider: 'sliders-horizontal',
  'slider-multithumb': 'sliders-horizontal',
  spinbutton: 'plus-minus',
  switch: 'toggle-left',
  table: 'table',
  tabs: 'layout-panel-top',
  'toggle-button': 'toggle-right',
  toolbar: 'panel-top',
  tooltip: 'message-circle',
  'tree-view': 'folder-tree',
  treegrid: 'git-branch',
  'window-splitter': 'columns-2',
};

// Practice ID to Lucide icon name mapping
const PRACTICE_ICONS: Record<string, string> = {
  'landmark-regions': 'layout',
  'names-and-descriptions': 'tag',
  'keyboard-interface': 'keyboard',
  'grid-and-table-properties': 'table-2',
  'range-related-properties': 'sliders-horizontal',
  'structural-roles': 'heading',
  'hiding-semantics': 'eye-off',
};

function loadFont() {
  const fontPath = require.resolve('@fontsource/inter/files/inter-latin-400-normal.woff');
  const fontData = readFileSync(fontPath);
  return {
    name: 'Inter',
    data: fontData,
    weight: 400 as const,
    style: 'normal' as const,
  };
}

function loadFontBold() {
  const fontPath = require.resolve('@fontsource/inter/files/inter-latin-700-normal.woff');
  const fontData = readFileSync(fontPath);
  return {
    name: 'Inter',
    data: fontData,
    weight: 700 as const,
    style: 'normal' as const,
  };
}

/**
 * Load Lucide icon SVG and extract path data
 */
function loadLucideIcon(iconName: string): string | null {
  try {
    const iconPath = require.resolve(`lucide-static/icons/${iconName}.svg`);
    const svgContent = readFileSync(iconPath, 'utf-8');
    return svgContent;
  } catch {
    console.warn(`  Warning: Could not load icon: ${iconName}`);
    return null;
  }
}

/**
 * Create an icon element from Lucide SVG
 */
function createIconElement(svgContent: string, size: number = 40) {
  // Extract paths from SVG
  const pathMatches = svgContent.matchAll(/<(path|circle|rect|line|polyline|polygon)[^>]*>/g);
  const paths: unknown[] = [];

  for (const match of pathMatches) {
    const element = match[0];
    const tagName = match[1];

    // Extract attributes
    const attrs: Record<string, string> = {};
    const attrMatches = element.matchAll(/(\w+)="([^"]*)"/g);
    for (const attrMatch of attrMatches) {
      attrs[attrMatch[1]] = attrMatch[2];
    }

    // Convert to Satori element
    const style: Record<string, unknown> = {};
    if (attrs.fill && attrs.fill !== 'none') style.fill = attrs.fill;
    if (attrs.stroke) style.stroke = 'currentColor';
    if (attrs['stroke-width']) style.strokeWidth = attrs['stroke-width'];
    if (attrs['stroke-linecap']) style.strokeLinecap = attrs['stroke-linecap'];
    if (attrs['stroke-linejoin']) style.strokeLinejoin = attrs['stroke-linejoin'];

    paths.push({
      type: tagName,
      props: {
        ...attrs,
        style,
      },
    });
  }

  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'rgba(255,255,255,0.8)',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: paths,
    },
  };
}

/**
 * Create icon grid silhouette using Lucide icons
 */
function createIconGrid(iconMap: Record<string, string>, ids: string[], columns: number = 6) {
  const rows: string[][] = [];
  for (let i = 0; i < ids.length; i += columns) {
    rows.push(ids.slice(i, i + columns));
  }

  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        opacity: 0.2,
      },
      children: rows.map((row) => ({
        type: 'div',
        props: {
          style: {
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
          },
          children: row.map((id) => {
            const iconName = iconMap[id] || 'circle';
            const svgContent = loadLucideIcon(iconName);
            const iconElement = svgContent ? createIconElement(svgContent, 48) : null;

            return {
              type: 'div',
              props: {
                style: {
                  width: 72,
                  height: 72,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: iconElement,
              },
            };
          }),
        },
      })),
    },
  };
}

/**
 * Create OGP image template for list pages
 */
function createListTemplate(title: string, iconGrid: unknown) {
  return {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(180deg,rgba(2, 0, 36, 1) 0%, rgba(6, 62, 156, 1) 52%, rgba(3, 150, 214, 1) 83%, rgba(0, 212, 255, 1) 100%)',
        position: 'relative',
        fontFamily: 'Inter',
      },
      children: [
        // Icon grid (background)
        iconGrid,

        // Text content
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              position: 'relative',
            },
            children: [
              // Title
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 72,
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: 16,
                    letterSpacing: '-0.02em',
                    textShadow: '0 4px 24px rgba(0, 0, 0, 0.5)',
                  },
                  children: title,
                },
              },
              // Site name
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 28,
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.7)',
                    textShadow: '0 2px 12px rgba(0, 0, 0, 0.5)',
                  },
                  children: SITE_NAME,
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function generateListOGImages() {
  console.log('Generating list page OGP images...\n');

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load fonts
  const fontRegular = loadFont();
  const fontBold = loadFontBold();

  // Get available pattern and practice IDs
  const patternIds = Object.keys(PATTERN_ICONS);
  const practiceIds = Object.keys(PRACTICE_ICONS);

  const pages = [
    {
      name: 'Patterns',
      filename: 'patterns.png',
      iconMap: PATTERN_ICONS,
      ids: patternIds.slice(0, 18), // Limit to fit grid nicely
      columns: 6,
    },
    {
      name: 'Practices',
      filename: 'practices.png',
      iconMap: PRACTICE_ICONS,
      ids: practiceIds,
      columns: 4,
    },
  ];

  for (const page of pages) {
    try {
      const iconGrid = createIconGrid(page.iconMap, page.ids, page.columns);
      const template = createListTemplate(page.name, iconGrid);

      // Generate SVG with Satori
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const svg = await satori(template as any, {
        width: WIDTH,
        height: HEIGHT,
        fonts: [fontRegular, fontBold],
      });

      // Convert SVG to PNG with Sharp
      const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

      // Write the PNG file
      const outputPath = join(OUTPUT_DIR, page.filename);
      writeFileSync(outputPath, pngBuffer);

      console.log(`  ✓ ${page.name} → ${page.filename}`);
    } catch (error) {
      console.error(`  ✗ ${page.name}: ${(error as Error).message}`);
    }
  }

  console.log(`\n✓ Generated list page OGP images`);
  console.log(`  Output directory: ${OUTPUT_DIR}`);
}

generateListOGImages().catch((error) => {
  console.error('Failed to generate list page OGP images:', error);
  process.exit(1);
});
