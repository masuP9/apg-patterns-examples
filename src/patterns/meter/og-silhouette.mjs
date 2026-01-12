/**
 * OGP Silhouette for Meter Pattern
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
        width: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: 48,
      },
      children: [
        // High value
        {
          type: 'div',
          props: {
            style: {
              height: 40,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 20,
              display: 'flex',
            },
            children: {
              type: 'div',
              props: {
                style: {
                  width: '85%',
                  height: '100%',
                  backgroundColor: '#22c55e',
                  borderRadius: 20,
                },
              },
            },
          },
        },
        // Medium value
        {
          type: 'div',
          props: {
            style: {
              height: 40,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 20,
              display: 'flex',
            },
            children: {
              type: 'div',
              props: {
                style: {
                  width: '50%',
                  height: '100%',
                  backgroundColor: '#eab308',
                  borderRadius: 20,
                },
              },
            },
          },
        },
        // Low value
        {
          type: 'div',
          props: {
            style: {
              height: 40,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 20,
              display: 'flex',
              overflow: 'hidden',
            },
            children: {
              type: 'div',
              props: {
                style: {
                  width: '20%',
                  height: '100%',
                  backgroundColor: '#ef4444',
                  borderRadius: 20,
                },
              },
            },
          },
        },
      ],
    },
  };
}
