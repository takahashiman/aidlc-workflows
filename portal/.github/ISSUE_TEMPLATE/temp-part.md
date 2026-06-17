---
name: 仮パーツ作成（鶏卵回避）
about: Core に無い部品を製品 Extensions 層に仮実装した記録（US-2.5 / BR-DOG-2）
title: "[temp-part] <部品名>"
labels: ["temp-part"]
---

> このテンプレは U2 が定義する正典。製品/template(U3) repo が採用し、自動起票は U5(CI) が実装する。

## 仮パーツ

- 部品名:
- 所属製品 (repo):
- 配置 (Extensions 層のパス):

## なぜ Core に無いか / 暫定実装の概要

<!-- 数行で。完璧な普遍化は不要（Maintainer 伴走） -->

## Core 還元（昇格）検討

- [ ] 3プロダクト基準到達前でも showcase に載せて発見可能にする
- [ ] 昇格を提案する場合は `core-promotion` Issue を別途起票（使い方 › 昇格提案）

## 撤去条件（BR-DOG-4/5）

- [ ] 同名が Core registry に `kind:"core"` で出現 → rolling 取得後に仮コードを撤去
