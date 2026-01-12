/**
 * OGP Silhouette for Table Pattern
 *
 * This file defines the visual silhouette used in the OGP image for this pattern.
 * The silhouette is rendered as a background element with low opacity.
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
        width: 600,
        backgroundColor: '#1e1e2e',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
      },
      children: [
        // Header row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              backgroundColor: '#a855f7',
            },
            children: [0, 1, 2, 3].map(() => ({
              type: 'div',
              props: {
                style: {
                  flex: 1,
                  height: 56,
                  borderRight: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      width: 60,
                      height: 14,
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      borderRadius: 4,
                    },
                  },
                },
              },
            })),
          },
        },
        // Data rows
        ...[0, 1, 2].map(() => ({
          type: 'div',
          props: {
            style: {
              display: 'flex',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            },
            children: [0, 1, 2, 3].map(() => ({
              type: 'div',
              props: {
                style: {
                  flex: 1,
                  height: 52,
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      width: 50,
                      height: 12,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: 4,
                    },
                  },
                },
              },
            })),
          },
        })),
      ],
    },
  };
}
