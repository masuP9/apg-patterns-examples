/**
 * Pattern-specific OGP Image Generator
 *
 * Generates individual Open Graph images for each pattern.
 * Each image features a large silhouette of the pattern component
 * with the pattern name and site name overlaid.
 */

import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '../public/og-images/patterns');

// OGP image dimensions (recommended size)
const WIDTH = 1200;
const HEIGHT = 630;

// Site name displayed below pattern name
const SITE_NAME = 'APG Patterns Examples';

/**
 * Pattern definitions (imported from patterns.ts logic)
 * Only including available patterns
 */
const PATTERNS = [
  { id: 'accordion', name: 'Accordion' },
  { id: 'alert', name: 'Alert' },
  { id: 'alert-dialog', name: 'Alert Dialog' },
  { id: 'breadcrumb', name: 'Breadcrumb' },
  { id: 'button', name: 'Button' },
  { id: 'carousel', name: 'Carousel' },
  { id: 'checkbox', name: 'Checkbox' },
  { id: 'combobox', name: 'Combobox' },
  { id: 'dialog', name: 'Dialog' },
  { id: 'disclosure', name: 'Disclosure' },
  { id: 'feed', name: 'Feed' },
  { id: 'landmarks', name: 'Landmarks' },
  { id: 'link', name: 'Link' },
  { id: 'listbox', name: 'Listbox' },
  { id: 'menu-button', name: 'Menu Button' },
  { id: 'meter', name: 'Meter' },
  { id: 'radio-group', name: 'Radio Group' },
  { id: 'slider', name: 'Slider' },
  { id: 'spinbutton', name: 'Spinbutton' },
  { id: 'switch', name: 'Switch' },
  { id: 'table', name: 'Table' },
  { id: 'tabs', name: 'Tabs' },
  { id: 'toolbar', name: 'Toolbar' },
  { id: 'tooltip', name: 'Tooltip' },
  { id: 'tree-view', name: 'Tree View' },
];

/**
 * Render large silhouette for each pattern type
 * These are displayed as background elements with low opacity
 */
