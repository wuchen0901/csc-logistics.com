
const SUPPORTED_LANGS = {
    en: 'en',
    cn: 'zh-CN',
    jp: 'ja'
};

function normalizeLang(candidate) {
    if (!candidate) {
        return null;
    }
    const lang = candidate.toLowerCase();
    if (lang.startsWith('zh')) {
        return 'cn';
    }
    if (lang.startsWith('ja')) {
        return 'jp';
    }
    if (lang.startsWith('en')) {
        return 'en';
    }
    return null;
}

function detectPreferredLang() {
    const list = navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language];
    for (const candidate of list) {
        const match = normalizeLang(candidate);
        if (match && SUPPORTED_LANGS[match]) {
            return match;
        }
    }
    return 'en';
}

function loadLanguage(lang) {
    const resolvedLang = SUPPORTED_LANGS[lang] ? lang : 'en';
    fetch('lang/lang-' + resolvedLang + '.json')
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (data[key]) {
                    element.innerText = data[key];
                }
            });
            document.documentElement.setAttribute('lang', SUPPORTED_LANGS[resolvedLang]);
            localStorage.setItem('site-lang', resolvedLang);
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


            const savedLang = localStorage.getItem('site-lang');
            const initialLang = savedLang || detectPreferredLang();
            loadLanguage(initialLang);

            const interval = setInterval(() => {
                const selector = document.querySelector('.language-switcher select');
                if (selector) {
                    selector.value = savedLang || initialLang;
                    clearInterval(interval);
                }
            }, 100);
        });
});
