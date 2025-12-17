# プロジェクトルール

- 必ず日本語で回答しなさい
- 回答をする際に必ずエビデンスを提出しなさい
- 私の質問と回答に対して必ず肯定的な意見をもつな
- 会話は常にディスカッション方式を採用しなさい
- 揚げ足をとる会話ではなく常にベストプラクティに向かったやり取りを意識しろ
- 常に数ある実装のうち過剰に複雑、簡略化せずにシンプルに理にかなった実装方法を考案しなさい
- 回答はエビデンスを元に回答しなさい
- 変数、定数の命名は他コミュニティを参考に一般的な名前を命名しなさい
- いきなりコードの変更は行わずにまず処理フローを具体的に解説を行いそのあと反映するかどうかの確認を必ずしなさい。

# 命名規則

- PascalCase
  React, Vue, Astro などのコンポーネント
- camelCase
  JavaScript / TypeScript などの関数
- PascalCase
  クラス、型・インターフェース
- kebab-case
  ディレクトリ名,css クラス名

# コミットメッセージルール

- このプロジェクトでは、[Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/)の規約に従ってコミットメッセージを作成します。
- git diff --cached --name-only を行い、現在のステージング内容を元にコミットメッセージを考案しなさい。
- メッセージは英語と日本語それぞれで考えなさい

## 基本フォーマット

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 必須要素

- **`<type>`**: コミットの種類を示すプレフィックス
- **`<description>`**: 変更内容の簡潔な説明（50 文字以内）

### オプション要素

- **`[optional scope]`**: 変更が影響を与える範囲（括弧で囲む）
- **`[optional body]`**: 変更の詳細や背景（72 文字/行）
- **`[optional footer(s)]`**: 関連する Issue 番号や破壊的変更の通知

## Type（必須）

以下の中から選択してください：

- **feat**: 新機能の追加（コンポーネント、ページ、機能追加）
- **fix**: バグ修正
- **update**: 既存機能の改善・修正（破壊的変更なし）
- **refactor**: リファクタリング（機能変更なし）
- **perf**: パフォーマンス改善
- **style**: コードフォーマット、スタイル修正（機能変更なし）
- **test**: テストの追加・修正
- **docs**: ドキュメントの追加・修正
- **build**: ビルドシステム・依存関係の変更
- **ci**: CI/CD 設定の変更
- **chore**: その他の雑務（gitignore、設定ファイルなど）
- **revert**: 以前のコミットの取り消し

## Scope（オプション）

プロジェクト構造に基づいて以下から選択：

- **ui**: 汎用 UI コンポーネント
- **layout**: レイアウトコンポーネント
- **page**: ページ固有コンポーネント
- **icon**: アイコン関連
- **style**: スタイル・SCSS 関連
- **type**: TypeScript 型定義
- **store**: 状態管理
- **util**: ユーティリティ関数
- **integration**: Astro インテグレーション
- **config**: 設定ファイル

### インフラ・運用

- **deploy**: デプロイ関連
- **deps**: 依存関係

## Description（必須）

- 日本語または英語で簡潔に記述
- 命令形で記述（「追加する」ではなく「追加」）
- 最初の文字は小文字
- 末尾にピリオドは不要
- 50 文字以内推奨

## 破壊的変更の表記

API の破壊的変更を伴う場合、以下のいずれかの方法で明示します。

### 方法 1: `!`を使用

```
feat(ui)!: ボタンコンポーネントのAPIを変更
```

### 方法 2: `BREAKING CHANGE`フッターを使用

```
feat(ui): ボタンコンポーネントのAPIを変更

BREAKING CHANGE: propsのvariantが必須になりました
```

## コミットメッセージ例

### 機能追加・修正

```
feat(ui): ドロップダウンメニューコンポーネントを追加

fix(page): 求人詳細ページのレイアウト崩れを修正

update(layout): ヘッダーナビゲーションのスタイルを改善
```

### リファクタリング・スタイル

```
refactor(util): 画像処理関数をモジュール化

style(component): ESLintルールに従ってフォーマット修正
```

### テスト・ドキュメント