function renderPatternSilhouette(patternId) {
  const baseStyle = {
    position: 'absolute',
    opacity: 0.12,
  };

  switch (patternId) {
    case 'tabs':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 700,
            height: 400,
            display: 'flex',
            flexDirection: 'column',
          },
          children: [
            // Tab list
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  gap: 4,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 160,
                        height: 60,
                        backgroundColor: '#a855f7',
                        borderRadius: '12px 12px 0 0',
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 160,
                        height: 60,
                        backgroundColor: '#ffffff',
                        borderRadius: '12px 12px 0 0',
                        opacity: 0.5,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 160,
                        height: 60,
                        backgroundColor: '#ffffff',
                        borderRadius: '12px 12px 0 0',
                        opacity: 0.5,
                      },
                    },
                  },
                ],
              },
            },
            // Tab panel
            {
              type: 'div',
              props: {
                style: {
                  flex: 1,
                  backgroundColor: '#1e1e2e',
                  border: '2px solid rgba(168, 85, 247, 0.5)',
                  borderRadius: '0 12px 12px 12px',
                },
              },
            },
          ],
        },
      };

    case 'button':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 120,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 40,
            alignItems: 'center',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  width: 320,
                  height: 80,
                  backgroundColor: '#a855f7',
                  borderRadius: 16,
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  width: 280,
                  height: 70,
                  backgroundColor: '#ffffff',
                  borderRadius: 14,
                  opacity: 0.6,
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  width: 240,
                  height: 60,
                  border: '3px solid #a855f7',
                  borderRadius: 12,
                },
              },
            },
          ],
        },
      };

    case 'dialog':
    case 'alert-dialog':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 380,
            backgroundColor: '#1e1e2e',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 24,
            display: 'flex',
            flexDirection: 'column',
            padding: 32,
          },
          children: [
            // Title bar
            {
              type: 'div',
              props: {
                style: {
                  height: 32,
                  width: '50%',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  borderRadius: 8,
                  marginBottom: 24,
                },
              },
            },
            // Content
            {
              type: 'div',
              props: {
                style: {
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 20,
                        width: '100%',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 4,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 20,
                        width: '80%',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 4,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 20,
                        width: '60%',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 4,
                      },
                    },
                  },
                ],
              },
            },
            // Buttons
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  gap: 16,
                  justifyContent: 'flex-end',
                  marginTop: 24,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 120,
                        height: 48,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 8,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 120,
                        height: 48,
                        backgroundColor: '#a855f7',
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

    case 'accordion':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          },
          children: [
            // Expanded section
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 60,
                        backgroundColor: '#a855f7',
                        borderRadius: '12px 12px 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 24,
                      },
                      children: {
                        type: 'div',
                        props: {
                          style: {
                            width: 200,
                            height: 16,
                            backgroundColor: 'rgba(255,255,255,0.5)',
                            borderRadius: 4,
                          },
                        },
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 140,
                        backgroundColor: '#1e1e2e',
                        border: '2px solid rgba(168, 85, 247, 0.5)',
                        borderTop: 'none',
                        borderRadius: '0 0 12px 12px',
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                      },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: {
                              height: 12,
                              width: '100%',
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              borderRadius: 4,
                            },
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              height: 12,
                              width: '70%',
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              borderRadius: 4,
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            // Collapsed sections
            {
              type: 'div',
              props: {
                style: {
                  height: 60,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: 12,
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  height: 60,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: 12,
                },
              },
            },
          ],
        },
      };

    case 'checkbox':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 120,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 40,
          },
          children: [
            // Checked
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      children: {
                        type: 'div',
                        props: {
                          style: {
                            width: 20,
                            height: 12,
                            borderLeft: '4px solid white',
                            borderBottom: '4px solid white',
                            transform: 'rotate(-45deg)',
                            marginTop: -4,
                          },
                        },
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 180,
                        height: 20,
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        borderRadius: 4,
                      },
                    },
                  },
                ],
              },
            },
            // Unchecked
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 48,
                        height: 48,
                        border: '3px solid rgba(255,255,255,0.5)',
                        borderRadius: 8,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 160,
                        height: 20,
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        borderRadius: 4,
                      },
                    },
                  },
                ],
              },
            },
            // Indeterminate
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      children: {
                        type: 'div',
                        props: {
                          style: {
                            width: 24,
                            height: 4,
                            backgroundColor: 'white',
                            borderRadius: 2,
                          },
                        },
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 200,
                        height: 20,
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

    case 'radio-group':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 120,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 40,
          },
          children: [
            // Selected
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 48,
                        height: 48,
                        border: '3px solid #a855f7',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      children: {
                        type: 'div',
                        props: {
                          style: {
                            width: 24,
                            height: 24,
                            backgroundColor: '#a855f7',
                            borderRadius: '50%',
                          },
                        },
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 180,
                        height: 20,
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        borderRadius: 4,
                      },
                    },
                  },
                ],
              },
            },
            // Unselected
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 48,
                        height: 48,
                        border: '3px solid rgba(255,255,255,0.5)',
                        borderRadius: '50%',
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 160,
                        height: 20,
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        borderRadius: 4,
                      },
                    },
                  },
                ],
              },
            },
            // Unselected
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 48,
                        height: 48,
                        border: '3px solid rgba(255,255,255,0.5)',
                        borderRadius: '50%',
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 200,
                        height: 20,
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

    case 'slider':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 200,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            display: 'flex',
            flexDirection: 'column',
            gap: 60,
          },
          children: [
            // Slider track
            {
              type: 'div',
              props: {
                style: {
                  height: 16,
                  backgroundColor: 'rgba(255,255,255,0.3)',
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
                        width: '60%',
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
                        left: '58%',
                        width: 40,
                        height: 40,
                        backgroundColor: '#ffffff',
                        borderRadius: '50%',
                        border: '4px solid #a855f7',
                      },
                    },
                  },
                ],
              },
            },
            // Another slider
            {
              type: 'div',
              props: {
                style: {
                  height: 16,
                  backgroundColor: 'rgba(255,255,255,0.3)',
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
                        width: '30%',
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
                        left: '28%',
                        width: 40,
                        height: 40,
                        backgroundColor: '#ffffff',
                        borderRadius: '50%',
                        border: '4px solid #a855f7',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      };

    case 'switch':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 140,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 50,
          },
          children: [
            // ON state
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 120,
                        height: 60,
                        backgroundColor: '#a855f7',
                        borderRadius: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: 6,
                      },
                      children: {
                        type: 'div',
                        props: {
                          style: {
                            width: 48,
                            height: 48,
                            backgroundColor: '#ffffff',
                            borderRadius: '50%',
                          },
                        },
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 100,
                        height: 20,
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        borderRadius: 4,
                      },
                    },
                  },
                ],
              },
            },
            // OFF state
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 120,
                        height: 60,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: 30,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 6,
                      },
                      children: {
                        type: 'div',
                        props: {
                          style: {
                            width: 48,
                            height: 48,
                            backgroundColor: '#ffffff',
                            borderRadius: '50%',
                          },
                        },
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 80,
                        height: 20,
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

    case 'menu-button':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          },
          children: [
            // Button
            {
              type: 'div',
              props: {
                style: {
                  width: 200,
                  height: 60,
                  backgroundColor: '#a855f7',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 100,
                        height: 16,
                        backgroundColor: 'rgba(255,255,255,0.6)',
                        borderRadius: 4,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderTop: '12px solid rgba(255,255,255,0.8)',
                      },
                    },
                  },
                ],
              },
            },
            // Menu
            {
              type: 'div',
              props: {
                style: {
                  width: 240,
                  backgroundColor: '#1e1e2e',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  marginTop: 8,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 44,
                        backgroundColor: 'rgba(168, 85, 247, 0.3)',
                        borderRadius: 8,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 44,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 8,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 44,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 8,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 44,
                        backgroundColor: 'rgba(255,255,255,0.1)',
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

    case 'tooltip':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 160,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          },
          children: [
            // Tooltip
            {
              type: 'div',
              props: {
                style: {
                  backgroundColor: '#1e1e2e',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: 12,
                  padding: '16px 32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      width: 200,
                      height: 20,
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      borderRadius: 4,
                    },
                  },
                },
              },
            },
            // Arrow
            {
              type: 'div',
              props: {
                style: {
                  width: 0,
                  height: 0,
                  borderLeft: '16px solid transparent',
                  borderRight: '16px solid transparent',
                  borderTop: '16px solid rgba(255,255,255,0.3)',
                  marginTop: -16,
                },
              },
            },
            // Trigger element
            {
              type: 'div',
              props: {
                style: {
                  width: 180,
                  height: 60,
                  backgroundColor: '#a855f7',
                  borderRadius: 12,
                  marginTop: 16,
                },
              },
            },
          ],
        },
      };

    case 'combobox':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
          },
          children: [
            // Input
            {
              type: 'div',
              props: {
                style: {
                  width: 400,
                  height: 60,
                  backgroundColor: '#1e1e2e',
                  border: '2px solid #a855f7',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 20px',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 200,
                        height: 16,
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        borderRadius: 4,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderTop: '12px solid rgba(255,255,255,0.6)',
                      },
                    },
                  },
                ],
              },
            },
            // Dropdown
            {
              type: 'div',
              props: {
                style: {
                  width: 400,
                  backgroundColor: '#1e1e2e',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  marginTop: 8,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 48,
                        backgroundColor: 'rgba(168, 85, 247, 0.3)',
                        borderRadius: 8,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 48,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 8,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 48,
                        backgroundColor: 'rgba(255,255,255,0.1)',
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

    case 'listbox':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 400,
            backgroundColor: '#1e1e2e',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: 16,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  height: 56,
                  backgroundColor: 'rgba(168, 85, 247, 0.4)',
                  borderRadius: 10,
                  border: '2px solid #a855f7',
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  height: 56,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 10,
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  height: 56,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 10,
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  height: 56,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 10,
                },
              },
            },
          ],
        },
      };

    case 'alert':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 160,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 500,
            backgroundColor: 'rgba(234, 179, 8, 0.15)',
            border: '3px solid rgba(234, 179, 8, 0.5)',
            borderRadius: 16,
            padding: 32,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 24,
          },
          children: [
            // Icon
            {
              type: 'div',
              props: {
                style: {
                  width: 48,
                  height: 48,
                  backgroundColor: 'rgba(234, 179, 8, 0.6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      width: 6,
                      height: 24,
                      backgroundColor: '#1e1e2e',
                      borderRadius: 3,
                    },
                  },
                },
              },
            },
            // Content
            {
              type: 'div',
              props: {
                style: {
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 20,
                        width: '60%',
                        backgroundColor: 'rgba(234, 179, 8, 0.5)',
                        borderRadius: 4,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 16,
                        width: '100%',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: 4,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        height: 16,
                        width: '80%',
                        backgroundColor: 'rgba(255,255,255,0.3)',
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

    case 'breadcrumb':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 220,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  width: 80,
                  height: 24,
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  borderRadius: 4,
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 32,
                  color: 'rgba(255,255,255,0.5)',
                },
                children: '/',
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  width: 120,
                  height: 24,
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  borderRadius: 4,
                },
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 32,
                  color: 'rgba(255,255,255,0.5)',
                },
                children: '/',
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  width: 160,
                  height: 24,
                  backgroundColor: '#a855f7',
                  borderRadius: 4,
                },
              },
            },
          ],
        },
      };

    case 'carousel':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          },
          children: [
            // Prev button
            {
              type: 'div',
              props: {
                style: {
                  width: 48,
                  height: 48,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      width: 0,
                      height: 0,
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      borderRight: '14px solid rgba(255,255,255,0.8)',
                    },
                  },
                },
              },
            },
            // Slides
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  gap: 16,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 180,
                        height: 240,
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: 12,
                        opacity: 0.5,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 220,
                        height: 280,
                        backgroundColor: '#a855f7',
                        borderRadius: 16,
                        border: '3px solid rgba(255,255,255,0.3)',
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 180,
                        height: 240,
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: 12,
                        opacity: 0.5,
                      },
                    },
                  },
                ],
              },
            },
            // Next button
            {
              type: 'div',
              props: {
                style: {
                  width: 48,
                  height: 48,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      width: 0,
                      height: 0,
                      borderTop: '10px solid transparent',
                      borderBottom: '10px solid transparent',
                      borderLeft: '14px solid rgba(255,255,255,0.8)',
                    },
                  },
                },
              },
            },
          ],
        },
      };

    case 'disclosure':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 120,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 500,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          },
          children: [
            // Expanded
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '16px 24px',
                        backgroundColor: '#a855f7',
                        borderRadius: '12px 12px 0 0',
                      },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: {
                              width: 0,
                              height: 0,
                              borderLeft: '10px solid transparent',
                              borderRight: '10px solid transparent',
                              borderTop: '12px solid rgba(255,255,255,0.8)',
                            },
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              width: 200,
                              height: 20,
                              backgroundColor: 'rgba(255,255,255,0.5)',
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
                        padding: 24,
                        backgroundColor: '#1e1e2e',
                        border: '2px solid rgba(168, 85, 247, 0.5)',
                        borderTop: 'none',
                        borderRadius: '0 0 12px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                      },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: {
                              height: 14,
                              width: '100%',
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              borderRadius: 4,
                            },
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              height: 14,
                              width: '70%',
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              borderRadius: 4,
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            // Collapsed
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 24px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 0,
                        height: 0,
                        borderTop: '10px solid transparent',
                        borderBottom: '10px solid transparent',
                        borderLeft: '12px solid rgba(255,255,255,0.6)',
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 180,
                        height: 20,
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

    case 'feed':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 450,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          },
          children: [0, 1, 2].map((i) => ({
            type: 'div',
            props: {
              style: {
                backgroundColor: '#1e1e2e',
                border: i === 0 ? '2px solid #a855f7' : '2px solid rgba(255,255,255,0.2)',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                gap: 16,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: 60,
                      height: 60,
                      backgroundColor: i === 0 ? '#a855f7' : 'rgba(255,255,255,0.3)',
                      borderRadius: '50%',
                      flexShrink: 0,
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            height: 16,
                            width: '60%',
                            backgroundColor: 'rgba(255,255,255,0.4)',
                            borderRadius: 4,
                          },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            height: 12,
                            width: '100%',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: 4,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          })),
        },
      };

    case 'landmarks':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 700,
            height: 420,
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
          children: [
            // Header
            {
              type: 'div',
              props: {
                style: {
                  height: 60,
                  backgroundColor: '#a855f7',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 24px',
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      width: 120,
                      height: 20,
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      borderRadius: 4,
                    },
                  },
                },
              },
            },
            // Nav
            {
              type: 'div',
              props: {
                style: {
                  height: 44,
                  backgroundColor: 'rgba(168, 85, 247, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  padding: '0 24px',
                },
                children: [0, 1, 2, 3].map(() => ({
                  type: 'div',
                  props: {
                    style: {
                      width: 60,
                      height: 14,
                      backgroundColor: 'rgba(255,255,255,0.4)',
                      borderRadius: 4,
                    },
                  },
                })),
              },
            },
            // Main + aside
            {
              type: 'div',
              props: {
                style: {
                  flex: 1,
                  display: 'flex',
                },
                children: [
                  // Main
                  {
                    type: 'div',
                    props: {
                      style: {
                        flex: 1,
                        backgroundColor: '#1e1e2e',
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                      },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: {
                              height: 20,
                              width: '40%',
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              borderRadius: 4,
                            },
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              height: 14,
                              width: '100%',
                              backgroundColor: 'rgba(255,255,255,0.15)',
                              borderRadius: 4,
                            },
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              height: 14,
                              width: '80%',
                              backgroundColor: 'rgba(255,255,255,0.15)',
                              borderRadius: 4,
                            },
                          },
                        },
                      ],
                    },
                  },
                  // Aside
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 180,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderLeft: '2px solid rgba(255,255,255,0.1)',
                        padding: 16,
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
                  height: 48,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: {
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
              },
            },
          ],
        },
      };

    case 'link':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 180,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 40,
          },
          children: [
            // Link with underline
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 200,
                        height: 32,
                        backgroundColor: '#a855f7',
                        borderRadius: 4,
                        borderBottom: '3px solid rgba(255,255,255,0.6)',
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 40,
                        color: '#a855f7',
                      },
                      children: '↗',
                    },
                  },
                ],
              },
            },
            // Another link
            {
              type: 'div',
              props: {
                style: {
                  width: 160,
                  height: 28,
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  borderRadius: 4,
                  borderBottom: '2px solid rgba(255,255,255,0.3)',
                },
              },
            },
          ],
        },
      };

    case 'meter':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 160,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 500,
            display: 'flex',
            flexDirection: 'column',
            gap: 48,
          },
          children: [
            // High value
            {
              type: 'div',
              props: {
                style: {
                  height: 40,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 20,
                  display: 'flex',
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      width: '85%',
                      height: '100%',
                      backgroundColor: '#22c55e',
                      borderRadius: 20,
                    },
                  },
                },
              },
            },
            // Medium value
            {
              type: 'div',
              props: {
                style: {
                  height: 40,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 20,
                  display: 'flex',
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      width: '50%',
                      height: '100%',
                      backgroundColor: '#eab308',
                      borderRadius: 20,
                    },
                  },
                },
              },
            },
            // Low value
            {
              type: 'div',
              props: {
                style: {
                  height: 40,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 20,
                  display: 'flex',
                  overflow: 'hidden',
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      width: '20%',
                      height: '100%',
                      backgroundColor: '#ef4444',
                      borderRadius: 20,
                    },
                  },
                },
              },
            },
          ],
        },
      };

    case 'spinbutton':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 180,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1e1e2e',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 16,
            overflow: 'hidden',
          },
          children: [
            // Decrement
            {
              type: 'div',
              props: {
                style: {
                  width: 80,
                  height: 100,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRight: '2px solid rgba(255,255,255,0.2)',
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      width: 32,
                      height: 4,
                      backgroundColor: 'rgba(255,255,255,0.6)',
                      borderRadius: 2,
                    },
                  },
                },
              },
            },
            // Value
            {
              type: 'div',
              props: {
                style: {
                  width: 160,
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 48,
                      fontWeight: 700,
                      color: '#a855f7',
                    },
                    children: '42',
                  },
                },
              },
            },
            // Increment
            {
              type: 'div',
              props: {
                style: {
                  width: 80,
                  height: 100,
                  backgroundColor: '#a855f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeft: '2px solid rgba(255,255,255,0.2)',
                },
                children: {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: 32,
                            height: 4,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            borderRadius: 2,
                            position: 'absolute',
                          },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: 4,
                            height: 32,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            borderRadius: 2,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      };

    case 'table':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            backgroundColor: '#1e1e2e',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
          },
          children: [
            // Header row
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  backgroundColor: '#a855f7',
                },
                children: [0, 1, 2, 3].map(() => ({
                  type: 'div',
                  props: {
                    style: {
                      flex: 1,
                      height: 56,
                      borderRight: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    children: {
                      type: 'div',
                      props: {
                        style: {
                          width: 60,
                          height: 14,
                          backgroundColor: 'rgba(255,255,255,0.5)',
                          borderRadius: 4,
                        },
                      },
                    },
                  },
                })),
              },
            },
            // Data rows
            ...[0, 1, 2].map((row) => ({
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                },
                children: [0, 1, 2, 3].map(() => ({
                  type: 'div',
                  props: {
                    style: {
                      flex: 1,
                      height: 52,
                      borderRight: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    children: {
                      type: 'div',
                      props: {
                        style: {
                          width: 50,
                          height: 12,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: 4,
                        },
                      },
                    },
                  },
                })),
              },
            })),
          ],
        },
      };

    case 'toolbar':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 200,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1e1e2e',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: 16,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          },
          children: [
            // Button group 1
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  gap: 4,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 56,
                        height: 56,
                        backgroundColor: '#a855f7',
                        borderRadius: 8,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 56,
                        height: 56,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 8,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 56,
                        height: 56,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 8,
                      },
                    },
                  },
                ],
              },
            },
            // Separator
            {
              type: 'div',
              props: {
                style: {
                  width: 2,
                  height: 40,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
              },
            },
            // Button group 2
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  gap: 4,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 56,
                        height: 56,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 8,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 56,
                        height: 56,
                        backgroundColor: '#a855f7',
                        borderRadius: 8,
                      },
                    },
                  },
                ],
              },
            },
            // Separator
            {
              type: 'div',
              props: {
                style: {
                  width: 2,
                  height: 40,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
              },
            },
            // Single button
            {
              type: 'div',
              props: {
                style: {
                  width: 56,
                  height: 56,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 8,
                },
              },
            },
          ],
        },
      };

    case 'tree-view':
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 400,
            backgroundColor: '#1e1e2e',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          },
          children: [
            // Root expanded
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  borderRadius: 8,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderTop: '10px solid #a855f7',
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 24,
                        height: 24,
                        backgroundColor: '#a855f7',
                        borderRadius: 4,
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 120,
                        height: 14,
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        borderRadius: 4,
                      },
                    },
                  },
                ],
              },
            },
            // Children
            ...[0, 1].map(() => ({
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  paddingLeft: 48,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 20,
                        height: 20,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: 4,
                      },
                    },
                  },
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
            })),
            // Collapsed sibling
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 0,
                        height: 0,
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                        borderLeft: '10px solid rgba(255,255,255,0.5)',
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: 24,
                        height: 24,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: 4,
                      },
                    },
                  },
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
          ],
        },
      };

    default:
      // Generic pattern silhouette for patterns without specific designs
      return {
        type: 'div',
        props: {
          style: {
            ...baseStyle,
            top: 120,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 400,
            height: 300,
            backgroundColor: 'rgba(168, 85, 247, 0.3)',
            borderRadius: 24,
            border: '3px solid rgba(168, 85, 247, 0.5)',
          },
        },
      };
  }
}

