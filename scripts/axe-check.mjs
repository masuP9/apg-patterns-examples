// @ts-check
/**
 * Ad-hoc axe runner that enables ALL axe-core rules (including the
 * default-disabled ones such as `target-size` / WCAG 2.5.8) against a single
 * page, and prints both violations and incomplete (needs-review) results.
 *
 * This is a verification / investigation tool — NOT part of the test suite.
 * The regular e2e specs intentionally run the default rule set; enabling
 * everything here is noisy by design (color-contrast, experimental rules, …),
 * which is exactly what we want when auditing what axe *could* catch.
 *
 * Usage:
 *   node scripts/axe-check.mjs <path> [includeSelector]
 *
 *   <path>            Path relative to the site base (the Astro base path is
 *                     prepended automatically), e.g.
 *                     "patterns/windowsplitter/react/demo/"
 *   [includeSelector] Optional CSS selector to scope the scan,
 *                     e.g. ".apg-window-splitter-demo-wrapper"
 *
 * Origin / base resolution:
 *   - Base path comes from the shared deploy-target contract (deploy-target.mjs):
 *     DEPLOY_TARGET unset → github-pages → "/apg-patterns-examples/".
 *   - Origin: AXE_BASE_URL (its origin is used) overrides the dev-port origin.
 *
 * Examples:
 *   AXE_BASE_URL=http://localhost:4336 \
 *     node scripts/axe-check.mjs patterns/windowsplitter/react/demo/ .apg-window-splitter-demo-wrapper
 */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import axe from 'axe-core';
import { getDevPort, getSiteConfig, toBaseUrlPath } from './deploy-target.mjs';

/**
 * Full base URL (origin + base path, trailing slash) the `<path>` is resolved
 * against. AXE_BASE_URL overrides the origin; the base path always comes from
 * the shared deploy-target contract so callers never hand-prefix it.
 * @returns {string}
 */
function getBaseUrl() {
  const origin = process.env.AXE_BASE_URL
    ? new URL(process.env.AXE_BASE_URL).origin
    : `http://localhost:${getDevPort()}`;
  return `${origin}${toBaseUrlPath(getSiteConfig().basePath)}`;
}

/**
 * Build a rules option that force-enables every known axe-core rule.
 * @returns {Record<string, { enabled: boolean }>}
 */
function allRulesEnabled() {
  /** @type {Record<string, { enabled: boolean }>} */
  const rules = {};
  // getRules() lists every registered rule regardless of its default `enabled`
  // flag, so default-disabled rules (e.g. target-size) get switched on too.
  for (const rule of axe.getRules()) {
    rules[rule.ruleId] = { enabled: true };
  }
  return rules;
}

/**
 * @param {import('axe-core').NodeResult} node
 * @returns {string}
 */
function fmtNode(node) {
  const target = Array.isArray(node.target) ? node.target.join(' ') : String(node.target);
  return `      - ${target}`;
}

/**
 * @param {string} title
 * @param {import('axe-core').Result[]} results
 */
function printGroup(title, results) {
  console.log(`\n${title} (${results.length})`);
  if (results.length === 0) {
    console.log('  (none)');
    return;
  }
  for (const r of results) {
    console.log(`  • ${r.id}  [impact: ${r.impact ?? 'n/a'}]  nodes: ${r.nodes.length}`);
    console.log(`    ${r.help}`);
    for (const node of r.nodes.slice(0, 5)) {
      console.log(fmtNode(node));
    }
    if (r.nodes.length > 5) {
      console.log(`      … +${r.nodes.length - 5} more`);
    }
  }
}

async function main() {
  const path = process.argv[2];
  const includeSelector = process.argv[3];

  if (!path) {
    console.error('Usage: node scripts/axe-check.mjs <path> [includeSelector]');
    process.exit(2);
  }

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path.replace(/^\//, '')}`;

  const browser = await chromium.launch();
  // @axe-core/playwright requires a context-created page (not browser.newPage()).
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle' });
    const status = resp?.status();
    if (status && status >= 400) {
      console.error(
        `\nHTTP ${status} for ${url}\n` +
          'Hint: pass the path WITHOUT the base prefix (it is added automatically), ' +
          'and make sure the dev server / DEPLOY_TARGET matches the base shown above.'
      );
      process.exit(1);
    }

    let builder = new AxeBuilder({ page }).options({ rules: allRulesEnabled() });
    if (includeSelector) {
      builder = builder.include(includeSelector);
    }

    const results = await builder.analyze();

    console.log('='.repeat(72));
    console.log(`URL:     ${url}`);
    if (includeSelector) console.log(`include: ${includeSelector}`);
    console.log(`axe-core: ${axe.version}  (ALL rules force-enabled)`);
    console.log('='.repeat(72));

    printGroup('VIOLATIONS', results.violations);
    printGroup('INCOMPLETE (needs review)', results.incomplete);

    const targetSize = [...results.violations, ...results.incomplete].find(
      (r) => r.id === 'target-size'
    );
    console.log('\n' + '-'.repeat(72));
    if (targetSize) {
      const bucket = results.violations.includes(targetSize) ? 'VIOLATION' : 'INCOMPLETE';
      console.log(`target-size: ${bucket} (${targetSize.nodes.length} node(s))`);
    } else {
      console.log('target-size: no finding (passed or not applicable)');
    }
    console.log('-'.repeat(72));
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  // Verification tool: never fail the shell on scan/setup errors beyond logging.
  process.exit(1);
});
