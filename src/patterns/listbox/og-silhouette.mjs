/**
 * OGP Silhouette for Listbox Pattern
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
        width: 400,
        backgroundColor: '#1e1e2e',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: 16,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              height: 56,
              backgroundColor: 'rgba(168, 85, 247, 0.4)',
              borderRadius: 10,
              border: '2px solid #a855f7',
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              height: 56,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 10,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              height: 56,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 10,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              height: 56,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 10,
            },
          },
        },
      ],
    },
  };
}
