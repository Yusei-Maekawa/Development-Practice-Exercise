// node-fetchを動的importで読み込む（APIリクエスト用）
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// readlineでコマンドライン入力を受け付ける
const readline = require('readline');

// 標準入力・出力でインターフェース作成
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// JokeAPIからジョークを取得して表示する関数
async function getJoke() {
    try {
        // APIエンドポイント
        const url = 'https://v2.jokeapi.dev/joke/Any';
        // APIへリクエスト
        const response = await fetch(url);
        const data = await response.json();

        // 取得したAPIレスポンスを表示（デバッグ用）
        console.log('APIレスポンス:', data);

        // ジョークの種類によって出力を分岐
        if (data.type === 'single') {
            // 1文タイプのジョーク
            console.log(`ジョーク: ${data.joke}`);
        } else if (data.type === 'twopart') {
            // setup/delivery形式のジョーク
            console.log(`ジョーク: ${data.setup}\n${data.delivery}`);
        } else {
            // それ以外は失敗扱い
            console.log('ジョークの取得に失敗しました。');
        }
    } catch (error) {
        // 通信エラー等
        console.error('エラーが発生しました:', error.message);
    }
}

// ユーザーにジョーク表示の可否を尋ねる
rl.question('ジョークを表示しますか？ (y/n): ', (answer) => {
    if (answer.trim().toLowerCase() === 'y') {
        // yならジョーク取得・表示
        getJoke().then(() => rl.close());
    } else {
        // nなら終了
        console.log('終了します。');
        rl.close();
    }
});
