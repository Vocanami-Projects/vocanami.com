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

