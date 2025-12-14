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
        const href = link.getAttribute('href');
        const target = href.split('/').pop();
        if (target === currentPage) {
            link.setAttribute('aria-current', 'page');
        }
    });
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
