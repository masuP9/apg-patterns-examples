/**
 * OGP Silhouette for Grid Pattern
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
  const cellStyle = {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  };

  const headerStyle = {
    backgroundColor: 'rgba(168, 85, 247, 0.6)',
    borderRadius: 4,
  };

  const selectedStyle = {
    backgroundColor: '#a855f7',
    borderRadius: 4,
  };

  return {
    type: 'div',
    props: {
      style: {
        ...baseStyle,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 650,
        height: 420,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: 16,
        backgroundColor: '#1e1e2e',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: 16,
      },
      children: [
        // Header row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
            },
            children: [
              { type: 'div', props: { style: { ...headerStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...headerStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...headerStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...headerStyle, flex: 1, height: 48 } } },
            ],
          },
        },
        // Data rows
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
            },
            children: [
              { type: 'div', props: { style: { ...selectedStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
            },
            children: [
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
            },
            children: [
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
            },
            children: [
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 48 } } },
            ],
          },
        },
      ],
    },
  };
}
