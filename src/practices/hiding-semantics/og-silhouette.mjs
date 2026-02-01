/**
 * OGP Silhouette for Hiding Semantics Practice
 *
 * Displays elements with some appearing hidden/transparent to represent
 * the concept of hiding semantics with the presentation role.
 */

export function renderSilhouette(baseStyle) {
  const visibleStyle = {
    backgroundColor: 'rgba(168, 85, 247, 0.6)',
    borderRadius: 8,
    border: '2px solid rgba(168, 85, 247, 0.8)',
  };

  const hiddenStyle = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    border: '2px dashed rgba(255,255,255,0.2)',
  };

  return {
    type: 'div',
    props: {
      style: {
        ...baseStyle,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 350,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: 24,
        backgroundColor: '#1e1e2e',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: 16,
      },
      children: [
        // Row with visible and hidden elements
        {
          type: 'div',
          props: {
            style: { display: 'flex', gap: 16 },
            children: [
              { type: 'div', props: { style: { ...visibleStyle, flex: 1, height: 60 } } },
              { type: 'div', props: { style: { ...hiddenStyle, flex: 1, height: 60 } } },
              { type: 'div', props: { style: { ...visibleStyle, flex: 1, height: 60 } } },
            ],
          },
        },
        // Tablist example - visible tabs but hidden tablist wrapper
        {
          type: 'div',
          props: {
            style: {
              ...hiddenStyle,
              padding: 12,
              display: 'flex',
              gap: 8,
            },
            children: [
              { type: 'div', props: { style: { ...visibleStyle, width: 100, height: 40 } } },
              {
                type: 'div',
                props: { style: { ...visibleStyle, width: 100, height: 40, opacity: 0.5 } },
              },
              {
                type: 'div',
                props: { style: { ...visibleStyle, width: 100, height: 40, opacity: 0.5 } },
              },
            ],
          },
        },
        // Grid example - visible cells but hidden row wrappers
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: 8 },
            children: [
              {
                type: 'div',
                props: {
                  style: { ...hiddenStyle, display: 'flex', gap: 8, padding: 8 },
                  children: [
                    { type: 'div', props: { style: { ...visibleStyle, flex: 1, height: 36 } } },
                    { type: 'div', props: { style: { ...visibleStyle, flex: 1, height: 36 } } },
                    { type: 'div', props: { style: { ...visibleStyle, flex: 1, height: 36 } } },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: { ...hiddenStyle, display: 'flex', gap: 8, padding: 8 },
                  children: [
                    { type: 'div', props: { style: { ...visibleStyle, flex: 1, height: 36 } } },
                    { type: 'div', props: { style: { ...visibleStyle, flex: 1, height: 36 } } },
                    { type: 'div', props: { style: { ...visibleStyle, flex: 1, height: 36 } } },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}
