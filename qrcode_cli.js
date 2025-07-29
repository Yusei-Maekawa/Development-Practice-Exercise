// QRコード生成CLIツール（クラス版）
// 使用API: QR Server API (https://goqr.me/api/)
// 著者: Yusei-Maekawa

const readline = require('readline');
const https = require('https');
const fs = require('fs');

class QrCodeCliApp {
    // コンストラクタ: readlineインターフェースを初期化
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // QRコード生成
    generateQRCode(text, filename) {
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
        https.get(apiUrl, (res) => {
            const fileStream = fs.createWriteStream(filename);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`QRコード画像を「${filename}」として保存しました。`);
            });
        }).on('error', (err) => {
            console.error('QRコード生成に失敗しました:', err.message);
        });
    }

    // ユーザー入力受付
    promptUser() {
        this.rl.question('QRコード化したいテキストやURLを入力してください: ', (inputText) => {
            const filename = 'qrcode.png';
            this.generateQRCode(inputText, filename);
            this.rl.close();
        });
    }
}

// 実行
const app = new QrCodeCliApp();
app.promptUser();