```
test(ui): カルーセルコンポーネントのE2Eテストを追加

docs: README.mdの環境構築手順を更新
```

### ビルド・CI/CD

```
build(deps): Astroを5.2.3にアップデート

ci: Vercelのビルド設定を最適化

chore: .gitignoreにログファイルを追加
```

## 禁止事項

### 重複を避ける

❌ **悪い例**

```
feat: add new feature
fix: fix login bug
docs: add documentation
```

✅ **良い例**

```
feat: implement user authentication
fix: resolve login validation issue
docs: update installation guide
```

### 曖昧な表現を避ける

❌ **悪い例**

```
fix: fix stuff
feat: add things
update: update code
```

✅ **良い例**

```
fix: resolve navigation menu alignment
feat: implement dark mode toggle
refactor: simplify component structure
```

## コミット時のルール

### 1. 1 コミット 1 変更

関連する変更のみをまとめる

### 2. 原子性の確保

各コミットは単独で動作する状態にする

### 3. 品質チェック必須

コミット前に以下を実行：

```bash
npm run lint    # リント実行
npm run build   # ビルド確認
```

### 4. ブランチ運用の遵守

- `staging`ブランチ経由でのマージを推奨
- `main`ブランチへの直接コミットは禁止

## 自動化ツールとの連携

このルールに従うことで、以下の自動化が可能になります：

- **リリースノートの自動生成**
- **セマンティックバージョニング**
- **変更履歴の自動分類**
- **Issue との自動連携**

## 運用ガイドライン

1. **一貫性の維持**: チーム全体でこのフォーマットを遵守
2. **明確なメッセージ**: 変更内容が一目で理解できるよう簡潔かつ具体的に記述
3. **適切な粒度**: 1 つの論理的な変更を 1 つのコミットにまとめる
4. **検索性**: 後から変更内容を探しやすいメッセージを作成

## 参考リンク

