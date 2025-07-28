const readline = require('readline');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// ユーザー入力を取得するためのインターフェース
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 通貨換算関数
async function convertCurrency(amount, fromCurrency, toCurrency) {
    try {
        const url = `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
        const response = await fetch(url);
        const data = await response.json();

        // デバッグ用にAPIレスポンスを表示
        console.log('APIレスポンス:', data);

        if (data.success && data.result !== undefined) {
            console.log(`${amount} ${fromCurrency} は ${data.result.toFixed(2)} ${toCurrency} です。`);
        } else {
            console.log('換算に失敗しました。');
        }
    } catch (error) {
        console.error('エラーが発生しました:', error.message);
    }
}

// ユーザー入力を処理
rl.question('金額を入力してください: ', (amount) => {
    rl.question('変換元の通貨コードを入力してください (例: USD): ', (fromCurrency) => {
        rl.question('変換先の通貨コードを入力してください (例: JPY): ', (toCurrency) => {
            convertCurrency(parseFloat(amount), fromCurrency.toUpperCase(), toCurrency.toUpperCase());
            rl.close();
        });
    });
});