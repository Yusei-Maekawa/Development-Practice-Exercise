const fetch = require('node-fetch');
const readline = require('readline');

// ExchangeRate-APIのAPIキーをここに入力してください
const API_KEY = 'YOUR_API_KEY';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

// ユーザー入力を取得するためのインターフェース
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 通貨換算関数
async function convertCurrency(amount, fromCurrency, toCurrency) {
    try {
        const response = await fetch(`${API_URL}${fromCurrency}`);
        const data = await response.json();

        if (data.result === 'success') {
            const rate = data.conversion_rates[toCurrency];
            if (!rate) {
                console.log(`指定された通貨 "${toCurrency}" は無効です。`);
                return;
            }
            const convertedAmount = (amount * rate).toFixed(2);
            console.log(`${amount} ${fromCurrency} は ${convertedAmount} ${toCurrency} です。`);
        } else {
            console.log('通貨データの取得に失敗しました:', data['error-type']);
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