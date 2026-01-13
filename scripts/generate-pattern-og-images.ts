/**
 * Pattern-specific OGP Image Generator
 *
 * Generates individual Open Graph images for each pattern.
 * Each image features a large silhouette of the pattern component
 * with the pattern name and site name overlaid.
 *
 * Pattern definitions are imported from src/lib/patterns.ts.
 * Silhouette designs are loaded from each pattern's og-silhouette.mjs file.
 */

import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { getAvailablePatterns, type Pattern } from '../src/lib/patterns';

const require = createRequire(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const OUTPUT_DIR = join(PROJECT_ROOT, 'public/og-images/patterns');
const PATTERNS_DIR = join(PROJECT_ROOT, 'src/patterns');

// OGP image dimensions (recommended size)
const WIDTH = 1200;
const HEIGHT = 630;

// Site name displayed below pattern name
const SITE_NAME = 'APG Patterns Examples';

type SilhouetteRenderer = (baseStyle: Record<string, unknown>) => unknown;

/**
 * Get pattern directory name
 * Pattern IDs directly map to directory names
 */
function getPatternDirName(patternId: string): string {
  return patternId;
}

/**
 * Load silhouette renderer for a pattern
 * Falls back to default silhouette if not found
 */
async function loadSilhouetteRenderer(patternId: string): Promise<SilhouetteRenderer> {
  const dirName = getPatternDirName(patternId);
  const silhouettePath = join(PATTERNS_DIR, dirName, 'og-silhouette.mjs');

  if (existsSync(silhouettePath)) {
    try {
      const module = await import(silhouettePath);
      return module.renderSilhouette;
    } catch (error) {
      console.warn(
        `  Warning: Failed to load silhouette for ${patternId}: ${(error as Error).message}`
      );
    }
  }

  // Fall back to default silhouette
  const defaultModule = await import('./og-silhouette-default.mjs');
  return defaultModule.renderSilhouette;
}

/**
 * Render pattern silhouette using the loaded renderer
 */
function renderPatternSilhouette(renderFn: SilhouetteRenderer): unknown {
  const baseStyle = {
    position: 'absolute',
    opacity: 0.12,
  };
  return renderFn(baseStyle);
}

/**
 * Create OGP image template for a specific pattern
 */
function createPatternTemplate(pattern: Pattern, silhouetteElement: unknown) {
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
        // Pattern silhouette (background)
        silhouetteElement,

        // Text content (overlaid on silhouette)
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
              // Pattern name
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
                  children: pattern.name,
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

async function generatePatternOGImages() {
  console.log('Generating pattern OGP images...\n');

  // Get available patterns from patterns.ts
  const patterns = getAvailablePatterns();
  console.log(`Found ${patterns.length} available patterns\n`);

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load fonts
  const fontRegular = loadFont();
  const fontBold = loadFontBold();

  let successCount = 0;
  let errorCount = 0;

  for (const pattern of patterns) {
    try {
      // Load silhouette renderer for this pattern
      const renderSilhouette = await loadSilhouetteRenderer(pattern.id);
      const silhouetteElement = renderPatternSilhouette(renderSilhouette);

      const template = createPatternTemplate(pattern, silhouetteElement);

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
      const outputPath = join(OUTPUT_DIR, `${pattern.id}.png`);
      writeFileSync(outputPath, pngBuffer);

      console.log(`  ✓ ${pattern.name} → ${pattern.id}.png`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ ${pattern.name}: ${(error as Error).message}`);
      errorCount++;
    }
  }

  console.log(`\n✓ Generated ${successCount} pattern OGP images`);
  if (errorCount > 0) {
    console.log(`✗ Failed: ${errorCount}`);
  }
  console.log(`  Output directory: ${OUTPUT_DIR}`);
}

generatePatternOGImages().catch((error) => {
  console.error('Failed to generate pattern OGP images:', error);
  process.exit(1);
});
