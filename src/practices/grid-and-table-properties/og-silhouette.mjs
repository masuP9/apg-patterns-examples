/**
 * OGP Silhouette for Grid and Table Properties Practice
 *
 * Displays a table/grid with headers and cells showing row/column structure.
 */

export function renderSilhouette(baseStyle) {
  const cellStyle = {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
  };

  const headerStyle = {
    backgroundColor: 'rgba(168, 85, 247, 0.5)',
    borderRadius: 4,
  };

  const rowHeaderStyle = {
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
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
        width: 600,
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
            style: { display: 'flex', gap: 4 },
            children: [
              {
                type: 'div',
                props: { style: { ...cellStyle, width: 80, height: 44, opacity: 0 } },
              },
              { type: 'div', props: { style: { ...headerStyle, flex: 1, height: 44 } } },
              { type: 'div', props: { style: { ...headerStyle, flex: 1, height: 44 } } },
              { type: 'div', props: { style: { ...headerStyle, flex: 1, height: 44 } } },
            ],
          },
        },
        // Data rows
        {
          type: 'div',
          props: {
            style: { display: 'flex', gap: 4 },
            children: [
              { type: 'div', props: { style: { ...rowHeaderStyle, width: 80, height: 44 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 44 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 44 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 44 } } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', gap: 4 },
            children: [
              { type: 'div', props: { style: { ...rowHeaderStyle, width: 80, height: 44 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 44 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 44 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 44 } } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', gap: 4 },
            children: [
              { type: 'div', props: { style: { ...rowHeaderStyle, width: 80, height: 44 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 44 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 44 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 44 } } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', gap: 4 },
            children: [
              { type: 'div', props: { style: { ...rowHeaderStyle, width: 80, height: 44 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 44 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 44 } } },
              { type: 'div', props: { style: { ...cellStyle, flex: 1, height: 44 } } },
            ],
          },
        },
      ],
    },
  };
}
