/**
 * OGP Silhouette for Range Related Properties Practice
 *
 * Displays various range widgets: slider, meter, and spinbutton.
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
        width: 550,
        display: 'flex',
        flexDirection: 'column',
        gap: 50,
      },
      children: [
        // Slider
        {
          type: 'div',
          props: {
            style: {
              height: 16,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '65%',
                    height: '100%',
                    backgroundColor: '#a855f7',
                    borderRadius: 8,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    position: 'absolute',
                    left: '62%',
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
        },
        // Meter
        {
          type: 'div',
          props: {
            style: {
              height: 32,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 6,
              overflow: 'hidden',
              display: 'flex',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '75%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #22c55e 0%, #eab308 70%, #ef4444 100%)',
                    borderRadius: 6,
                  },
                },
              },
            ],
          },
        },
        // Spinbutton
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 44,
                    height: 44,
                    backgroundColor: 'rgba(168, 85, 247, 0.4)',
                    borderRadius: 8,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 100,
                    height: 44,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    border: '2px solid rgba(168, 85, 247, 0.5)',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: 44,
                    height: 44,
                    backgroundColor: 'rgba(168, 85, 247, 0.4)',
                    borderRadius: 8,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };
}
