# APG Patterns Examples

> Accessible UI component implementations across React, Vue, Svelte, and Astro following WAI-ARIA APG patterns

[![Deploy to GitHub Pages](https://github.com/masuP9/apg-patterns-examples/actions/workflows/ci.yml/badge.svg)](https://github.com/masuP9/apg-patterns-examples/actions/workflows/ci.yml)

[日本語](./README.ja.md) | English

## Overview

This project provides accessible UI components and test cases that follow the [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/) patterns.

Each component is implemented across four major frontend frameworks: **React**, **Vue**, **Svelte**, and **Astro** (Web Components), providing familiar implementation examples to help you learn about accessibility and WAI-ARIA.

Each component includes tests to verify APG pattern compliance, which you can use directly to ensure accessibility of your own components. The test documentation is also designed in an AI-friendly format, making it easy to generate test cases.

Additionally, we provide styling that supports dark mode, high contrast mode, and forced colors mode to further assist in developing accessible components.

## Component Status

| Pattern              | React | Vue | Svelte | Astro | Status   |
| -------------------- | ----- | --- | ------ | ----- | -------- |
| Accordion            | ✅    | ✅  | ✅     | ✅    | Complete |
| Alert                | ✅    | ✅  | ✅     | ✅    | Complete |
| Alert Dialog         | -     | -   | -      | -     | Planned  |
| Breadcrumb           | ✅    | ✅  | ✅     | ✅    | Complete |
| Button               | -     | -   | -      | -     | Planned  |
| Carousel             | -     | -   | -      | -     | Planned  |
| Checkbox             | ✅    | ✅  | ✅     | ✅    | Complete |
| Combobox             | ✅    | ✅  | ✅     | ✅    | Complete |
| Dialog               | ✅    | ✅  | ✅     | ✅    | Complete |
| Disclosure           | ✅    | ✅  | ✅     | ✅    | Complete |
| Feed                 | -     | -   | -      | -     | Planned  |
| Grid                 | -     | -   | -      | -     | Planned  |
| Landmarks            | -     | -   | -      | -     | Planned  |
| Link                 | ✅    | ✅  | ✅     | ✅    | Complete |
| Listbox              | ✅    | ✅  | ✅     | ✅    | Complete |
| Menu and Menubar     | -     | -   | -      | -     | Planned  |
| Menu Button          | ✅    | ✅  | ✅     | ✅    | Complete |
| Meter                | ✅    | ✅  | ✅     | ✅    | Complete |
| Radio Group          | ✅    | ✅  | ✅     | ✅    | Complete |
| Slider               | ✅    | ✅  | ✅     | ✅    | Complete |
| Slider (Multi-Thumb) | -     | -   | -      | -     | Planned  |
| Spinbutton           | ✅    | ✅  | ✅     | ✅    | Complete |
| Switch               | ✅    | ✅  | ✅     | ✅    | Complete |
| Table                | ✅    | ✅  | ✅     | ✅    | Complete |
| Tabs                 | ✅    | ✅  | ✅     | ✅    | Complete |
| Toggle Button        | ✅    | ✅  | ✅     | ✅    | Complete |
| Toolbar              | ✅    | ✅  | ✅     | ✅    | Complete |
| Tooltip              | ✅    | ✅  | ✅     | ✅    | Complete |
| Tree View            | ✅    | ✅  | ✅     | ✅    | Complete |
| Treegrid             | -     | -   | -      | -     | Planned  |
| Window Splitter      | -     | -   | -      | -     | Planned  |

## Styling

- High contrast mode support
- Reduced motion preferences support
- Forced colors mode support

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Development setup and workflow
- Coding standards and guidelines
- Component implementation requirements
- Testing requirements
- Pull request process

### Quick Contributing Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-component`
3. Follow our [coding standards](./CODING_RULES.md)
4. Ensure all tests pass and code is formatted
5. Submit a pull request

### Development Guidelines

- Follow APG patterns precisely
- Write tests including accessibility checks
- Document accessibility features thoroughly
- Use semantic commit messages

## Security

For security concerns or to report vulnerabilities, please see our [Security Policy](./SECURITY.md).

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Links

- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Live Demo](https://masup9.github.io/apg-patterns-examples/)
- [Issue Tracker](https://github.com/masuP9/apg-patterns-examples/issues)
- [Discussions](https://github.com/masuP9/apg-patterns-examples/discussions)
