// layout.js

/**
 * 指定された要素内にある [data-include] 属性を持つすべての要素を検索し、
 * 指定されたHTMLファイルを読み込んで挿入します。
 * この処理は、新しく挿入されたHTML内にさらに [data-include] があれば、
 * それも見つけて処理を繰り返します（再帰処理）。
 * @param {HTMLElement} parentElement - 処理の対象となる親要素。
 */
async function processIncludes(parentElement) {
    // 親要素の中から、まだ処理されていない [data-include] をすべて探す
    const elementsToInclude = parentElement.querySelectorAll('[data-include]');

    // 対象がなければ、処理を終了（再帰の停止条件）
    if (elementsToInclude.length === 0) return;

    //見つかったすべての要素を並行して処理
    const promises = Array.from(elementsToInclude).map(async (el) => {
        const filePath = el.getAttribute('data-include');
        
        // 無限ループを防ぐため、処理する直前に属性を削除する
        el.removeAttribute('data-include');

        try {
            // 指定されたHTMLファイルを非同期で取得
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`ファイルの読み込みに失敗しました: ${filePath}`);
            }
            const html = await response.text();
            
            // 取得したHTMLで要素の中身を置き換え
            el.innerHTML = html;
            
            // ✨重要：中身を置き換えた要素の中で、さらにdata-includeがないか自分自身を呼び出す
            await processIncludes(el);

        } catch (error) {
            console.error(error);
            el.innerHTML = `<p style="color:red;">エラー: ${error.message}</p>`;
        }
    });

    // この階層のすべての処理が終わるのを待つ
    await Promise.all(promises);
}

// ページの基本構造が読み込まれたら、処理を開始
document.addEventListener("DOMContentLoaded", () => {
    // 最初にヘッダーとフッターを読み込む（これは今まで通り）
    const loadHeader = fetch('/_partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector("header").innerHTML = data;
        });

    const loadFooter = fetch('/_partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector("footer").innerHTML = data;
        });

    // ヘッダーとフッターの読み込みが終わったら、
    // <main>タグの中を対象に、再帰的な読み込み処理を開始する
    Promise.all([loadHeader, loadFooter]).then(() => {
        processIncludes(document.querySelector('main'));
    });
});