# Contributing to APG Patterns Examples

Thank you for your interest in contributing to APG Patterns Examples! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Component Guidelines](#component-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)
- Git
- Basic understanding of:
  - WAI-ARIA and accessibility principles
  - At least one of: React, Vue, Svelte, or Astro
  - TypeScript
  - Tailwind CSS

### Useful Resources

- [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Project Documentation](./CLAUDE.md) - Internal development guide
- [Coding Rules](./CODING_RULES.md) - TypeScript and code style requirements

## Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/apg-patterns-examples.git
   cd apg-patterns-examples
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/masuP9/apg-patterns-examples.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start development server**:
   ```bash
   npm run dev
   # Opens at http://localhost:4321
   ```

## Development Workflow

### Creating a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming Convention

- `feature/pattern-name` - New pattern implementation
- `fix/issue-description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions or modifications

### Making Changes

1. Make your changes in the feature branch
2. Test your changes thoroughly
3. Run linting and formatting:
   ```bash
   npm run lint     # Runs all checks in parallel (ESLint, TypeScript, Astro)
   npm run format
   ```
   For faster iteration, you can run individual checks:
   ```bash
   npm run lint:eslint  # ESLint only
   npm run lint:types   # TypeScript type check only
   npm run lint:astro   # Astro check only
   ```
4. Ensure all tests pass:
   ```bash
   npm run test
   ```

### Keeping Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

## Coding Standards

### General Rules

- Follow the [Coding Rules](./CODING_RULES.md) document
- Use TypeScript with strict type checking
- Minimize use of type assertions (`as`)
- Prefer type guards and proper type definitions
- Write self-documenting code with clear variable names
- Add comments only where logic isn't self-evident

### Code Formatting

We use Prettier with specific configurations:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

**Formatting Rules**:
- Semicolons: Required
- Quotes: Single quotes (double in JSX attributes)
- Indentation: 2 spaces
- Trailing commas: ES5
- Line width: 100 characters
- Tailwind CSS class ordering: Automatic

### TypeScript Guidelines

See [CODING_RULES.md](./CODING_RULES.md) for detailed TypeScript requirements, especially:
- Type assertion restrictions
- Type guard patterns
- DOM API handling
- Safe access helpers

## Component Guidelines

### Accessibility Requirements

All components MUST:

1. **Follow APG Patterns**: Implement the exact ARIA roles, states, and properties specified in [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
2. **Keyboard Navigation**: Support all required keyboard interactions
3. **Screen Reader Support**: Provide appropriate labels and announcements
4. **Focus Management**: Handle focus correctly (visible indicators, logical order)
5. **High Contrast Mode**: Work correctly in Windows High Contrast Mode
6. **Reduced Motion**: Respect `prefers-reduced-motion` preference

### Framework Parity

When implementing a pattern, ensure:

- All four frameworks (React, Vue, Svelte, Astro) have the same functionality
- Component APIs are consistent across frameworks
- All implementations pass the same accessibility tests
- Documentation is complete for each framework

### Component Structure

Each pattern should include:

```
src/patterns/{pattern}/
├── {Pattern}.tsx              # React implementation
├── {Pattern}.vue              # Vue implementation
├── {Pattern}.svelte           # Svelte implementation
├── {Pattern}.astro            # Astro/Web Components implementation
├── AccessibilityDocs.astro    # ARIA documentation
├── llm.md                     # AI assistant reference
└── __tests__/
    ├── {Pattern}.test.tsx     # React tests
    ├── {Pattern}.test.vue     # Vue tests (wrapper)
    └── {Pattern}.test.svelte  # Svelte tests (wrapper)
```

### Required Documentation

1. **AccessibilityDocs.astro**: Include sections for:
   - Native HTML Considerations (if applicable)
   - WAI-ARIA Roles
   - WAI-ARIA States/Properties
   - Keyboard Support

2. **llm.md**: AI-friendly reference (see [.internal/llm-md-template.md](.internal/llm-md-template.md))

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Testing Requirements

All components must have tests for:

1. **ARIA Compliance**:
   - Correct roles
   - Required states and properties
   - Dynamic state updates

2. **Keyboard Navigation**:
   - All required key handlers
   - Focus management
   - Tab order

3. **User Interactions**:
   - Click/tap events
   - State changes
   - Event callbacks

4. **Accessibility**:
   - `jest-axe` automated checks
   - Screen reader announcements (where applicable)

See [.internal/testing-strategy.md](.internal/testing-strategy.md) for detailed testing guidelines.

## Pull Request Process

### Before Submitting

1. ✅ All tests pass (`npm run test`)
2. ✅ Linting passes (`npm run lint`)
3. ✅ Code is formatted (`npm run format`)
4. ✅ Documentation is updated
5. ✅ Commits follow our [commit message guidelines](#commit-message-guidelines)

### Submitting a PR

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub

3. **Fill out the PR template** with:
   - Description of changes
   - Related issue number (if applicable)
   - Screenshots/GIFs (for UI changes)
   - Testing checklist

4. **Wait for review**: A maintainer will review your PR and may request changes

5. **Address feedback**: Make requested changes and push updates

6. **Merge**: Once approved, a maintainer will merge your PR

### PR Review Criteria

PRs will be reviewed for:

- ✅ APG compliance and accessibility
- ✅ Code quality and adherence to standards
- ✅ Test coverage
- ✅ Documentation completeness
- ✅ Framework parity (all 4 frameworks work identically)
- ✅ No breaking changes (unless discussed)

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(accordion): implement accordion pattern for all frameworks

- Add React, Vue, Svelte, and Astro implementations
- Include keyboard navigation (Arrow keys, Home, End)
- Add comprehensive accessibility tests
- Document ARIA roles and properties

Closes #42
```

```
fix(tabs): correct focus management on tab deletion

When a selected tab is deleted, focus now moves to the
adjacent tab instead of losing focus.

Fixes #128
```

```
docs(contributing): add component guidelines section
```

### Scope

Use the pattern name or area of change:
- `accordion`, `tabs`, `dialog`, etc. - For pattern-specific changes
- `ci` - CI/CD changes
- `deps` - Dependency updates
- `a11y` - Cross-cutting accessibility improvements

## Questions?

- **General questions**: Open a [Discussion](https://github.com/masuP9/apg-patterns-examples/discussions)
- **Bug reports**: Open an [Issue](https://github.com/masuP9/apg-patterns-examples/issues)
- **Feature requests**: Open an [Issue](https://github.com/masuP9/apg-patterns-examples/issues) with the `enhancement` label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to make the web more accessible! 🎉
