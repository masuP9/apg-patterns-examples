/**
 * Format an APG upstream watcher issue (title + body) from detected commits.
 *
 * The body includes a hidden HTML marker `<!-- apg-upstream:slug=<slug> -->`
 * which issue-manager.ts greps to find existing open issues for the same APG
 * slug. This survives title edits and related-pattern additions.
 */
import type { CommitSummary } from './github-client';
import type { SlugMapping } from './slug-resolver';

export interface IssueDraft {
  title: string;
  body: string;
  markerComment: string;
}

const MAX_MESSAGE_LEN = 120;

function sanitizeCommitMessage(message: string): string {
  // first line only, escape Markdown table-breaking chars
  const firstLine = message.split('\n')[0] ?? '';
  const trimmed =
    firstLine.length > MAX_MESSAGE_LEN ? firstLine.slice(0, MAX_MESSAGE_LEN - 1) + '…' : firstLine;
  return (
    trimmed
      // strip ASCII control chars (intentional)
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001F\u007F]/g, '')
      // escape Markdown table delimiters
      .replace(/\|/g, '\\|')
      // collapse remaining whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 10);
}

export function markerFor(apgSlug: string): string {
  return `<!-- apg-upstream:slug=${apgSlug} -->`;
}

/**
 * Per-batch marker embedded in each follow-up comment. Used by issue-manager
 * to detect "we already posted a comment for this exact latest SHA" and skip
 * re-posting on workflow retries where state push failed.
 */
export function batchMarkerFor(apgSlug: string, latestSha: string): string {
  return `<!-- apg-upstream-batch:slug=${apgSlug};latest=${latestSha} -->`;
}

export interface FormatIssueParams {
  mapping: SlugMapping;
  commits: CommitSummary[];
  /** ISO time used as "since" for this run. */
  since: string;
  /** ISO time used as "until" (typically now). */
  until: string;
  /** Previous lastSeenSha, used to build a compare URL when present. */
  previousSha: string | null;
  /** Upstream repo, e.g. "w3c/aria-practices". */
  upstreamRepo: string;
}

export function formatIssue(params: FormatIssueParams): IssueDraft {
  const { mapping, commits, since, until, previousSha, upstreamRepo } = params;
  const primary = mapping.primaryPattern;
  const slug = mapping.apgSlug;
  const today = formatDate(until);
  const title = `[APG Upstream] ${primary.name} に ${commits.length} 件の更新 (${today})`;

  const marker = markerFor(slug);
  const upstreamPath = `content/patterns/${slug}`;
  const latestSha = commits[0]?.sha;
  const compareUrl =
    previousSha && latestSha
      ? `https://github.com/${upstreamRepo}/compare/${previousSha}...${latestSha}`
      : null;

  const commitsTable = [
    '| 日付 | 著者 | メッセージ | リンク |',
    '|---|---|---|---|',
    ...commits.map((c) => {
      const short = c.sha.slice(0, 7);
      return `| ${formatDate(c.authorDate)} | ${sanitizeCommitMessage(c.authorName)} | ${sanitizeCommitMessage(c.message)} | [${short}](${c.htmlUrl}) |`;
    }),
  ].join('\n');

  const relatedSection =
    mapping.relatedPatterns.length > 0
      ? [
          '',
          '### 関連パターン（チェックリスト）',
          ...mapping.relatedPatterns.map(
            (p) =>
              `- [ ] [${p.name}](/patterns/${p.id}/) — 影響有無を確認 (\`src/patterns/${p.id}/\`)`
          ),
        ].join('\n')
      : '';

  const compareLine = compareUrl ? `- 比較: ${compareUrl}` : '';

  const body = `${marker}

## 概要
W3C aria-practices の \`${upstreamPath}/\` 配下に ${commits.length} 件の新規コミットを検知しました。

主担当パターン: [${primary.name}](/patterns/${primary.id}/) (\`src/patterns/${primary.id}/\`)
${relatedSection}

## 検知期間
- since: ${since}
- until: ${until}
- 監視パス: \`${upstreamPath}\`

## 新規コミット一覧
${commitsTable}

## 判定用チェックリスト
- [ ] 各コミットの diff を確認した
- [ ] 仕様レベルの変更か、エディトリアル（typo / リンク修正等）かを判別した
- [ ] 主担当パターンへの反映が必要か判断した
${mapping.relatedPatterns.length > 0 ? '- [ ] 関連パターンへの影響を確認した\n' : ''}- [ ] 反映が必要なら別 Issue を起票、不要ならこの Issue を close

## 関連リンク
- 上流 doc: https://www.w3.org/WAI/ARIA/apg/patterns/${slug}/
${compareLine}
`.trimEnd();

  return { title, body, markerComment: marker };
}

/**
 * Format a follow-up comment for an existing open issue when more commits land.
 * Embeds a batch marker (apg-slug + latest SHA) so we can detect duplicates
 * when a previous run failed before persisting state.
 */
export function formatFollowupComment(params: {
  apgSlug: string;
  commits: CommitSummary[];
  since: string;
  until: string;
}): string {
  const { apgSlug, commits, since, until } = params;
  const latestSha = commits[0]?.sha ?? '';
  const marker = batchMarkerFor(apgSlug, latestSha);
  const table = [
    '| 日付 | 著者 | メッセージ | リンク |',
    '|---|---|---|---|',
    ...commits.map((c) => {
      const short = c.sha.slice(0, 7);
      return `| ${formatDate(c.authorDate)} | ${sanitizeCommitMessage(c.authorName)} | ${sanitizeCommitMessage(c.message)} | [${short}](${c.htmlUrl}) |`;
    }),
  ].join('\n');

  return `${marker}

### 追加コミット ${commits.length} 件 (${formatDate(until)})

- since: ${since}
- until: ${until}

${table}
`;
}
