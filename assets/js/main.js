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
            button.style.backgroundColor = '#000';
            button.style.color = '#fff';
        });
    });
});

