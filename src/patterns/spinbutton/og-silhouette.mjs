/**
 * OGP Silhouette for Spinbutton Pattern
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
        alignItems: 'center',
        backgroundColor: '#1e1e2e',
        border: '2px solid rgba(255,255,255,0.3)',
        borderRadius: 16,
        overflow: 'hidden',
      },
      children: [
        // Decrement
        {
          type: 'div',
          props: {
            style: {
              width: 80,
              height: 100,
              backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: '2px solid rgba(255,255,255,0.2)',
            },
            children: {
              type: 'div',
              props: {
                style: {
                  width: 32,
                  height: 4,
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  borderRadius: 2,
                },
              },
            },
          },
        },
        // Value
        {
          type: 'div',
          props: {
            style: {
              width: 160,
              height: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            children: {
              type: 'div',
              props: {
                style: {
                  fontSize: 48,
                  fontWeight: 700,
                  color: '#a855f7',
                },
                children: '42',
              },
            },
          },
        },
        // Increment
        {
          type: 'div',
          props: {
            style: {
              width: 80,
              height: 100,
              backgroundColor: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeft: '2px solid rgba(255,255,255,0.2)',
            },
            children: {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 32,
                        height: 4,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                        position: 'absolute',
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 4,
                        height: 32,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  };
}
