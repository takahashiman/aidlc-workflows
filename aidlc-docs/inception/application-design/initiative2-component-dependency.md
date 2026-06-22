# Application Design — Component Dependency（イニシアチブ#2）

> repo 跨ぎの依存マトリクス・通信・データフロー。

## repo 配置
- **FIG-UDS Core**（正典・別 repo）: C-Palette（signature/Taste ユーティリティ・新規）/ Core semantic・signature 機構 / 昇格先。
- **BusDelayAlerts（LLocana）**（実開発・別 repo `feature/figuds-adoption`）: C-Distrib / C-Signature / C-Bridge / C-UXFlow。
- **aidlc-workflows（ポータル）**: C-PortalIA / C-Record / S-Collection（既存）。

## 依存マトリクス（→ は「依存する」）
| from \ to | C-Palette(Core) | Core semantic | C-Distrib | C-Signature | C-Bridge | C-PortalIA | C-Promo | C-UXFlow |
|---|---|---|---|---|---|---|---|---|
| C-Signature | ◎ |  | ○ |  |  |  |  |  |
| C-Bridge |  | ◎ | ◎ | ○ |  |  |  |  |
| C-Distrib |  | ○ |  |  |  |  |  |  |
| C-PortalIA |  | ○(content rolling) |  |  |  |  |  |  |
| C-Promo |  | ◎(昇格先) |  | ○ | ○ |  |  |  |
| C-UXFlow |  |  | ○(build) |  | ○ |  |  |  |

## データフロー（主経路）
```text
[LLocana main color #2C6B5E]
        │ seed
        ▼
  C-Signature.injectSignature ──calls──► C-Palette.generate*(Core)  ──emit──► --signature-* / --status-*
                                                   │ (a11y validate 必須)
                                                   ▼
                                            Core semantic 層
                                                   │
   C-Distrib(submodule pin + import) ──provides──► Core CSS（primitives/semantic/tokens）
                                                   │
                                            C-Bridge（semantic → Tailwind @theme 1枚）
                                                   │
                                     既存 shadcn/Radix コンポーネント（Core 色で描画・構造保持）
                                                   │
                                      vite build 非回帰 ✓ / 三層ガードレール ✓

[ドメインパターン arrival-card 等] ─C-Promo.extract→toLivePreview→Issue+PR→ FIG-UDS Core（昇格）

[Core content] ─rolling→ C-PortalIA（役割別入口/シナリオ/オンボ/閲覧余白/GitHub案内）→ 公開ポータル
[各ステップ] ─C-Record→ dev-flow-journal / session-log → ポータル素材
```

## 通信・結合の要点
- **Core ⇄ 製品**: 片方向（製品が Core を pin 取込）＋ 昇格時のみ製品→Core（PR）。疎結合（submodule・PR）。
- **Core ⇄ ポータル**: rolling（ポータルが Core content を毎ビルド取込・pin しない）。
- **C-Palette は Core 側に置く**ことで、全アプリが seed 駆動生成を共有（Taste 派生の基盤）。
- **C-Bridge は製品ローカル1枚**に閉じ、before↔after を明瞭化（AD1=A）。

## 更新順序（Critical Path）
1. **U2-1**: C-Palette（Core 側・seed 駆動生成＋status＋a11y）→ C-Signature → C-Distrib → C-Bridge（配布・トークン基盤）。
2. **U2-2**: 状態色 semantic 化・生 HEX 解消（スタイル適用）。
3. **U2-5**: C-Promo（蓄積後に昇格）。
4. 並行可: **U2-3/U2-4**（ポータル IA・操作完結）、**U2-6**（UX 改修）。

## リスクと境界
- **C-Palette を Core に新設**＝Core 変更（goal① の「Core を都度修正」に該当・US-X1 と整合）。Core CI（三層・a11y）で守る。
- **a11y 必須**（AD5-2=B）: status/on-color が AA 不合格なら採用不可（生成失敗扱い）。
- 既存非回帰: C-Bridge は色の差し替えに留め、shadcn 構造を書き換えない。
