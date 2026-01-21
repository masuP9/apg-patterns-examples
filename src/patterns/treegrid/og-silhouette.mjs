/**
 * OGP Silhouette for Tree Grid Pattern
 *
 * This file defines the visual silhouette used in the OGP image for this pattern.
 * The silhouette is rendered as a background element with low opacity.
 *
 * Design: Hierarchical grid combining tree-view and grid patterns
 * - Header row
 * - Expanded parent row with arrow indicator
 * - Indented child rows
 * - Collapsed parent row
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

  // Expanded arrow (pointing down)
  const expandedArrow = {
    type: 'div',
    props: {
      style: {
        width: 0,
        height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderTop: '9px solid #a855f7',
        marginRight: 8,
      },
    },
  };

  // Collapsed arrow (pointing right)
  const collapsedArrow = {
    type: 'div',
    props: {
      style: {
        width: 0,
        height: 0,
        borderTop: '7px solid transparent',
        borderBottom: '7px solid transparent',
        borderLeft: '9px solid rgba(255,255,255,0.5)',
        marginRight: 8,
      },
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
        height: 400,
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
              { type: 'div', props: { style: { ...headerStyle, flex: 3, height: 44 } } },
              { type: 'div', props: { style: { ...headerStyle, flex: 1, height: 44 } } },
              { type: 'div', props: { style: { ...headerStyle, flex: 1, height: 44 } } },
            ],
          },
        },
        // Expanded parent row (selected)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
              alignItems: 'center',
              padding: 8,
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              borderRadius: 4,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    flex: 3,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 8,
                  },
                  children: [
                    expandedArrow,
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: 120,
                          height: 14,
                          backgroundColor: 'rgba(168, 85, 247, 0.5)',
                          borderRadius: 4,
                        },
                      },
                    },
                  ],
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
        // Child rows (indented)
        ...[0, 1].map(() => ({
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
              alignItems: 'center',
              padding: 8,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    flex: 3,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 40,
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: 100,
                          height: 12,
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          borderRadius: 4,
                        },
                      },
                    },
                  ],
                },
              },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 40 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 40 } } },
            ],
          },
        })),
        // Collapsed parent row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 4,
              alignItems: 'center',
              padding: 8,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    flex: 3,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 8,
                  },
                  children: [
                    collapsedArrow,
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: 140,
                          height: 14,
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          borderRadius: 4,
                        },
                      },
                    },
                  ],
                },
              },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 40 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 40 } } },
            ],
          },
        },
      ],
    },
  };
}
