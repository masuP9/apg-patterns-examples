/**
 * OGP Silhouette for Alert Dialog Pattern
 *
 * This file defines the visual silhouette used in the OGP image for this pattern.
 * The silhouette is rendered as a background element with low opacity.
 *
 * Note: This pattern shares the same silhouette as the Dialog pattern.
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
        height: 380,
        backgroundColor: '#1e1e2e',
        border: '2px solid rgba(255,255,255,0.3)',
        borderRadius: 24,
        display: 'flex',
        flexDirection: 'column',
        padding: 32,
      },
      children: [
        // Title bar
        {
          type: 'div',
          props: {
            style: {
              height: 32,
              width: '50%',
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: 8,
              marginBottom: 24,
            },
          },
        },
        // Content
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    height: 20,
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
                    height: 20,
                    width: '80%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 4,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    height: 20,
                    width: '60%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 4,
                  },
                },
              },
            ],
          },
        },
        // Buttons
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 16,
              justifyContent: 'flex-end',
              marginTop: 24,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 120,
                    height: 48,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 8,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 120,
                    height: 48,
                    backgroundColor: '#a855f7',
                    borderRadius: 8,
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
