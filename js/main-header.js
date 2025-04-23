
function loadLanguage(lang) {
    fetch('lang/lang-' + lang + '.json')
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (data[key]) {
                    element.innerText = data[key];
                }
            });
            localStorage.setItem('site-lang', lang);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Bind nav-switch toggle after header load
            $('.nav-switch').on('click', function(event) {
                $(this).toggleClass('active');
                $('.main-menu').slideToggle(400);
                event.preventDefault();
            });


            const savedLang = localStorage.getItem('site-lang') || 'en';
            loadLanguage(savedLang);

            const interval = setInterval(() => {
                const selector = document.querySelector('.language-switcher select');
                if (selector) {
                    selector.value = savedLang;
                    clearInterval(interval);
                }
            }, 100);
        });
});
