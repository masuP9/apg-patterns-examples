# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of APG Patterns Examples seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please DO NOT:

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Please DO:

1. **Email the maintainer** at the email associated with the GitHub account (@masuP9)
2. **Include the following information**:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: We will acknowledge your email within 48 hours
- **Assessment**: We will assess the vulnerability and determine its impact
- **Updates**: We will keep you informed of our progress
- **Resolution**: We will release a fix as soon as possible
- **Credit**: We will credit you in the release notes (unless you prefer to remain anonymous)

## Security Considerations

### Client-Side Components

This project provides client-side UI components. When using these components:

1. **XSS Prevention**:
   - Always sanitize user input before rendering
   - Be cautious when using `dangerouslySetInnerHTML` (React) or `v-html` (Vue)
   - The components themselves do not directly handle user input sanitization

2. **Content Security Policy (CSP)**:
   - Components use inline styles via Tailwind CSS
   - Ensure your CSP allows necessary styles
   - No inline scripts are used

3. **Dependency Security**:
   - We regularly update dependencies
   - Run `npm audit` to check for known vulnerabilities
   - Review dependency updates carefully

4. **ARIA Attributes**:
   - ARIA attributes are set based on component state
   - Do not allow untrusted input to control ARIA attributes
   - Invalid ARIA can affect accessibility but not security

### Best Practices for Integration

When integrating these components into your application:

- **Validate Props**: Validate all props passed to components
- **Sanitize Content**: Sanitize any user-generated content
- **Authentication**: Implement proper authentication for sensitive operations
- **Authorization**: Check user permissions before allowing actions
- **HTTPS**: Always serve your application over HTTPS

## Development Security

For contributors:

1. **Dependencies**:
   - Review `package.json` changes carefully
   - Run `npm audit` before submitting PRs
   - Keep dependencies up to date

2. **Code Review**:
   - All PRs require review before merging
   - Security-sensitive changes require additional scrutiny

3. **CI/CD**:
   - All tests must pass before merging
   - Linting and formatting checks are enforced

## Known Limitations

- This project focuses on accessibility compliance, not security hardening
- Components are designed for trusted content environments
- Server-side validation is always required for user input

## Questions?

For general security questions or concerns, please open a [Discussion](https://github.com/masuP9/apg-patterns-examples/discussions) or contact the maintainers.

---

## Known Advisories

As of 2026-07-12, on the stable Astro 7 toolchain, applying `npm audit fix`
(non-breaking, **no** `--force`) reduces the audit to **5 findings** (4 critical,
1 low). Only **1** (low) appears in the production dependency tree; the rest are
development/build tooling. The remaining findings have no non-breaking fix — they
require a `--force` major upgrade — and are deferred to maintainer-owned upgrade
work.

| Advisory ID | Severity | Package | How it enters the tree | Status / why deferred |
|---|---|---|---|---|
| GHSA-g8mr-85jm-7xhm | critical | `@vitest/browser` | `@vitest/browser-playwright` / `@vitest/coverage-v8` / `vitest` (dev; browser-mode test tooling) | No non-breaking fix; needs a `--force` major bump of the Vitest browser packages. Exercised only by `npm run test:browser`, not shipped as part of the static site. |
| GHSA-2h32-95rg-cppp | critical | `@vitest/browser` | same as above | same as above |
| GHSA-g7r4-m6w7-qqqr | low | esbuild | `astro` → `vite` (transitive; esbuild version pinned upstream) | esbuild's version is pinned transitively by Vite/Astro, so a non-breaking bump does not apply. Per its advisory the issue is Windows-specific and reachable via the dev server. Clears when Vite/Astro advance their pinned esbuild. |

Re-run `npm audit fix` (non-breaking) periodically to keep the noise floor low.
The remaining `--force` upgrades (Vitest browser majors; a Vite/Astro bump that
moves the pinned esbuild) are tracked as separate maintainer-owned work.

---

Thank you for helping keep APG Patterns Examples and its users safe!
