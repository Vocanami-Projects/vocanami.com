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

});