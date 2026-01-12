/**
 * OGP Silhouette for Menubar Pattern
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
        display: 'flex',
        flexDirection: 'column',
      },
      children: [
        // Menubar
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
              backgroundColor: '#1e1e2e',
              padding: 8,
              borderRadius: '12px 12px 0 0',
              border: '2px solid rgba(255,255,255,0.2)',
              borderBottom: 'none',
            },
            children: [
              // Active menu item
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    padding: '12px 24px',
                    backgroundColor: '#a855f7',
                    borderRadius: 8,
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        width: 60,
                        height: 14,
                        backgroundColor: 'rgba(255,255,255,0.6)',
                        borderRadius: 4,
                      },
                    },
                  },
                },
              },
              // Other menu items
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    padding: '12px 24px',
                    borderRadius: 8,
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        width: 50,
                        height: 14,
                        backgroundColor: 'rgba(255,255,255,0.3)',
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
                    display: 'flex',
                    padding: '12px 24px',
                    borderRadius: 8,
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        width: 70,
                        height: 14,
                        backgroundColor: 'rgba(255,255,255,0.3)',
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
                    display: 'flex',
                    padding: '12px 24px',
                    borderRadius: 8,
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        width: 55,
                        height: 14,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: 4,
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        // Dropdown menu
        {
          type: 'div',
          props: {
            style: {
              width: 220,
              marginLeft: 8,
              backgroundColor: '#1e1e2e',
              border: '2px solid rgba(168, 85, 247, 0.5)',
              borderRadius: '0 0 12px 12px',
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            },
            children: [
              // Menu items
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    padding: '10px 16px',
                    backgroundColor: 'rgba(168, 85, 247, 0.3)',
                    borderRadius: 6,
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        width: 100,
                        height: 12,
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
                    display: 'flex',
                    padding: '10px 16px',
                    borderRadius: 6,
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        width: 120,
                        height: 12,
                        backgroundColor: 'rgba(255,255,255,0.3)',
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
                    display: 'flex',
                    padding: '10px 16px',
                    borderRadius: 6,
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        width: 80,
                        height: 12,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: 4,
                      },
                    },
                  },
                },
              },
              // Separator
              {
                type: 'div',
                props: {
                  style: {
                    height: 1,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    margin: '4px 0',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    padding: '10px 16px',
                    borderRadius: 6,
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        width: 90,
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
        },
      ],
    },
  };
}
