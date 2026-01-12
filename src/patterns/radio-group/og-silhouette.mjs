/**
 * OGP Silhouette for Radio Group Pattern
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
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
      },
      children: [
        // Selected
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 48,
                    height: 48,
                    border: '3px solid #a855f7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  children: {
                    type: 'div',
                    props: {
                      style: {
                        width: 24,
                        height: 24,
                        backgroundColor: '#a855f7',
                        borderRadius: '50%',
                      },
                    },
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
        // Unselected
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 48,
                    height: 48,
                    border: '3px solid rgba(255,255,255,0.5)',
                    borderRadius: '50%',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 160,
                    height: 20,
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    borderRadius: 4,
                  },
                },
              },
            ],
          },
        },
        // Unselected
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 48,
                    height: 48,
                    border: '3px solid rgba(255,255,255,0.5)',
                    borderRadius: '50%',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 200,
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
