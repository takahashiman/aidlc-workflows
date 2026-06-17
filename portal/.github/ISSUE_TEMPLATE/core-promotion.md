---
name: Core 昇格提案
about: 独自/仮パーツの Core DS 昇格を低ハードルで提案（US-4.4 / US-5.2 / BR-DOG-6）
title: "[core-promotion] <部品名>"
labels: ["core-promotion"]
---

> 低ハードル＝3行でOK。普遍化・a11y 仕上げは Core Maintainer が伴走する（提案者に課さない / US-4.4 AC1）。

## 3行提案
- 何を:
- なぜ（価値・再利用見込み）:
- どこで使っているか（製品/画面）:

---
（以下は Maintainer 伴走で埋める）

## 昇格判定チェック（US-4.4 AC3）
- [ ] 3プロファイル成立（admin / consumer / terminal）
- [ ] トークン階層遵守（Semantic のみ参照・生値なし）
- [ ] WCAG 2.1 AA
- [ ] spec.md / preview 完備

## レビュー / リリース
- [ ] 影響度判定（軽微=1名即決 / 重大=2名: デザイナー＋エンジニア）
- [ ] MINOR のリリース列車に乗せる（破壊的変更は MAJOR＋移行ガイド）
