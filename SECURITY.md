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

## Known Advisories (deferred — force-only fixes)

As of 2026-06-15, `npm audit fix` (non-breaking) reduced the total from **21** to **11** vulnerabilities. The remaining items all require `npm audit fix --force` or a major upstream version bump and are deferred until the project migrates away from the intentional alpha dependencies.

| Advisory ID | Severity | Package | Direct dependency pulling it in | Why deferred |
|---|---|---|---|---|
| GHSA-g7r4-m6w7-qqqr | high | esbuild ≤0.28.0 | `astro@7.0.0-alpha.0` | Requires `astro@7.0.0-beta.3+`; outside stated alpha range |
| GHSA-gv7w-rqvm-qjhr | high | esbuild ≤0.28.0 | `astro@7.0.0-alpha.0` | Same as above |
| GHSA-48c2-rrv3-qjmp | moderate | yaml (nested in yaml-language-server) | `@astrojs/check` | Fix installs `@astrojs/check@0.9.2`, flagged as breaking change |
| GHSA-2h32-95rg-cppp | critical | `@vitest/browser` 4.0.17–4.1.5 | `@vitest/browser-playwright` | Affects browser-mode dev tooling only; fix available via `npm audit fix` but did not apply in this run — re-run after upstream vitest release stabilizes |

Per its advisory, the esbuild file-read issue (GHSA-g7r4-m6w7-qqqr) is described as Windows-specific and reachable via the dev server. All items will be resolved when `astro` and `@astrojs/*` alpha pins are advanced to stable or beta releases.

---

Thank you for helping keep APG Patterns Examples and its users safe!
