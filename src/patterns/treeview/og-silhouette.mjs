/**
 * OGP Silhouette for Tree View Pattern
 *
 * This file defines the visual silhouette used in the OGP image for this pattern.
 * The silhouette is rendered as a background element with low opacity.
 *
 * Note: This file corresponds to 'tree-view' in the generator script.
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
        width: 400,
        backgroundColor: '#1e1e2e',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      },
      children: [
        // Root expanded
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              backgroundColor: 'rgba(168, 85, 247, 0.2)',
              borderRadius: 8,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '10px solid #a855f7',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 24,
                    height: 24,
                    backgroundColor: '#a855f7',
                    borderRadius: 4,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 120,
                    height: 14,
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    borderRadius: 4,
                  },
                },
              },
            ],
          },
        },
        // Children
        ...[0, 1].map(() => ({
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              paddingLeft: 48,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 20,
                    height: 20,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    borderRadius: 4,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 100,
                    height: 12,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    borderRadius: 4,
                  },
                },
              },
            ],
          },
        })),
        // Collapsed sibling
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 12,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 0,
                    height: 0,
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    borderLeft: '10px solid rgba(255,255,255,0.5)',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 24,
                    height: 24,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    borderRadius: 4,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 140,
                    height: 14,
                    backgroundColor: 'rgba(255,255,255,0.3)',
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
