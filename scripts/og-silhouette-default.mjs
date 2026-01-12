/**
 * Default OGP Silhouette (Fallback)
 *
 * This file defines the default visual silhouette used in OGP images
 * for patterns that don't have a custom silhouette design.
 *
 * @see scripts/generate-pattern-og-images.mjs
 */

/**
 * Render the default pattern silhouette
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
        height: 300,
        backgroundColor: 'rgba(168, 85, 247, 0.3)',
        borderRadius: 24,
        border: '3px solid rgba(168, 85, 247, 0.5)',
      },
    },
  };
}
