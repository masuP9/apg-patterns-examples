/**
 * OGP Silhouette for Accordion Pattern
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
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      },
      children: [
        // Expanded section
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
                    height: 60,
                    backgroundColor: '#a855f7',
                    borderRadius: '12px 12px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 24,
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        width: 200,
                        height: 16,
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        borderRadius: 4,
                      },
                    },
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    height: 140,
                    backgroundColor: '#1e1e2e',
                    border: '2px solid rgba(168, 85, 247, 0.5)',
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
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
                          height: 12,
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
                          height: 12,
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
        // Collapsed sections
        {
          type: 'div',
          props: {
            style: {
              height: 60,
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: 12,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              height: 60,
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: 12,
            },
          },
        },
      ],
    },
  };
}
