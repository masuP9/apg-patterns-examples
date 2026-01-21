/**
 * OGP Silhouette for Slider (Multi-Thumb) Pattern
 *
 * This file defines the visual silhouette used in the OGP image for this pattern.
 * The silhouette is rendered as a background element with low opacity.
 *
 * Design: Two range sliders with dual thumbs showing range selection
 * - Track with filled range between thumbs
 * - Two circular thumb indicators per slider
 *
 * @see scripts/generate-pattern-og-images.mjs
 */

/**
 * Render the pattern silhouette
 * @param {Object} baseStyle - Base positioning and opacity styles
 * @returns {Object} Satori-compatible element tree
 */
export function renderSilhouette(baseStyle) {
  // Slider 1: 20% - 65% range
  const slider1StartPercent = 20;
  const slider1EndPercent = 65;

  // Slider 2: 35% - 80% range
  const slider2StartPercent = 35;
  const slider2EndPercent = 80;

  const createMultiThumbSlider = (startPercent, endPercent) => ({
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: 16,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 8,
        position: 'relative',
        display: 'flex',
      },
      children: [
        // Filled range between thumbs
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              left: `${startPercent}%`,
              width: `${endPercent - startPercent}%`,
              height: '100%',
              backgroundColor: '#a855f7',
              borderRadius: 8,
            },
          },
        },
        // Start thumb
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              left: `${startPercent}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 36,
              height: 36,
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              border: '4px solid #a855f7',
            },
          },
        },
        // End thumb
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              left: `${endPercent}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 36,
              height: 36,
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              border: '4px solid #a855f7',
            },
          },
        },
      ],
    },
  });

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
        gap: 80,
      },
      children: [
        // First multi-thumb slider
        createMultiThumbSlider(slider1StartPercent, slider1EndPercent),
        // Second multi-thumb slider
        createMultiThumbSlider(slider2StartPercent, slider2EndPercent),
      ],
    },
  };
}
