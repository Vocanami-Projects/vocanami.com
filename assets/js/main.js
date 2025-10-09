// タブ切り替え機能
const tabs = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 全てのactiveクラスを一旦削除
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // クリックされたタブにactiveクラスを追加
        tab.classList.add('active');
        // 対応するコンテンツにactiveクラスを追加
        const contentId = tab.dataset.tab;
        document.getElementById(contentId).classList.add('active');
    });
});
//ボタンを押した時のエフェクト
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            button.style.backgroundColor = 'var(--word-color)';
            button.style.color = 'var(--secondary-color)';
        });
    });
});

// --- トップへ戻るボタン ---
const backToTopButton = document.getElementById('back-to-top');

// ある程度スクロールしたらボタンを表示
window.addEventListener('scroll', () => {
    // 画面の上から200px以上スクロールしたら
    if (window.scrollY > 200) {
        // is-visibleクラスを付けて表示
        backToTopButton.classList.add('is-visible');
    } else {
        // 200px未満の場合はis-visibleクラスを外して非表示
        backToTopButton.classList.remove('is-visible');
    }
});
