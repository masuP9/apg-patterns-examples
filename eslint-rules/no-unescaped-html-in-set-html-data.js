/**
 * ESLint rule: no-unescaped-html-in-set-html-data
 *
 * Detects unescaped HTML element names in string literals within
 * accessibility-data.ts files. These strings are rendered via
 * `<Fragment set:html={...} />` in Astro templates, so raw `<tagname>`
 * would be interpreted as actual HTML elements, causing layout breakage.
 *
 * @see https://github.com/masuP9/apg-patterns-examples/pull/148
 * @see https://github.com/masuP9/apg-patterns-examples/pull/149
 */

/** HTML elements that should be escaped when appearing in data strings */
const HTML_ELEMENTS = new Set([
  'a',
  'aside',
  'button',
  'datalist',
  'details',
  'dialog',
  'div',
  'fieldset',
  'footer',
  'form',
  'header',
  'hr',
  'input',
  'label',
  'legend',
  'li',
  'main',
  'meter',
  'nav',
  'ol',
  'option',
  'pre',
  'section',
  'select',
  'span',
  'summary',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'tr',
  'ul',
]);

/** Tags intentionally used as HTML wrappers in set:html strings */
const ALLOWED_WRAPPER_TAGS = new Set(['code', 'strong', 'em']);

/** Property names whose values are not rendered via set:html */
const EXCLUDED_FIELDS = /^(implementationNotes|exampleTestCode|references)/;

/**
 * Check if a node is inside an excluded field (implementationNotes, exampleTestCode*).
 * These fields contain markdown/code that is not rendered via set:html.
 */
function isInExcludedField(node) {
  let current = node.parent;
  while (current) {
    if (
      current.type === 'Property' &&
      current.key &&
      current.key.name &&
      EXCLUDED_FIELDS.test(current.key.name)
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

/**
 * Regex to match `<tagname>` or `<tagname ...>` patterns in strings.
 * Excludes already-escaped `&lt;tagname&gt;` patterns.
 */
function findUnescapedTags(value) {
  const results = [];
  // Match <tagname> or <tagname ...> but not &lt;tagname
  const regex = /(?<!&lt;)<(\/?\w+)(?:\s[^>]*)?\/?>/g;
  let match;
  while ((match = regex.exec(value)) !== null) {
    const tagName = match[1].replace('/', '');
    if (HTML_ELEMENTS.has(tagName) && !ALLOWED_WRAPPER_TAGS.has(tagName)) {
      results.push({ tag: match[0], tagName, index: match.index });
    }
  }
  return results;
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Detect unescaped HTML tags in accessibility-data.ts strings that will be rendered via set:html',
    },
    messages: {
      unescapedTag:
        'Unescaped <{{tagName}}> found in string rendered via set:html. ' +
        'Use &lt;{{tagName}}&gt; to display as text, or wrap in <code> if intended as inline code.',
    },
    schema: [],
  },

  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== 'string') return;
        if (isInExcludedField(node)) return;

        const tags = findUnescapedTags(node.value);
        for (const { tagName } of tags) {
          context.report({
            node,
            messageId: 'unescapedTag',
            data: { tagName },
          });
        }
      },

      TemplateLiteral(node) {
        if (isInExcludedField(node)) return;

        for (const quasi of node.quasis) {
          const tags = findUnescapedTags(quasi.value.raw);
          for (const { tagName } of tags) {
            context.report({
              node: quasi,
              messageId: 'unescapedTag',
              data: { tagName },
            });
          }
        }
      },
    };
  },
};

export default rule;
