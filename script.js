// NewsAPI設定
const NEWS_API_KEY = 'd7deb00b974a4086b25c6b0ff94a3313'; // NewsAPIのAPIキーを入力してください
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// DOM要素の取得
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('category');
const newsResults = document.getElementById('newsResults');
const loading = document.getElementById('loading');

// 初期化
document.addEventListener('DOMContentLoaded', function () {
    loadNews();

    // Enterキーでの検索
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchNews();
        }
    });

    // カテゴリ変更時の検索
    categorySelect.addEventListener('change', function () {
        searchNews();
    });
});

// ニュースを検索する関数
async function searchNews() {
    const query = searchInput.value.trim();
    const category = categorySelect.value;

    showLoading();

    try {
        let url;

        if (category) {
            // カテゴリが選択された場合はtop-headlinesエンドポイントを使用
            url = `https://newsapi.org/v2/top-headlines?apiKey=${NEWS_API_KEY}&category=${category}&country=jp&pageSize=20`;
            if (query) {
                url += `&q=${encodeURIComponent(query)}`;
            }
        } else {
            // カテゴリが選択されていない場合はeverythingエンドポイントを使用
            url = `${NEWS_API_URL}?apiKey=${NEWS_API_KEY}&language=ja&sortBy=publishedAt&pageSize=20`;
            if (query) {
                url += `&q=${encodeURIComponent(query)}`;
            } else {
                // デフォルトで日本のニュースを取得
                url += `&q=日本`;
            }
        }

        const response = await fetch(url);
        const data = await response.json();

        // デバッグ用にAPIレスポンスをログ出力
        console.log('APIリクエストURL:', url);
        console.log('APIレスポンス:', data);

        if (data.status === 'ok') {
            displayNews(data.articles);
        } else {
            showError(data.message || 'ニュースの取得に失敗しました');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('ニュースの取得中にエラーが発生しました');
    }
}

// デフォルトニュースを読み込む関数
async function loadNews() {
    showLoading();

    try {
        // 実際のNewsAPIから日本のニュースを取得
        let url = `${NEWS_API_URL}?apiKey=${NEWS_API_KEY}&q=日本&language=ja&sortBy=publishedAt&pageSize=20`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'ok') {
            displayNews(data.articles);
        } else {
            showError(data.message || 'ニュースの取得に失敗しました');
        }
    } catch (error) {
        console.error('Error loading news:', error);
        showError('ニュースの読み込み中にエラーが発生しました');
    }
}

// ニュースを表示する関数
function displayNews(articles) {
    hideLoading();

    if (!articles || articles.length === 0) {
        newsResults.innerHTML = '<div class="no-results">ニュースが見つかりませんでした。</div>';
        return;
    }

    const newsHTML = articles.map(article => {
        const publishedDate = new Date(article.publishedAt).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="news-item">
                <h3>${article.title || 'タイトル不明'}</h3>
                <p>${article.description || '詳細情報はありません。'}</p>
                <div class="source">出典: ${article.source?.name || '不明'}</div>
                <div class="published">公開日: ${publishedDate}</div>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer">記事を読む</a>
            </div>
        `;
    }).join('');

    newsResults.innerHTML = newsHTML;
}

// ローディング表示
function showLoading() {
    loading.style.display = 'block';
    newsResults.innerHTML = '';
}

// ローディング非表示
function hideLoading() {
    loading.style.display = 'none';
}

// エラー表示
function showError(message) {
    hideLoading();
    newsResults.innerHTML = `<div class="error">エラー: ${message}</div>`;
}

// 実際のNewsAPIを使用する場合の関数（デモ用にコメントアウト）
/*
async function fetchFromNewsAPI() {
    showLoading();
    
    try {
        const query = searchInput.value.trim() || 'Japan';
        const category = categorySelect.value;
        
        let url = `${NEWS_API_URL}?apiKey=${NEWS_API_KEY}&q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20`;
        
        if (category) {
            url = `https://newsapi.org/v2/top-headlines?apiKey=${NEWS_API_KEY}&category=${category}&country=jp&pageSize=20`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'ok') {
            displayNews(data.articles);
        } else {
            showError(data.message || 'ニュースの取得に失敗しました');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('ニュースの取得中にエラーが発生しました');
    }
}
*/

// 通貨換算APIを使った換算関数
async function convertCurrency() {
    const amount = document.getElementById('amountInput').value;
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const resultDiv = document.getElementById('currencyResult');

    if (!amount || isNaN(amount) || amount <= 0) {
        resultDiv.textContent = '有効な金額を入力してください。';
        return;
    }

    resultDiv.textContent = '換算中...';
    try {
        // 無料API例: exchangerate.host
        const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log('Currency API response:', data);
        if (data.result !== undefined) {
            resultDiv.textContent = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
        } else {
            resultDiv.textContent = '換算に失敗しました。';
        }
    } catch (e) {
        resultDiv.textContent = 'APIエラーが発生しました。';
    }
}
