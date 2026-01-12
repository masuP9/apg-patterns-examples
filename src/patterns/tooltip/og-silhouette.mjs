/**
 * OGP Silhouette for Tooltip Pattern
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
        gap: 16,
      },
      children: [
        // Tooltip
        {
          type: 'div',
          props: {
            style: {
              backgroundColor: '#1e1e2e',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: 12,
              padding: '16px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            },
            children: {
              type: 'div',
              props: {
                style: {
                  width: 200,
                  height: 20,
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  borderRadius: 4,
                },
              },
            },
          },
        },
        // Arrow
        {
          type: 'div',
          props: {
            style: {
              width: 0,
              height: 0,
              borderLeft: '16px solid transparent',
              borderRight: '16px solid transparent',
              borderTop: '16px solid rgba(255,255,255,0.3)',
              marginTop: -16,
            },
          },
        },
        // Trigger element
        {
          type: 'div',
          props: {
            style: {
              width: 180,
              height: 60,
              backgroundColor: '#a855f7',
              borderRadius: 12,
              marginTop: 16,
            },
          },
        },
      ],
    },
  };
}