/**
 * Create OGP image template for a specific pattern
 */
function createPatternTemplate(pattern) {
  return {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        position: 'relative',
        fontFamily: 'Inter',
      },
      children: [
        // Pattern silhouette (background)
        renderPatternSilhouette(pattern.id),

        // Text content (overlaid on silhouette)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            },
            children: [
              // Pattern name
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 72,
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: 16,
                    letterSpacing: '-0.02em',
                    textShadow: '0 4px 24px rgba(0, 0, 0, 0.5)',
                  },
                  children: pattern.name,
                },
              },
              // Site name
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 28,
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.7)',
                    textShadow: '0 2px 12px rgba(0, 0, 0, 0.5)',
                  },
                  children: SITE_NAME,
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function loadFont() {
  const fontPath = require.resolve('@fontsource/inter/files/inter-latin-400-normal.woff');
  const fontData = readFileSync(fontPath);
  return {
    name: 'Inter',
    data: fontData,
    weight: 400,
    style: 'normal',
  };
}

function loadFontBold() {
  const fontPath = require.resolve('@fontsource/inter/files/inter-latin-700-normal.woff');
  const fontData = readFileSync(fontPath);
  return {
    name: 'Inter',
    data: fontData,
    weight: 700,
    style: 'normal',
  };
}

async function generatePatternOGImages() {
  console.log('Generating pattern OGP images...\n');

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load fonts
  const fontRegular = loadFont();
  const fontBold = loadFontBold();

  let successCount = 0;
  let errorCount = 0;

  for (const pattern of PATTERNS) {
    try {
      const template = createPatternTemplate(pattern);

      // Generate SVG with Satori
      const svg = await satori(template, {
        width: WIDTH,
        height: HEIGHT,
        fonts: [fontRegular, fontBold],
      });

      // Convert SVG to PNG with Sharp
      const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

      // Write the PNG file
      const outputPath = join(OUTPUT_DIR, `${pattern.id}.png`);
      writeFileSync(outputPath, pngBuffer);

      console.log(`  ✓ ${pattern.name} → ${pattern.id}.png`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ ${pattern.name}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n✓ Generated ${successCount} pattern OGP images`);
  if (errorCount > 0) {
    console.log(`✗ Failed: ${errorCount}`);
  }
  console.log(`  Output directory: ${OUTPUT_DIR}`);
}

generatePatternOGImages().catch((error) => {
  console.error('Failed to generate pattern OGP images:', error);
  process.exit(1);
});
