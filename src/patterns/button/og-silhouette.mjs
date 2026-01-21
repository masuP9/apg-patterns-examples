/**
 * OGP Silhouette for Button Pattern
 *
 * This file defines the visual silhouette used in the OGP image for this pattern.
 * The silhouette is rendered as a background element with low opacity.
 *
 * Design: Three button variations stacked vertically
 * - Filled button (solid background)
 * - Outline button (border only)
 * - Text button (subtle/ghost style)
 *
 * @see scripts/generate-pattern-og-images.mjs
 */

/**
 * Render the pattern silhouette
 * @param {Object} baseStyle - Base positioning and opacity styles
 * @returns {Object} Satori-compatible element tree
 */
export function renderSilhouette(baseStyle) {
  return {
    type: 'div',
    props: {
      style: {
        ...baseStyle,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        alignItems: 'center',
      },
      children: [
        // Filled button (primary)
        {
          type: 'div',
          props: {
            style: {
              width: 280,
              height: 64,
              backgroundColor: '#a855f7',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 140,
                    height: 16,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderRadius: 4,
                  },
                },
              },
            ],
          },
        },
        // Outline button (secondary)
        {
          type: 'div',
          props: {
            style: {
              width: 280,
              height: 64,
              border: '3px solid #a855f7',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 120,
                    height: 16,
                    backgroundColor: '#a855f7',
                    borderRadius: 4,
                  },
                },
              },
            ],
          },
        },
        // Text button (ghost/tertiary)
        {
          type: 'div',
          props: {
            style: {
              width: 280,
              height: 64,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 100,
                    height: 16,
                    backgroundColor: 'rgba(168, 85, 247, 0.5)',
                    borderRadius: 4,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };
}
