---
name: APG Upstream Update
about: 手動起票用テンプレ。日次の自動 watcher が起票する Issue と同じフォーマット。
title: '[APG Upstream] <Pattern Name> に N 件の更新 (YYYY-MM-DD)'
labels: apg-upstream
---

<!-- apg-upstream:slug=<apg-slug> -->

## 概要

W3C aria-practices の `content/patterns/<apg-slug>/` 配下の更新内容を記述。

主担当パターン: [<Pattern Name>](/patterns/<id>/) (`src/patterns/<id>/`)

### 関連パターン（チェックリスト）

- [ ] [<Related Pattern>](/patterns/<related-id>/) — 影響有無を確認

## 検知期間

- since: <ISO8601>
- until: <ISO8601>
- 監視パス: `content/patterns/<apg-slug>`

## 新規コミット一覧

| 日付 | 著者 | メッセージ | リンク |
| ---- | ---- | ---------- | ------ |
|      |      |            |        |

## 判定用チェックリスト

- [ ] 各コミットの diff を確認した
- [ ] 仕様レベルの変更か、エディトリアル（typo / リンク修正等）かを判別した
- [ ] 主担当パターンへの反映が必要か判断した
- [ ] 反映が必要なら別 Issue を起票、不要ならこの Issue を close

## 関連リンク

- 上流 doc: https://www.w3.org/WAI/ARIA/apg/patterns/<apg-slug>/
- 比較: https://github.com/w3c/aria-practices/compare/<prevSha>...<latestSha>
