/**
 * OGP Image Generator
 *
 * Generates an Open Graph image for the site using Satori and Sharp.
 * The design features a dark gradient background with faded component
 * silhouettes representing the APG patterns.
 */

import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '../public/og-image.png');

// OGP image dimensions (recommended size)
const WIDTH = 1200;
const HEIGHT = 630;

// Component silhouettes for background decoration
const componentShapes = [
  // Toggle buttons
  { type: 'toggle', x: 80, y: 120, width: 60, height: 28 },
  { type: 'toggle', x: 1040, y: 480, width: 60, height: 28 },

  // Tabs
  { type: 'tabs', x: 900, y: 80, width: 200, height: 36 },
  { type: 'tabs', x: 100, y: 520, width: 180, height: 36 },

  // Buttons
  { type: 'button', x: 200, y: 60, width: 80, height: 32 },
  { type: 'button', x: 1000, y: 550, width: 100, height: 32 },
  { type: 'button', x: 60, y: 400, width: 70, height: 32 },

  // Menu/Dropdown
  { type: 'menu', x: 950, y: 200, width: 140, height: 120 },
  { type: 'menu', x: 50, y: 250, width: 120, height: 100 },

  // Dialog
  { type: 'dialog', x: 850, y: 380, width: 160, height: 100 },

  // Checkbox
  { type: 'checkbox', x: 300, y: 100, width: 20, height: 20 },
  { type: 'checkbox', x: 1100, y: 300, width: 20, height: 20 },
  { type: 'checkbox', x: 180, y: 450, width: 20, height: 20 },

  // Slider
  { type: 'slider', x: 400, y: 50, width: 120, height: 8 },
  { type: 'slider', x: 750, y: 560, width: 100, height: 8 },

  // Radio
  { type: 'radio', x: 500, y: 90, width: 80, height: 20 },
  { type: 'radio', x: 100, y: 580, width: 70, height: 20 },
];

function renderComponent(shape) {
  const baseStyle = {
    position: 'absolute',
    left: shape.x,
    top: shape.y,
    opacity: 0.08,
  };

  switch (shape.type) {
    case 'toggle':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            width: shape.width,
            height: shape.height,
            backgroundColor: '#ffffff',
            borderRadius: shape.height / 2,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 4,
          },
          children: {
            type: 'div',
            props: {
              style: {
                width: shape.height - 8,
                height: shape.height - 8,
                backgroundColor: '#a855f7',
                borderRadius: '50%',
              },
            },
          },
        },
      };

    case 'tabs':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            width: shape.width,
            height: shape.height,
            display: 'flex',
            gap: 2,
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  flex: 1,
                  backgroundColor: '#a855f7',
                  borderRadius: '6px 6px 0 0',
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  flex: 1,
                  backgroundColor: '#ffffff',
                  borderRadius: '6px 6px 0 0',
                  opacity: 0.5,
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  flex: 1,
                  backgroundColor: '#ffffff',
                  borderRadius: '6px 6px 0 0',
                  opacity: 0.5,
                },
              },
            },
          ],
        },
      };

    case 'button':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            width: shape.width,
            height: shape.height,
            backgroundColor: '#a855f7',
            borderRadius: 6,
          },
        },
      };

    case 'menu':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            width: shape.width,
            height: shape.height,
            backgroundColor: '#1e1e2e',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            padding: 8,
            gap: 4,
          },
          children: [0, 1, 2].map(() => ({
            type: 'div',
            props: {
              style: {
                height: 20,
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: 4,
              },
            },
          })),
        },
      };

    case 'dialog':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            width: shape.width,
            height: shape.height,
            backgroundColor: '#1e1e2e',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            padding: 12,
            gap: 8,
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  height: 16,
                  width: '60%',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  borderRadius: 4,
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 4,
                },
              },
            },
          ],
        },
      };

    case 'checkbox':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            width: shape.width,
            height: shape.height,
            backgroundColor: '#a855f7',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          children: {
            type: 'div',
            props: {
              style: {
                width: 10,
                height: 6,
                borderLeft: '2px solid white',
                borderBottom: '2px solid white',
                transform: 'rotate(-45deg)',
                marginTop: -2,
              },
            },
          },
        },
      };

    case 'slider':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            width: shape.width,
            height: shape.height,
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  width: '60%',
                  height: '100%',
                  backgroundColor: '#a855f7',
                  borderRadius: 4,
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  width: 16,
                  height: 16,
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                  marginLeft: -8,
                },
              },
            },
          ],
        },
      };

    case 'radio':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            width: shape.width,
            height: shape.height,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  width: 16,
                  height: 16,
                  border: '2px solid #a855f7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      width: 8,
                      height: 8,
                      backgroundColor: '#a855f7',
                      borderRadius: '50%',
                    },
                  },
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  flex: 1,
                  height: 8,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: 4,
                },
              },
            },
          ],
        },
      };

    default:
      return null;
  }
}

// Main OGP image template
const ogImageTemplate = {
  type: 'div',
  props: {
    style: {
      width: WIDTH,
      height: HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
      position: 'relative',
      fontFamily: 'Inter',
    },
    children: [
      // Background component shapes
      ...componentShapes.map(renderComponent).filter(Boolean),

      // Main content container
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 40,
          },
          children: [
            // Title
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 56,
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: 16,
                  letterSpacing: '-0.02em',
                },
                children: 'APG Patterns Examples',
              },
            },
            // Description
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 24,
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: 32,
                  maxWidth: 700,
                  lineHeight: 1.4,
                },
                children: 'Accessible component patterns for React, Vue, Svelte & Astro',
              },
            },
          ],
        },
      },
    ],
  },
};

function loadFont() {
  // Load Inter font from @fontsource/inter package
  const fontPath = require.resolve('@fontsource/inter/files/inter-latin-400-normal.woff');
  const fontData = readFileSync(fontPath);

  return {
    name: 'Inter',
    data: fontData,
    weight: 400,
    style: 'normal',
  };
}

function loadFontBold() {
  // Load Inter Bold font from @fontsource/inter package
  const fontPath = require.resolve('@fontsource/inter/files/inter-latin-700-normal.woff');
  const fontData = readFileSync(fontPath);

  return {
    name: 'Inter',
    data: fontData,
    weight: 700,
    style: 'normal',
  };
}

async function generateOGImage() {
  console.log('Generating OGP image...');

  // Load fonts
  const fontRegular = loadFont();
  const fontBold = loadFontBold();

  // Generate SVG with Satori
  const svg = await satori(ogImageTemplate, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [fontRegular, fontBold],
  });

  // Convert SVG to PNG with Sharp
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  // Ensure output directory exists
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

  // Write the PNG file
  writeFileSync(OUTPUT_PATH, pngBuffer);

  console.log(`✓ OGP image generated: ${OUTPUT_PATH}`);
}

generateOGImage().catch((error) => {
  console.error('Failed to generate OGP image:', error);
  process.exit(1);
});
