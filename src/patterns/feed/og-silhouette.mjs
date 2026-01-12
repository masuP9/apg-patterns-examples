/**
 * OGP Silhouette for Feed Pattern
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
        width: 450,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      },
      children: [0, 1, 2].map((i) => ({
        type: 'div',
        props: {
          style: {
            backgroundColor: '#1e1e2e',
            border: i === 0 ? '2px solid #a855f7' : '2px solid rgba(255,255,255,0.2)',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            gap: 16,
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  width: 60,
                  height: 60,
                  backgroundColor: i === 0 ? '#a855f7' : 'rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  flexShrink: 0,
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 16,
                        width: '60%',
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        borderRadius: 4,
                      },
                    },
                  },
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
                ],
              },
            },
          ],
        },
      })),
    },
  };
}
