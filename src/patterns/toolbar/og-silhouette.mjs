/**
 * OGP Silhouette for Toolbar Pattern
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
        backgroundColor: '#1e1e2e',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: 16,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      },
      children: [
        // Button group 1
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 56,
                    height: 56,
                    backgroundColor: '#a855f7',
                    borderRadius: 8,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 56,
                    height: 56,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 8,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 56,
                    height: 56,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 8,
                  },
                },
              },
            ],
          },
        },
        // Separator
        {
          type: 'div',
          props: {
            style: {
              width: 2,
              height: 40,
              backgroundColor: 'rgba(255,255,255,0.2)',
            },
          },
        },
        // Button group 2
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 56,
                    height: 56,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 8,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 56,
                    height: 56,
                    backgroundColor: '#a855f7',
                    borderRadius: 8,
                  },
                },
              },
            ],
          },
        },
        // Separator
        {
          type: 'div',
          props: {
            style: {
              width: 2,
              height: 40,
              backgroundColor: 'rgba(255,255,255,0.2)',
            },
          },
        },
        // Single button
        {
          type: 'div',
          props: {
            style: {
              width: 56,
              height: 56,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 8,
            },
          },
        },
      ],
    },
  };
}
