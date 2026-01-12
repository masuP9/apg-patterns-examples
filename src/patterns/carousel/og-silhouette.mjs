/**
 * OGP Silhouette for Carousel Pattern
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
        gap: 24,
      },
      children: [
        // Prev button
        {
          type: 'div',
          props: {
            style: {
              width: 48,
              height: 48,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            children: {
              type: 'div',
              props: {
                style: {
                  width: 0,
                  height: 0,
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderRight: '14px solid rgba(255,255,255,0.8)',
                },
              },
            },
          },
        },
        // Slides
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 16,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 180,
                    height: 240,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 12,
                    opacity: 0.5,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 220,
                    height: 280,
                    backgroundColor: '#a855f7',
                    borderRadius: 16,
                    border: '3px solid rgba(255,255,255,0.3)',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 180,
                    height: 240,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 12,
                    opacity: 0.5,
                  },
                },
              },
            ],
          },
        },
        // Next button
        {
          type: 'div',
          props: {
            style: {
              width: 48,
              height: 48,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            children: {
              type: 'div',
              props: {
                style: {
                  width: 0,
                  height: 0,
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderLeft: '14px solid rgba(255,255,255,0.8)',
                },
              },
            },
          },
        },
      ],
    },
  };
}
