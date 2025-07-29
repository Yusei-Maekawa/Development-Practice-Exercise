// 名前の意味検索APIクライアントクラス
// agify.io（年齢推定）とgenderize.io（性別推定）を利用
class NameInfoApiClient {
    // 関数名: constructor
    // 役割: APIクライアントの初期化（エンドポイントURLを保持）
    constructor(agifyUrl, genderizeUrl) {
        this.agifyUrl = agifyUrl;
        this.genderizeUrl = genderizeUrl;
    }

    // 関数名: fetchNameInfo
    // 役割: 名前から年齢・性別を推定し、NameInfoクラスのインスタンスとして返す
    async fetchNameInfo(name) {
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
        try {
            // 年齢推定APIへリクエスト
            const ageRes = await fetch(`${this.agifyUrl}?name=${encodeURIComponent(name)}`);
            const ageData = await ageRes.json();
            // 性別推定APIへリクエスト
            const genderRes = await fetch(`${this.genderizeUrl}?name=${encodeURIComponent(name)}`);
            const genderData = await genderRes.json();
            // デバッグ用
            console.log('年齢APIレスポンス:', ageData);
            console.log('性別APIレスポンス:', genderData);
            return new NameInfo(name, ageData.age, genderData.gender, genderData.probability);
        } catch (error) {
            console.error('エラーが発生しました:', error.message);
            return null;
        }
    }
}

// 名前の意味データクラス
class NameInfo {
    // 関数名: constructor
    // 役割: 名前・年齢・性別・確信度を保持するデータクラス
    constructor(name, age, gender, probability) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.probability = probability;
    }
    // 関数名: getName
    // 役割: 名前を取得する
    getName() {
        return this.name;
    }
    // 関数名: getAge
    // 役割: 推定年齢を取得する
    getAge() {
        return this.age;
    }
    // 関数名: getGender
    // 役割: 推定性別を取得する
    getGender() {
        return this.gender;
    }
    // 関数名: getProbability
    // 役割: 性別推定の確信度を取得する
    getProbability() {
        return this.probability;
    }
}

// CLI部分
// 関数名: main（即時実行）
// 役割: ユーザーから名前を受け取り、年齢・性別を推定して表示する
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// APIクライアントを初期化（エンドポイントは公式）
const client = new NameInfoApiClient('https://api.agify.io', 'https://api.genderize.io');

// ユーザーに名前を尋ねて年齢・性別を推定
rl.question('名前を入力してください: ', async (name) => {
    // fetchNameInfoで年齢・性別を取得
    const info = await client.fetchNameInfo(name);
    if (info) {
        // 結果をわかりやすく表示
        console.log(`--- ${info.getName()} の推定 ---`);
        if (info.getAge() !== null) {
            console.log(`推定年齢: ${info.getAge()}歳`);
        } else {
            console.log('年齢の推定ができませんでした。');
        }
        if (info.getGender() !== null) {
            const percent = info.getProbability() !== null ? `（確信度: ${(info.getProbability()*100).toFixed(1)}%）` : '';
            console.log(`推定性別: ${info.getGender()}${percent}`);
        } else {
            console.log('性別の推定ができませんでした。');
        }
    } else {
        console.log('情報の取得に失敗しました。');
    }
    rl.close();
});
