/**
 * OGP Silhouette for Structural Roles Practice
 *
 * Displays document structure with headings and paragraphs.
 */

export function renderSilhouette(baseStyle) {
  const headingStyle = {
    backgroundColor: '#a855f7',
    borderRadius: 4,
  };

  const paragraphStyle = {
    backgroundColor: 'rgba(255,255,255,0.2)',
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
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      },
      children: [
        // H1
        { type: 'div', props: { style: { ...headingStyle, height: 36, width: '80%' } } },
        // Paragraph
        { type: 'div', props: { style: { ...paragraphStyle, height: 14, width: '100%' } } },
        { type: 'div', props: { style: { ...paragraphStyle, height: 14, width: '95%' } } },
        { type: 'div', props: { style: { ...paragraphStyle, height: 14, width: '70%' } } },

        // H2
        {
          type: 'div',
          props: {
            style: { ...headingStyle, height: 28, width: '50%', marginTop: 16, opacity: 0.8 },
          },
        },
        // Paragraph
        { type: 'div', props: { style: { ...paragraphStyle, height: 14, width: '100%' } } },
        { type: 'div', props: { style: { ...paragraphStyle, height: 14, width: '90%' } } },

        // H3
        {
          type: 'div',
          props: {
            style: { ...headingStyle, height: 22, width: '35%', marginTop: 12, opacity: 0.6 },
          },
        },
        // Paragraph
        { type: 'div', props: { style: { ...paragraphStyle, height: 14, width: '100%' } } },
        { type: 'div', props: { style: { ...paragraphStyle, height: 14, width: '85%' } } },
        { type: 'div', props: { style: { ...paragraphStyle, height: 14, width: '60%' } } },
      ],
    },
  };
}
