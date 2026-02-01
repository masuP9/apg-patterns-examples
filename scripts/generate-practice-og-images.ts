/**
 * Practice-specific OGP Image Generator
 *
 * Generates individual Open Graph images for each practice.
 * Each image features a large silhouette representing the practice concept
 * with the practice name and site name overlaid.
 *
 * Practice definitions are imported from src/lib/practices.ts.
 * Silhouette designs are loaded from each practice's og-silhouette.mjs file.
 */

import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { getPractices, type Practice } from '../src/lib/practices';

const require = createRequire(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const OUTPUT_DIR = join(PROJECT_ROOT, 'public/og-images/practices');
const PRACTICES_DIR = join(PROJECT_ROOT, 'src/practices');

// OGP image dimensions (recommended size)
const WIDTH = 1200;
const HEIGHT = 630;

// Site name displayed below practice name
const SITE_NAME = 'APG Patterns Examples';

type SilhouetteRenderer = (baseStyle: Record<string, unknown>) => unknown;

/**
 * Load silhouette renderer for a practice
 * Falls back to default silhouette if not found
 */
async function loadSilhouetteRenderer(practiceId: string): Promise<SilhouetteRenderer> {
  const silhouettePath = join(PRACTICES_DIR, practiceId, 'og-silhouette.mjs');

  if (existsSync(silhouettePath)) {
    try {
      const module = await import(silhouettePath);
      return module.renderSilhouette;
    } catch (error) {
      console.warn(
        `  Warning: Failed to load silhouette for ${practiceId}: ${(error as Error).message}`
      );
    }
  }

  // Fall back to default silhouette
  const defaultModule = await import('./og-silhouette-default.mjs');
  return defaultModule.renderSilhouette;
}

/**
 * Render practice silhouette using the loaded renderer
 */
function renderPracticeSilhouette(renderFn: SilhouetteRenderer): unknown {
  const baseStyle = {
    position: 'absolute',
    opacity: 0.12,
  };
  return renderFn(baseStyle);
}

/**
 * Create OGP image template for a specific practice
 */
function createPracticeTemplate(practice: Practice, silhouetteElement: unknown) {
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
        // Practice silhouette (background)
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
              padding: '0 60px',
            },
            children: [
              // Practice name
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 56,
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: 16,
                    letterSpacing: '-0.02em',
                    textShadow: '0 4px 24px rgba(0, 0, 0, 0.5)',
                  },
                  children: practice.name,
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

async function generatePracticeOGImages() {
  console.log('Generating practice OGP images...\n');

  // Get practices from practices.ts
  const practices = getPractices();
  console.log(`Found ${practices.length} available practices\n`);

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load fonts
  const fontRegular = loadFont();
  const fontBold = loadFontBold();

  let successCount = 0;
  let errorCount = 0;

  for (const practice of practices) {
    try {
      // Load silhouette renderer for this practice
      const renderSilhouette = await loadSilhouetteRenderer(practice.id);
      const silhouetteElement = renderPracticeSilhouette(renderSilhouette);

      const template = createPracticeTemplate(practice, silhouetteElement);

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
      const outputPath = join(OUTPUT_DIR, `${practice.id}.png`);
      writeFileSync(outputPath, pngBuffer);

      console.log(`  ✓ ${practice.name} → ${practice.id}.png`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ ${practice.name}: ${(error as Error).message}`);
      errorCount++;
    }
  }

  console.log(`\n✓ Generated ${successCount} practice OGP images`);
  if (errorCount > 0) {
    console.log(`✗ Failed: ${errorCount}`);
  }
  console.log(`  Output directory: ${OUTPUT_DIR}`);
}

generatePracticeOGImages().catch((error) => {
  console.error('Failed to generate practice OGP images:', error);
  process.exit(1);
});
