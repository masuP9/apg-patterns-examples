/**
 * OGP Silhouette for Menu Button Pattern
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
        alignItems: 'flex-start',
      },
      children: [
        // Button
        {
          type: 'div',
          props: {
            style: {
              width: 200,
              height: 60,
              backgroundColor: '#a855f7',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 100,
                    height: 16,
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    borderRadius: 4,
                  },
                },
              },
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
            ],
          },
        },
        // Menu
        {
          type: 'div',
          props: {
            style: {
              width: 240,
              backgroundColor: '#1e1e2e',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: 12,
              marginTop: 8,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    height: 44,
                    backgroundColor: 'rgba(168, 85, 247, 0.3)',
                    borderRadius: 8,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    height: 44,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 8,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    height: 44,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 8,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    height: 44,
                    backgroundColor: 'rgba(255,255,255,0.1)',
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
