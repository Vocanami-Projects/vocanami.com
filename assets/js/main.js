document.addEventListener("DOMContentLoaded", () => {

    // --- トップへ戻るボタン ---
    // このボタンは最初からHTMLに存在するため、このままでOK
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) { // ボタンの存在を確認してから処理
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                backToTopButton.classList.add('is-visible');
            } else {
                backToTopButton.classList.remove('is-visible');
            }
        });
    }


    // --- タブ切り替え機能（イベント委譲を使用） ---
    // タブボタンは後から読み込まれるため、親要素である<main>でクリックを監視
    const mainElement = document.querySelector('main');

    if (mainElement) {
        mainElement.addEventListener('click', (event) => {
            // 1. クリックされたのがタブボタンか判定
            const clickedTab = event.target.closest('.tab-button');
            
            // 2. タブボタンでなければ、何もしない
            if (!clickedTab) {
                return; 
            }

            // 3. 親コンテナ内の全てのタブとコンテンツから 'active' クラスを削除
            const tabContainer = clickedTab.closest('.tab-container');
            if (tabContainer) {
                const allTabs = tabContainer.querySelectorAll('.tab-button');
                const allContents = tabContainer.querySelectorAll('.tab-content');
                
                allTabs.forEach(tab => tab.classList.remove('active'));
                allContents.forEach(content => content.classList.remove('active'));
            }
            
            // 4. クリックされたタブと、対応するコンテンツに 'active' クラスを追加
            clickedTab.classList.add('active');
            const contentId = clickedTab.dataset.tab;
            const targetContent = document.getElementById(contentId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    }
});