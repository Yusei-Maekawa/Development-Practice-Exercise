// DeepL翻訳CLIツール（クラス版）
// 使用API: DeepL API (https://www.deepl.com/docs-api)
// 著者: Yusei-Maekawa

const readline = require('readline');
const https = require('https');

class DeepLCliApp {
    // コンストラクタ: readlineインターフェースを初期化
    constructor(apiKey) {
        this.apiKey = apiKey; // DeepL APIキー
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // DeepL翻訳APIを呼び出して翻訳結果を表示
    translateText(text, targetLang) {
        const data = new URLSearchParams({
            auth_key: this.apiKey,
            text: text,
            target_lang: targetLang
        }).toString();

        const options = {
            hostname: 'api-free.deepl.com',
            path: '/v2/translate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                try {
                    const result = JSON.parse(body);
                    if (result.translations && result.translations[0]) {
                        console.log('翻訳結果:', result.translations[0].text);
                    } else {
                        console.log('翻訳に失敗しました。');
                    }
                } catch (e) {
                    console.log('APIレスポンス解析エラー:', e.message);
                }
            });
        });
        req.on('error', (e) => {
            console.error('APIリクエストエラー:', e.message);
        });
        req.write(data);
        req.end();
    }

    // ユーザー入力受付
    promptUser() {
        this.rl.question('翻訳したいテキストを入力してください: ', (inputText) => {
            this.rl.question('翻訳先の言語コードを入力してください（例: EN, JA, FR, DE など）: ', (lang) => {
                this.translateText(inputText, lang.toUpperCase());
                this.rl.close();
            });
        });
    }
}

// 実行例: APIキーは自分のDeepLアカウントから取得してください
// const app = new DeepLCliApp('YOUR_DEEPL_API_KEY');
// app.promptUser();
