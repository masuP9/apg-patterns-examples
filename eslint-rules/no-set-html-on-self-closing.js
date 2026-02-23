/**
 * ESLint rule: no-set-html-on-self-closing
 *
 * Enforces that `set:html` is only used on `<Fragment>`, components, or
 * special elements (`<script>`, `<style>`).  Using `set:html` directly on
 * plain HTML elements (e.g. `<td set:html={…}>`) is fragile because
 * prettier-plugin-astro converts empty elements with set-directives to
 * self-closing tags, which silently discards the content for non-void elements.
 *
 * Autofix: `<el set:html={expr} />` → `<el><Fragment set:html={expr} /></el>`
 *          `<el set:html={expr}></el>` → `<el><Fragment set:html={expr} /></el>`
 *
 * @see https://github.com/masuP9/apg-patterns-examples/issues/143
 */

/** Elements where set:html is allowed directly (not regular HTML elements) */
const ALLOWED_ELEMENTS = new Set(['Fragment', 'script', 'style']);

/**
 * @returns {boolean} whether the attribute is `set:html`
 */
function isSetHtml(attr) {
  return (
    attr.name.type === 'JSXNamespacedName' &&
    attr.name.namespace.name === 'set' &&
    attr.name.name.name === 'html'
  );
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow set:html on plain HTML elements in Astro — use <Fragment set:html> instead',
    },
    fixable: 'code',
    messages: {
      useFragment:
        'Use `<Fragment set:html={…} />` inside <{{tagName}}> instead of `set:html` directly. ' +
        'prettier-plugin-astro converts set:html elements to self-closing tags, which silently discards content on non-void elements.',
    },
    schema: [],
  },

  create(context) {
    function checkAttribute(attr) {
      // 1. Is this `set:html`?
      if (!isSetHtml(attr)) return;

      // 2. Get the parent opening element
      const openingElement = attr.parent; // JSXOpeningElement
      if (!openingElement) return;

      // 3. Determine tag name
      const nameNode = openingElement.name;
      if (nameNode.type !== 'JSXIdentifier') return; // skip member/namespaced

      const tagName = nameNode.name;

      // 4. Allow: Fragment, PascalCase components, script, style
      if (ALLOWED_ELEMENTS.has(tagName) || /^[A-Z]/.test(tagName)) return;

      // 5. Report with autofix
      const sourceCode = context.sourceCode ?? context.getSourceCode();

      context.report({
        node: openingElement,
        messageId: 'useFragment',
        data: { tagName },
        fix(fixer) {
          const jsxElement = openingElement.parent;
          const elementText = sourceCode.getText(jsxElement);

          // Extract the set:html attribute text (e.g. `set:html={t(role.description)}`)
          const setHtmlText = sourceCode.getText(attr);

          // Build the replacement: remove set:html from the opening tag, add Fragment inside
          // We need to handle both self-closing and non-self-closing cases.

          // Remove the set:html attribute from the element text
          const attrStart = attr.range[0] - jsxElement.range[0];
          const attrEnd = attr.range[1] - jsxElement.range[0];

          // Also remove surrounding whitespace before the attribute
          let removeStart = attrStart;
          while (removeStart > 0 && elementText[removeStart - 1] === ' ') {
            removeStart--;
          }
          // Keep at least one space if there's content before
          if (removeStart > 0 && elementText[removeStart - 1] !== ' ') {
            removeStart = attrStart;
            // Just remove one leading space
            if (attrStart > 0 && elementText[attrStart - 1] === ' ') {
              removeStart = attrStart - 1;
            }
          }

          const withoutAttr = elementText.slice(0, removeStart) + elementText.slice(attrEnd);

          const fragment = `<Fragment ${setHtmlText} />`;

          if (openingElement.selfClosing) {
            // Self-closing: `<tag attr />` → `<tag>${fragment}</tag>`
            const slashIdx = withoutAttr.lastIndexOf('/>');
            if (slashIdx === -1) return null;

            const fixed =
              withoutAttr.slice(0, slashIdx).trimEnd() + '>' + fragment + `</${tagName}>`;

            return fixer.replaceTextRange(jsxElement.range, fixed);
          }

          // Non-self-closing: `<tag attr></tag>` → `<tag>${fragment}</tag>`
          const otherAttrs = openingElement.attributes
            .filter((a) => a !== attr)
            .map((a) => sourceCode.getText(a))
            .join(' ');

          const attrsStr = otherAttrs ? ' ' + otherAttrs : '';
          const fixed = `<${tagName}${attrsStr}>${fragment}</${tagName}>`;

          return fixer.replaceTextRange(jsxElement.range, fixed);
        },
      });
    }

    return {
      JSXAttribute: checkAttribute,
      AstroTemplateLiteralAttribute: checkAttribute,
    };
  },
};

export default rule;
