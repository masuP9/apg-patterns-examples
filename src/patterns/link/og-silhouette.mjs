/**
 * OGP Silhouette for Link Pattern
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
        alignItems: 'center',
        gap: 40,
      },
      children: [
        // Link with underline
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 200,
                    height: 32,
                    backgroundColor: '#a855f7',
                    borderRadius: 4,
                    borderBottom: '3px solid rgba(255,255,255,0.6)',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 40,
                    color: '#a855f7',
                  },
                  children: '\u2197',
                },
              },
            ],
          },
        },
        // Another link
        {
          type: 'div',
          props: {
            style: {
              width: 160,
              height: 28,
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: 4,
              borderBottom: '2px solid rgba(255,255,255,0.3)',
            },
          },
        },
      ],
    },
  };
}
