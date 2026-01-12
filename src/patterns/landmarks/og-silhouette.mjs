/**
 * OGP Silhouette for Landmarks Pattern
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
        width: 700,
        height: 420,
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      },
      children: [
        // Header
        {
          type: 'div',
          props: {
            style: {
              height: 60,
              backgroundColor: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
            },
            children: {
              type: 'div',
              props: {
                style: {
                  width: 120,
                  height: 20,
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  borderRadius: 4,
                },
              },
            },
          },
        },
        // Nav
        {
          type: 'div',
          props: {
            style: {
              height: 44,
              backgroundColor: 'rgba(168, 85, 247, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '0 24px',
            },
            children: [0, 1, 2, 3].map(() => ({
              type: 'div',
              props: {
                style: {
                  width: 60,
                  height: 14,
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  borderRadius: 4,
                },
              },
            })),
          },
        },
        // Main + aside
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              display: 'flex',
            },
            children: [
              // Main
              {
                type: 'div',
                props: {
                  style: {
                    flex: 1,
                    backgroundColor: '#1e1e2e',
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          height: 20,
                          width: '40%',
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          borderRadius: 4,
                        },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          height: 14,
                          width: '100%',
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          borderRadius: 4,
                        },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          height: 14,
                          width: '80%',
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          borderRadius: 4,
                        },
                      },
                    },
                  ],
                },
              },
              // Aside
              {
                type: 'div',
                props: {
                  style: {
                    width: 180,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderLeft: '2px solid rgba(255,255,255,0.1)',
                    padding: 16,
                  },
                },
              },
            ],
          },
        },
        // Footer
        {
          type: 'div',
          props: {
            style: {
              height: 48,
              backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            children: {
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
          },
        },
      ],
    },
  };
}
