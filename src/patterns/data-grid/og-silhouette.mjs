/**
 * OGP Silhouette for Data Grid Pattern
 *
 * This file defines the visual silhouette used in the OGP image for this pattern.
 * The silhouette is rendered as a background element with low opacity.
 *
 * Design: Grid with checkbox column to represent selectable data grid
 * - Header row with purple accent
 * - Selected row with checkbox checked
 * - Normal rows with unchecked checkboxes
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

  const selectedRowBg = {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderRadius: 4,
  };

  // Checkbox unchecked
  const checkboxUnchecked = {
    type: 'div',
    props: {
      style: {
        width: 24,
        height: 24,
        minWidth: 24,
        border: '2px solid rgba(255,255,255,0.4)',
        borderRadius: 4,
      },
    },
  };

  // Checkbox checked
  const checkboxChecked = {
    type: 'div',
    props: {
      style: {
        width: 24,
        height: 24,
        minWidth: 24,
        backgroundColor: '#a855f7',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: 12,
              height: 6,
              borderLeft: '3px solid white',
              borderBottom: '3px solid white',
              transform: 'rotate(-45deg) translateY(-2px)',
            },
          },
        },
      ],
    },
  };

  // Header checkbox (indeterminate style)
  const headerCheckbox = {
    type: 'div',
    props: {
      style: {
        width: 24,
        height: 24,
        minWidth: 24,
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: 12,
              height: 3,
              backgroundColor: 'white',
              borderRadius: 1,
            },
          },
        },
      ],
    },
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
        height: 380,
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
              alignItems: 'center',
            },
            children: [
              headerCheckbox,
              { type: 'div', props: { style: { ...headerStyle, flex: 2, height: 44 } } },
              { type: 'div', props: { style: { ...headerStyle, flex: 1, height: 44 } } },
              { type: 'div', props: { style: { ...headerStyle, flex: 1, height: 44 } } },
            ],
          },
        },
        // Selected row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
              alignItems: 'center',
              padding: 8,
              ...selectedRowBg,
            },
            children: [
              checkboxChecked,
              {
                type: 'div',
                props: {
                  style: {
                    ...cellStyle,
                    backgroundColor: 'rgba(168, 85, 247, 0.3)',
                    flex: 2,
                    height: 40,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    ...cellStyle,
                    backgroundColor: 'rgba(168, 85, 247, 0.3)',
                    flex: 1,
                    height: 40,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    ...cellStyle,
                    backgroundColor: 'rgba(168, 85, 247, 0.3)',
                    flex: 1,
                    height: 40,
                  },
                },
              },
            ],
          },
        },
        // Normal rows
        ...[0, 1, 2].map(() => ({
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
              alignItems: 'center',
              padding: 8,
            },
            children: [
              checkboxUnchecked,
              { type: 'div', props: { style: { ...cellStyle, flex: 2, height: 40 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 40 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 40 } } },
            ],
          },
        })),
      ],
    },
  };
}
