// Utilitaires partagés pour les jeux MediaQuery

/**
 * Affiche une notification toast
 * @param {string} message - Message à afficher
 * @param {string} type - Type de toast ('success', 'error', 'info')
 * @param {number} duration - Durée d'affichage en ms
 */
function showToast(message, type = 'info', duration = 3000) {
    const t = document.createElement('div');
    t.className = `toast toast--${type}`;
    t.textContent = message;
    document.body.appendChild(t);

    // Force reflow puis affichage
    requestAnimationFrame(() => t.classList.add('show'));

    setTimeout(() => {
        t.classList.remove('show');
        // Suppression après la transition
        setTimeout(() => t.remove(), 220);
    }, duration);
}

/**
 * Marque le lien de navigation actif avec aria-current
 */
function markActiveNavLink() {
    const navLinks = document.querySelectorAll('.main-nav a');
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const target = new URL(link.getAttribute('href'), location.href).pathname.split('/').pop();
        if (target === currentPage) {
            link.setAttribute('aria-current', 'page');
            link.closest('.nav-group')?.classList.add('nav-group--current');
        }
    });

    if (['square.html', 'bootstrap.html'].includes(currentPage)) {
        document.querySelector('[data-nav-group="unavailable"]')?.classList.add('nav-group--current');
    }
}

function renderSiteNavigation() {
    const header = document.querySelector('body > header');
    if (!header) return;

    header.innerHTML = '<a href="/index.html">SIO CSS Game</a>';
    let navigation = document.querySelector('body > nav.main-nav');
    if (!navigation) {
        navigation = document.createElement('nav');
        header.insertAdjacentElement('afterend', navigation);
    }
    navigation.className = 'main-nav';
    navigation.setAttribute('aria-label', 'Navigation principale');
    navigation.innerHTML = `
        <a class="nav-home" href="/index.html">Accueil</a>
        <details class="nav-group" data-nav-group="foundations">
            <summary>Fondamentaux</summary>
            <div class="nav-menu">
                <a href="/src/games/identify/identify.html">HTML ou CSS ?</a>
                <a href="/src/games/quiz/quiz.html">Comprendre le code</a>
                <a href="/src/games/find-error/find-error.html">Trouve l’erreur</a>
                <a href="/src/games/html/html.html">Balises HTML</a>
                <a href="/src/games/styles/styles.html">Propriétés CSS</a>
                <a href="/src/games/selectors/selectors.html">Sélecteurs CSS</a>
            </div>
        </details>
        <details class="nav-group" data-nav-group="flexbox">
            <summary>Flexbox</summary>
            <div class="nav-menu">
                <a href="/src/games/flex/flex.html">Atelier de code</a>
                <a href="/src/games/flex-builder/builder.html">Builder visuel</a>
                <a href="/src/games/flex-dispatch/dispatch.html">Dispatch Flex</a>
            </div>
        </details>
        <details class="nav-group" data-nav-group="grid">
            <summary>Grid</summary>
            <div class="nav-menu">
                <a href="/src/games/grid/grid.html">Atelier Grid</a>
                <a href="/src/games/grid-debugger/debugger.html">Grid Debugger</a>
                <a href="/src/games/grid-infinite/infinite.html">Grid infini</a>
            </div>
        </details>
        <details class="nav-group nav-group--unavailable" data-nav-group="unavailable">
            <summary>Indisponibles</summary>
            <div class="nav-menu">
                <span class="nav-unavailable" aria-disabled="true">Carré Media Queries</span>
                <span class="nav-unavailable" aria-disabled="true">Bootstrap</span>
            </div>
        </details>`;
    markActiveNavLink();
}

renderSiteNavigation();

function updateCopyrightYear() {
    const currentYear = String(new Date().getFullYear());
    document.querySelectorAll('[data-current-year]').forEach(element => {
        element.textContent = currentYear;
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCopyrightYear, { once: true });
} else {
    updateCopyrightYear();
}

/**
 * Crée un élément de style pour les media queries utilisateur
 * @param {string} id - ID unique pour l'élément style
 * @returns {HTMLStyleElement}
 */
function getOrCreateStyleElement(id) {
    let styleEl = document.getElementById(id);
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = id;
        document.head.appendChild(styleEl);
    }
    return styleEl;
}

/**
 * Force un reflow et attend deux frames pour s'assurer que les styles sont appliqués
 * @param {HTMLElement} element - Élément à vérifier
 * @param {Function} callback - Fonction à exécuter après le reflow
 */
function waitForReflow(element, callback) {
    // Force reflow
    void element.offsetWidth;
    // Attend deux frames pour s'assurer que les styles sont appliqués
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            callback();
        });
    });
}

Object.assign(globalThis, {
    getOrCreateStyleElement,
    markActiveNavLink,
    showToast,
    waitForReflow
});