- [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format)
- [Commitizen](https://github.com/commitizen/cz-cli) - コミットメッセージの対話的作成ツール

主な改善点：

1. **構造の統合**: 2 つのファイルの良い部分を統合し、重複を排除
2. **日本語対応**: プロジェクト固有のスコープ例を日本語で記載
3. **実用的な例**: 実際のプロジェクトで使用される具体的なコミットメッセージ例を追加
4. **禁止事項の明確化**: 悪い例と良い例を対比して分かりやすく説明
5. **運用ガイドライン**: 実際の開発フローに即したルールを追加
6. **自動化の説明**: このルールを守ることで得られるメリットを明記

この統合版は、プロジェクトの特性を活かしながら、Conventional Commits の規約に準拠した実用的なルールとなっています。

# コミットメッセージルール

このプロジェクトでは、[Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/)の規約に従ってコミットメッセージを作成します。
git diff --cached --name-only を行い、現在のステージング内容を元にコミットメッセージを考案しなさい。

## 基本フォーマット

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 必須要素

- **`<type>`**: コミットの種類を示すプレフィックス
- **`<description>`**: 変更内容の簡潔な説明（50 文字以内）

### オプション要素

- **`[optional scope]`**: 変更が影響を与える範囲（括弧で囲む）
- **`[optional body]`**: 変更の詳細や背景（72 文字/行）
- **`[optional footer(s)]`**: 関連する Issue 番号や破壊的変更の通知

## Type（必須）

以下の中から選択してください：

- **feat**: 新機能の追加（コンポーネント、ページ、機能追加）
- **fix**: バグ修正
- **update**: 既存機能の改善・修正（破壊的変更なし）
- **refactor**: リファクタリング（機能変更なし）
- **perf**: パフォーマンス改善
- **style**: コードフォーマット、スタイル修正（機能変更なし）
- **test**: テストの追加・修正
- **docs**: ドキュメントの追加・修正
- **build**: ビルドシステム・依存関係の変更
- **ci**: CI/CD 設定の変更
- **chore**: その他の雑務（gitignore、設定ファイルなど）
- **revert**: 以前のコミットの取り消し

## Scope（オプション）

プロジェクト構造に基づいて以下から選択：

- **ui**: 汎用 UI コンポーネント
- **layout**: レイアウトコンポーネント
- **page**: ページ固有コンポーネント
- **icon**: アイコン関連
- **style**: スタイル・SCSS 関連
- **type**: TypeScript 型定義
- **store**: 状態管理
- **util**: ユーティリティ関数
- **integration**: Astro インテグレーション
- **config**: 設定ファイル

### インフラ・運用

- **deploy**: デプロイ関連
- **deps**: 依存関係

## Description（必須）

- 日本語または英語で簡潔に記述
- 命令形で記述（「追加する」ではなく「追加」）
- 最初の文字は小文字
- 末尾にピリオドは不要
- 50 文字以内推奨

## 破壊的変更の表記

API の破壊的変更を伴う場合、以下のいずれかの方法で明示します。

### 方法 1: `!`を使用

```
feat(ui)!: ボタンコンポーネントのAPIを変更
```

### 方法 2: `BREAKING CHANGE`フッターを使用

```
feat(ui): ボタンコンポーネントのAPIを変更

BREAKING CHANGE: propsのvariantが必須になりました
```

## コミットメッセージ例

### 機能追加・修正

```
feat(ui): ドロップダウンメニューコンポーネントを追加

fix(page): 求人詳細ページのレイアウト崩れを修正

update(layout): ヘッダーナビゲーションのスタイルを改善
```

### リファクタリング・スタイル

```
refactor(util): 画像処理関数をモジュール化

style(component): ESLintルールに従ってフォーマット修正
```

### テスト・ドキュメント

```
test(ui): カルーセルコンポーネントのE2Eテストを追加

docs: README.mdの環境構築手順を更新
```

### ビルド・CI/CD

```
build(deps): Astroを5.2.3にアップデート

ci: Vercelのビルド設定を最適化

chore: .gitignoreにログファイルを追加
```

## 禁止事項

### 重複を避ける

❌ **悪い例**

```
feat: add new feature
fix: fix login bug
docs: add documentation
```

✅ **良い例**

```
feat: implement user authentication
fix: resolve login validation issue
docs: update installation guide
```

### 曖昧な表現を避ける

❌ **悪い例**

```
fix: fix stuff
feat: add things
update: update code
```

✅ **良い例**

```
fix: resolve navigation menu alignment
feat: implement dark mode toggle
refactor: simplify component structure
```

## コミット時のルール

### 1. 1 コミット 1 変更

関連する変更のみをまとめる

### 2. 原子性の確保

各コミットは単独で動作する状態にする

### 3. 品質チェック必須

コミット前に以下を実行：

```bash
npm run lint    # リント実行
npm run build   # ビルド確認
```

### 4. ブランチ運用の遵守

- `staging`ブランチ経由でのマージを推奨
- `main`ブランチへの直接コミットは禁止

## 自動化ツールとの連携

このルールに従うことで、以下の自動化が可能になります：

- **リリースノートの自動生成**
- **セマンティックバージョニング**
- **変更履歴の自動分類**
- **Issue との自動連携**

## 運用ガイドライン

1. **一貫性の維持**: チーム全体でこのフォーマットを遵守
2. **明確なメッセージ**: 変更内容が一目で理解できるよう簡潔かつ具体的に記述
3. **適切な粒度**: 1 つの論理的な変更を 1 つのコミットにまとめる
4. **検索性**: 後から変更内容を探しやすいメッセージを作成

## 参考リンク

- [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format)
- [Commitizen](https://github.com/commitizen/cz-cli) - コミットメッセージの対話的作成ツール

主な改善点：

1. **構造の統合**: 2 つのファイルの良い部分を統合し、重複を排除
2. **日本語対応**: プロジェクト固有のスコープ例を日本語で記載
3. **実用的な例**: 実際のプロジェクトで使用される具体的なコミットメッセージ例を追加
4. **禁止事項の明確化**: 悪い例と良い例を対比して分かりやすく説明
5. **運用ガイドライン**: 実際の開発フローに即したルールを追加
6. **自動化の説明**: このルールを守ることで得られるメリットを明記

この統合版は、プロジェクトの特性を活かしながら、Conventional Commits の規約に準拠した実用的なルールとなっています。
