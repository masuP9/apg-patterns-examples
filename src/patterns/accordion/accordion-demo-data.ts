/**
 * Shared demo data for the Accordion pattern.
 */

export const defaultItems = [
  {
    id: 'section1',
    header: 'What is an Accordion?',
    content:
      'An accordion is a vertically stacked set of interactive headings that each reveal a section of content. They are commonly used to reduce the need to scroll when presenting multiple sections of content on a single page.',
    defaultExpanded: true,
  },
  {
    id: 'section2',
    header: 'When to use an Accordion?',
    content:
      'Use accordions when you need to organize content into collapsible sections. This helps reduce visual clutter while keeping information accessible. They are particularly useful for FAQs, settings panels, and navigation menus.',
  },
  {
    id: 'section3',
    header: 'Accessibility Considerations',
    content:
      'Accordions must be keyboard accessible and properly announce their expanded/collapsed state to screen readers. Each header should be a proper heading element, and the panel should be associated with its header via aria-controls and aria-labelledby.',
  },
];

export const multipleItems = [
  {
    id: 'multi1',
    header: 'Section One',
    content:
      'Content for section one. With allowMultiple enabled, multiple sections can be open at the same time.',
  },
  {
    id: 'multi2',
    header: 'Section Two',
    content: 'Content for section two. Try opening this while section one is still open.',
  },
  {
    id: 'multi3',
    header: 'Section Three',
    content: 'Content for section three. All three sections can be expanded simultaneously.',
  },
];

export const disabledItems = [
  {
    id: 'dis1',
    header: 'Available Section',
    content: 'This section can be expanded and collapsed normally.',
  },
  {
    id: 'dis2',
    header: 'Disabled Section',
    content: 'This content is not accessible because the section is disabled.',
    disabled: true,
  },
  {
    id: 'dis3',
    header: 'Another Available Section',
    content:
      'This section can also be expanded. Notice that arrow key navigation skips the disabled section.',
  },
];
