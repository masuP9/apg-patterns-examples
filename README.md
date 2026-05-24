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

| Pattern              | React | Vue | Svelte | Astro | E2E | Status   |
| -------------------- | ----- | --- | ------ | ----- | --- | -------- |
| Accordion            | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Alert                | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Alert Dialog         | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Breadcrumb           | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Button               | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Carousel             | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Checkbox             | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Combobox             | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Data Grid            | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Dialog               | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Disclosure           | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Feed                 | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Grid                 | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Landmarks            | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Link                 | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Listbox              | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Menubar              | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Menu Button          | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Meter                | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Radio Group          | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Slider               | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Slider (Multi-Thumb) | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Spinbutton           | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Switch               | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Table                | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Tabs                 | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Toggle Button        | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Toolbar              | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Tooltip              | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Tree View            | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Treegrid             | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |
| Window Splitter      | ✅    | ✅  | ✅     | ✅    | ✅  | Complete |

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

## APG Upstream Watcher

A daily GitHub Actions workflow polls [`w3c/aria-practices`](https://github.com/w3c/aria-practices) and opens one issue per APG slug whenever new commits land on a tracked pattern path. Reviewers can decide in a single place whether each upstream change needs reflecting in this site.

### Setup (one-time)

1. **Repository settings**: enable Settings → Actions → General → Workflow permissions → "Read and write permissions" so the workflow can commit state updates and create issues.
2. **Label**: create a single repo label named `apg-upstream`.

### How it runs

- **Scheduled**: daily at JST 08:17 (UTC 23:17) via `.github/workflows/apg-upstream-watch.yml`.
- **Manual / dry-run**: GitHub UI → Actions → APG Upstream Watch → "Run workflow". Inputs (all optional):
  - `dry_run=true`: print intended actions, no issue creation, no state commit.
  - `since_override=<ISO8601>`: process commits since the given time for all slugs (useful for first backfill).
  - `patterns=<id,id,...>`: limit to the given site patternIds.

### State

`.github/apg-state.json` records, per APG slug, the last commit SHA and timestamp the watcher has already turned into an issue. The bot user commits state updates with `[skip ci]`. On first encounter of a slug, the watcher records the latest commit as a baseline and creates no issue (so we don't drown in years of history).

### Issue identity

Each issue body contains a hidden marker `<!-- apg-upstream:slug=<apg-slug> -->`. The watcher uses this marker (not the title) to find existing open issues for follow-up comments, so renaming the title is safe.

### Local execution

```bash
GITHUB_TOKEN=$(gh auth token) DRY_RUN=true PATTERNS_FILTER=button \
  SINCE_OVERRIDE=2025-12-01T00:00:00Z \
  npm run watch:apg
```

## Security

For security concerns or to report vulnerabilities, please see our [Security Policy](./SECURITY.md).

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Links

- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Live Demo](https://masup9.github.io/apg-patterns-examples/)
- [Issue Tracker](https://github.com/masuP9/apg-patterns-examples/issues)
- [Discussions](https://github.com/masuP9/apg-patterns-examples/discussions)
