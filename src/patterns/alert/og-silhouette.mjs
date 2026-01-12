/**
 * OGP Silhouette for Alert Pattern
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
        backgroundColor: 'rgba(234, 179, 8, 0.15)',
        border: '3px solid rgba(234, 179, 8, 0.5)',
        borderRadius: 16,
        padding: 32,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 24,
      },
      children: [
        // Icon
        {
          type: 'div',
          props: {
            style: {
              width: 48,
              height: 48,
              backgroundColor: 'rgba(234, 179, 8, 0.6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            },
            children: {
              type: 'div',
              props: {
                style: {
                  width: 6,
                  height: 24,
                  backgroundColor: '#1e1e2e',
                  borderRadius: 3,
                },
              },
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
              gap: 12,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    height: 20,
                    width: '60%',
                    backgroundColor: 'rgba(234, 179, 8, 0.5)',
                    borderRadius: 4,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    height: 16,
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    borderRadius: 4,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    height: 16,
                    width: '80%',
                    backgroundColor: 'rgba(255,255,255,0.3)',
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
