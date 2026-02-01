/**
 * OGP Silhouette for Keyboard Interface Practice
 *
 * Displays keyboard keys representing common keyboard navigation.
 */

export function renderSilhouette(baseStyle) {
  const keyStyle = {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    border: '2px solid rgba(255,255,255,0.3)',
  };

  const activeKeyStyle = {
    ...keyStyle,
    backgroundColor: 'rgba(168, 85, 247, 0.4)',
    border: '2px solid #a855f7',
  };

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
        gap: 12,
        alignItems: 'center',
      },
      children: [
        // Tab key row
        {
          type: 'div',
          props: {
            style: { display: 'flex', gap: 8 },
            children: [
              { type: 'div', props: { style: { ...activeKeyStyle, width: 100, height: 50 } } },
            ],
          },
        },
        // Arrow keys row
        {
          type: 'div',
          props: {
            style: { display: 'flex', gap: 8, marginTop: 20 },
            children: [
              { type: 'div', props: { style: { ...keyStyle, width: 50, height: 50 } } },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: 8 },
                  children: [
                    { type: 'div', props: { style: { ...keyStyle, width: 50, height: 50 } } },
                    { type: 'div', props: { style: { ...activeKeyStyle, width: 50, height: 50 } } },
                  ],
                },
              },
              { type: 'div', props: { style: { ...keyStyle, width: 50, height: 50 } } },
            ],
          },
        },
        // Enter and Space row
        {
          type: 'div',
          props: {
            style: { display: 'flex', gap: 12, marginTop: 20 },
            children: [
              { type: 'div', props: { style: { ...keyStyle, width: 120, height: 50 } } },
              { type: 'div', props: { style: { ...keyStyle, width: 180, height: 50 } } },
              { type: 'div', props: { style: { ...keyStyle, width: 80, height: 50 } } },
            ],
          },
        },
      ],
    },
  };
}
