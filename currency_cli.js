// Node.js用通貨換算CUIスクリプト
// 使い方: node currency_cli.js JPY USD 100

const https = require('https');

const [,, from, to, amount] = process.argv;

if (!from || !to || !amount || isNaN(amount) || amount <= 0) {
    console.log('使い方: node currency_cli.js <FROM> <TO> <AMOUNT>');
    process.exit(1);
}

const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;

console.log('換算中...');
https.get(url, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const result = JSON.parse(data);
            console.log('APIレスポンス:', result); // デバッグ表示
            if (result.success && result.result !== undefined) {
                console.log(`${amount} ${from} = ${result.result.toFixed(2)} ${to}`);
            } else {
                console.log('換算に失敗しました。');
            }
        } catch (e) {
            console.log('APIエラーが発生しました。');
        }
    });
}).on('error', () => {
    console.log('APIエラーが発生しました。');
});
