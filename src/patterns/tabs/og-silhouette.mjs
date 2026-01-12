/**
 * OGP Silhouette for Tabs Pattern
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
        flexDirection: 'column',
      },
      children: [
        // Tab list
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 160,
                    height: 60,
                    backgroundColor: '#a855f7',
                    borderRadius: '12px 12px 0 0',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 160,
                    height: 60,
                    backgroundColor: '#ffffff',
                    borderRadius: '12px 12px 0 0',
                    opacity: 0.5,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 160,
                    height: 60,
                    backgroundColor: '#ffffff',
                    borderRadius: '12px 12px 0 0',
                    opacity: 0.5,
                  },
                },
              },
            ],
          },
        },
        // Tab panel
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              backgroundColor: '#1e1e2e',
              border: '2px solid rgba(168, 85, 247, 0.5)',
              borderRadius: '0 12px 12px 12px',
            },
          },
        },
      ],
    },
  };
}
