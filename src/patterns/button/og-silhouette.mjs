/**
 * OGP Silhouette for Button Pattern
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
        gap: 40,
        alignItems: 'center',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: 320,
              height: 80,
              backgroundColor: '#a855f7',
              borderRadius: 16,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              width: 280,
              height: 70,
              backgroundColor: '#ffffff',
              borderRadius: 14,
              opacity: 0.6,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              width: 240,
              height: 60,
              border: '3px solid #a855f7',
              borderRadius: 12,
            },
          },
        },
      ],
    },
  };
}
