/**
 * OGP Silhouette for Slider Pattern
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
        gap: 60,
      },
      children: [
        // Slider track
        {
          type: 'div',
          props: {
            style: {
              height: 16,
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '60%',
                    height: '100%',
                    backgroundColor: '#a855f7',
                    borderRadius: 8,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    position: 'absolute',
                    left: '58%',
                    width: 40,
                    height: 40,
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    border: '4px solid #a855f7',
                  },
                },
              },
            ],
          },
        },
        // Another slider
        {
          type: 'div',
          props: {
            style: {
              height: 16,
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '30%',
                    height: '100%',
                    backgroundColor: '#a855f7',
                    borderRadius: 8,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    position: 'absolute',
                    left: '28%',
                    width: 40,
                    height: 40,
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    border: '4px solid #a855f7',
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
