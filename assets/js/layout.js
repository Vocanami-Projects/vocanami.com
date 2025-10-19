document.addEventListener("DOMContentLoaded", function() {

    fetch('/_partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector("header").innerHTML = data;
        });

    fetch('/_partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector("footer").innerHTML = data;
        });

    const includeSections = document.querySelectorAll('[data-include]');
    
    includeSections.forEach(el => {
        const filePath = el.getAttribute('data-include');
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                el.innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading section:', filePath, error);
            });
    });

});