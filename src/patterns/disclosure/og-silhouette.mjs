/**
 * OGP Silhouette for Disclosure Pattern
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
        width: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      },
      children: [
        // Expanded
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 24px',
                    backgroundColor: '#a855f7',
                    borderRadius: '12px 12px 0 0',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: 0,
                          height: 0,
                          borderLeft: '10px solid transparent',
                          borderRight: '10px solid transparent',
                          borderTop: '12px solid rgba(255,255,255,0.8)',
                        },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: 200,
                          height: 20,
                          backgroundColor: 'rgba(255,255,255,0.5)',
                          borderRadius: 4,
                        },
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    padding: 24,
                    backgroundColor: '#1e1e2e',
                    border: '2px solid rgba(168, 85, 247, 0.5)',
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          height: 14,
                          width: '100%',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: 4,
                        },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          height: 14,
                          width: '70%',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: 4,
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Collapsed
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 24px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 12,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 0,
                    height: 0,
                    borderTop: '10px solid transparent',
                    borderBottom: '10px solid transparent',
                    borderLeft: '12px solid rgba(255,255,255,0.6)',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 180,
                    height: 20,
                    backgroundColor: 'rgba(255,255,255,0.4)',
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
