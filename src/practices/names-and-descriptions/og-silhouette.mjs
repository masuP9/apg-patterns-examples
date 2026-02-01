/**
 * OGP Silhouette for Names and Descriptions Practice
 *
 * Displays labeled form fields with visible labels and descriptions.
 */

export function renderSilhouette(baseStyle) {
  const labelStyle = {
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 4,
    marginBottom: 6,
  };

  const inputStyle = {
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    border: '2px solid rgba(168, 85, 247, 0.5)',
  };

  const descStyle = {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginTop: 6,
    width: '70%',
  };

  return {
    type: 'div',
    props: {
      style: {
        ...baseStyle,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      },
      children: [
        // Field 1 with label
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column' },
            children: [
              { type: 'div', props: { style: { ...labelStyle, width: 120 } } },
              { type: 'div', props: { style: inputStyle } },
              { type: 'div', props: { style: descStyle } },
            ],
          },
        },
        // Field 2 with label
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column' },
            children: [
              { type: 'div', props: { style: { ...labelStyle, width: 80 } } },
              { type: 'div', props: { style: inputStyle } },
              { type: 'div', props: { style: { ...descStyle, width: '50%' } } },
            ],
          },
        },
        // Icon button with aria-label indicator
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 48,
                    height: 48,
                    backgroundColor: '#a855f7',
                    borderRadius: 8,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    height: 12,
                    width: 160,
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    borderRadius: 4,
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
