# ニュースリーダーアプリ

NewsAPIを使用した最新ニュースリーダーアプリケーションです。

## 機能

- 最新ニュースの表示
- キーワード検索
- カテゴリ別ニュース表示
- レスポンシブデザイン

## セットアップ

1. NewsAPIのAPIキーを取得
   - [NewsAPI](https://newsapi.org/)にアクセス
   - 無料アカウントを作成
   - APIキーを取得

2. APIキーの設定
   - `script.js`ファイルの`NEWS_API_KEY`変数に取得したAPIキーを設定

```javascript
const NEWS_API_KEY = 'YOUR_API_KEY_HERE'; // ここにAPIキーを入力
```

## 使用方法

1. `index.html`をブラウザで開く
2. キーワードを入力してニュースを検索
3. カテゴリを選択してニュースをフィルタリング
4. 記事タイトルをクリックして詳細を読む

## 技術仕様

- HTML5
- CSS3 (Flexbox/Grid)
- Vanilla JavaScript
- NewsAPI

## 注意事項

- NewsAPIの無料プランでは1日あたり1000リクエストまで
- デモ用にサンプルニュースが表示されます
- 実際のAPIを使用する場合は、APIキーの設定が必要です

## ファイル構成

```
├── index.html      # メインHTMLファイル
├── style.css       # スタイルシート
├── script.js       # JavaScript機能
└── README.md       # このファイル
```

## カスタマイズ

- `style.css`でデザインを変更可能
- `script.js`で機能を追加可能
- 他のニュースAPIにも対応可能
