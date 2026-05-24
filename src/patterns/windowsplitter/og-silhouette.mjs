/**
 * OGP Silhouette for Window Splitter Pattern
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
        height: 400,
        display: 'flex',
        backgroundColor: '#1e1e2e',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: 16,
        overflow: 'hidden',
      },
      children: [
        // Left pane
        {
          type: 'div',
          props: {
            style: {
              width: 280,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            },
            children: [
              // Header
              {
                type: 'div',
                props: {
                  style: {
                    width: 120,
                    height: 16,
                    backgroundColor: 'rgba(168, 85, 247, 0.5)',
                    borderRadius: 4,
                  },
                },
              },
              // Content lines
              {
                type: 'div',
                props: {
                  style: {
                    width: '100%',
                    height: 12,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 4,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: '80%',
                    height: 12,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 4,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: '90%',
                    height: 12,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 4,
                  },
                },
              },
            ],
          },
        },
        // Splitter handle
        {
          type: 'div',
          props: {
            style: {
              width: 12,
              backgroundColor: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'col-resize',
            },
            children: [
              // Grip dots
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: 4,
                          height: 4,
                          backgroundColor: 'rgba(255,255,255,0.6)',
                          borderRadius: '50%',
                        },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: 4,
                          height: 4,
                          backgroundColor: 'rgba(255,255,255,0.6)',
                          borderRadius: '50%',
                        },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: 4,
                          height: 4,
                          backgroundColor: 'rgba(255,255,255,0.6)',
                          borderRadius: '50%',
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Right pane
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            },
            children: [
              // Header
              {
                type: 'div',
                props: {
                  style: {
                    width: 160,
                    height: 16,
                    backgroundColor: 'rgba(168, 85, 247, 0.5)',
                    borderRadius: 4,
                  },
                },
              },
              // Content area
              {
                type: 'div',
                props: {
                  style: {
                    flex: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '100%',
                          height: 12,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: 4,
                        },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '70%',
                          height: 12,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: 4,
                        },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '85%',
                          height: 12,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: 4,
                        },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '60%',
                          height: 12,
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
      ],
    },
  };
}
