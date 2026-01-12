/**
 * OGP Silhouette for Breadcrumb Pattern
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
        gap: 16,
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: 80,
              height: 24,
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: 4,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: 32,
              color: 'rgba(255,255,255,0.5)',
            },
            children: '/',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              width: 120,
              height: 24,
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: 4,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: 32,
              color: 'rgba(255,255,255,0.5)',
            },
            children: '/',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              width: 160,
              height: 24,
              backgroundColor: '#a855f7',
              borderRadius: 4,
            },
          },
        },
      ],
    },
  };
}
