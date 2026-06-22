# Application Design（統合版）— イニシアチブ#2

> 本書は `initiative2-{components, component-methods, services, component-dependency}.md` の統合サマリ。
> 確定: AD1=A / AD2=C / AD3=A / AD4=A / AD5=A / AD5-2=B。

## 設計の骨子
1. **C-Palette（Core 新設・中核）**: seed 駆動の**パレット生成メソッド**。アプリのメインカラーを seed に、
   OKLCH で signature 派生（base/light/dark/tint/shadow/on-color/任意 ramp）と **status 色**を生成し、
   **WCAG AA を必須検証**。signature 機構を**パラメトリック化**＝**Taste 派生**の基盤（LLocana が初適用）。
2. **配布（C-Distrib）＋ブリッジ（C-Bridge）**: Core を submodule pin＋Vite import し、
   **専用ブリッジ CSS 1枚**で Core semantic→Tailwind `@theme` を対応づけ。既存 shadcn 構造を壊さず Core 色へ。
3. **ポータル IA（C-PortalIA）**: 本文は Core 正典、ポータルは**入口導線・新ビュー**に集中（役割別入口/2シナリオ/
   getting-started 分離/オンボ/閲覧余白/GitHub 操作案内）。
4. **Core 昇格（C-Promo）**: ドメインパターンを Live Preview 形式化し **Issue 导线＋PR** で提案→マージ→昇格確認。
5. **UX 改修（C-UXFlow）**: Pencil を**設計参照**に画面遷移/UX を改善（実装が正典・非回帰）。
6. **記録（C-Record）**: journal/session-log を継続しポータル素材化。

## コンポーネント一覧（責務 1 行）
| Component | 所在 | 責務 |
|---|---|---|
| C-Palette ★ | Core | seed→signature/status パレット生成（OKLCH・a11y 必須） |
| C-Signature | 製品 | LLocana seed を C-Palette へ渡し適用（旧 teal-* 置換） |
| C-Distrib | 製品 | Core submodule pin＋Vite import＋build 非回帰 |
| C-Bridge | 製品 | Core semantic→Tailwind @theme（専用1枚） |
| C-PortalIA | ポータル/Core | 役割別入口・シナリオ・オンボ・閲覧余白・GitHub 案内 |
| C-Promo | 製品⇄Core | 抽出→LivePreview→Issue+PR→昇格確認 |
| C-UXFlow | 製品/Pencil | 画面遷移/UX を Pencil 設計参照→実装反映 |
| C-Record | ポータル | journal/session-log のポータル素材化 |

## サービス → Unit
| Service | Unit | 主 repo |
|---|---|---|
| S-Distribution | U2-1, U2-2 | 製品（＋Core: C-Palette） |
| S-PortalDelivery | U2-3, U2-4 | ポータル（＋Core content） |
| S-Promotion | U2-5 | Core ⇄ 製品 |
| S-UXRefine | U2-6 | 製品/Pencil |
| S-Collection（確認） | — | ポータル |

## 設計上の重要決定（根拠つき）
- **C-Palette を Core に置く（AD5=A）**: 全アプリが seed 駆動生成を共有。Core 変更は goal① の「Core 都度修正」と整合し US-X1 に内包し得る。
- **status 色も生成法則化＋a11y 必須（AD5-2=B）**: ブランド調和と可読性を両立。AA 不合格は採用不可。
- **ブリッジは製品ローカル1枚（AD1=A）**: 生成はパレット（C-Palette）に閉じ、ブリッジは静的対応に限定。before↔after 明瞭。
- **本文 Core・IA ポータル（AD3=A）**: rolling 設計を崩さず、ポータル改修を IA に限定。
- **Pencil＝設計参照（AD4=A）**: 実装正典はコード。UX 改修は非回帰を最優先。

## Functional Design へ送る詳細（各 Unit で具体化）
- C-Palette の派生 Δ 値・ramp 段数・status の調和規則・a11y fallback の正確仕様。
- C-Bridge の semantic→@theme 完全対応表。
- 状態色（正常/遅延/運休）の semantic 割付と生 HEX 解消の画面別手順。
- C-Promo の昇格対象パターンの最終選定と spec 仕様。

## トレーサビリティ
- AC①-1=C-Signature/C-Palette / AC①-2=状態色(C-Bridge+semantic) / AC①-3=生HEX解消 / AC①-4=C-Distrib / AC①-5=記録(before↔after)。
- AC②=C-PortalIA + C-Record（主要4操作・GitHub 案内・セルフ検証）。
- スコープ拡張: C-Promo（US-X1 昇格実行）・C-UXFlow（US-X2 UX 改修）・C-Palette の status 生成（AD5-2）。
