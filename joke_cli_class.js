// JokeAPIを利用し、ランダムな英語ジョークを取得するクライアントクラス
class JokeApiClient {
    /**
     * @param {string} apiUrl JokeAPIのエンドポイントURL
     */
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    /**
     * JokeAPIからジョークを取得し、Jokeクラスのインスタンスとして返す
     * @returns {Promise<Joke>}
     */
    async fetchJoke() {
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            // デバッグ用
            console.log('APIレスポンス:', data);
            if (data.type === 'single') {
                return new Joke(data.type, data.joke, null, null);
            } else if (data.type === 'twopart') {
                return new Joke(data.type, null, data.setup, data.delivery);
            } else {
                return null;
            }
        } catch (error) {
            console.error('エラーが発生しました:', error.message);
            return null;
        }
    }
}

// ジョークのデータクラス
class Joke {
    /**
     * @param {string} type ジョークのタイプ（single/twopart）
     * @param {string|null} joke 本文（singleの場合）
     * @param {string|null} setup setup文（twopartの場合）
     * @param {string|null} delivery delivery文（twopartの場合）
     */
    constructor(type, joke, setup, delivery) {
        this.type = type;
        this.joke = joke;
        this.setup = setup;
        this.delivery = delivery;
    }
    getType() {
        return this.type;
    }
    getJoke() {
        return this.joke;
    }
    getSetup() {
        return this.setup;
    }
    getDelivery() {
        return this.delivery;
    }
}

// CLI部分
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new JokeApiClient('https://v2.jokeapi.dev/joke/Any');

rl.question('ジョークを表示しますか？ (y/n): ', async (answer) => {
    if (answer.trim().toLowerCase() === 'y') {
        const joke = await client.fetchJoke();
        if (joke) {
            if (joke.getType() === 'single') {
                console.log(`ジョーク: ${joke.getJoke()}`);
            } else if (joke.getType() === 'twopart') {
                console.log(`ジョーク: ${joke.getSetup()}\n${joke.getDelivery()}`);
            } else {
                console.log('ジョークの取得に失敗しました。');
            }
        } else {
            console.log('ジョークの取得に失敗しました。');
        }
        rl.close();
    } else {
        console.log('終了します。');
        rl.close();
    }
});
