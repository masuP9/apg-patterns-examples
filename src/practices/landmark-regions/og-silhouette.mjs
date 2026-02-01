/**
 * OGP Silhouette for Landmark Regions Practice
 *
 * Displays a page layout with header, nav, main, aside, and footer landmarks.
 */

export function renderSilhouette(baseStyle) {
  const landmarkStyle = {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    border: '2px solid rgba(168, 85, 247, 0.4)',
  };

  return {
    type: 'div',
    props: {
      style: {
        ...baseStyle,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        height: 450,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 16,
        backgroundColor: '#1e1e2e',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: 16,
      },
      children: [
        // Header
        {
          type: 'div',
          props: {
            style: {
              ...landmarkStyle,
              height: 60,
            },
          },
        },
        // Nav + Main + Aside row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: 8,
              flex: 1,
            },
            children: [
              // Nav
              {
                type: 'div',
                props: {
                  style: {
                    ...landmarkStyle,
                    width: 120,
                  },
                },
              },
              // Main
              {
                type: 'div',
                props: {
                  style: {
                    ...landmarkStyle,
                    flex: 1,
                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  },
                },
              },
              // Aside
              {
                type: 'div',
                props: {
                  style: {
                    ...landmarkStyle,
                    width: 140,
                  },
                },
              },
            ],
          },
        },
        // Footer
        {
          type: 'div',
          props: {
            style: {
              ...landmarkStyle,
              height: 50,
            },
          },
        },
      ],
    },
  };
}
