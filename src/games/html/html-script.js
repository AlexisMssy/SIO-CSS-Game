const GAME_PREFIX = 'html-tags';
const tagInput = document.getElementById('tag-input');
const levelText = document.getElementById('level-text');
const levelCounter = document.getElementById('level-counter');
const levelList = document.getElementById('level-list');
const scoreDisplay = document.getElementById('score-display');
const statusDiv = document.getElementById('status');
const nextBtn = document.getElementById('next-level');
const gameEnd = document.getElementById('game-end');
const finalScore = document.getElementById('final-score');
const preview = document.getElementById('html-preview');

const levels = [
    { text: 'Niveau 1 : quelle balise contient l’en-tête du site ?', tag: 'header', target: 'html-header' },
    { text: 'Niveau 2 : quelle balise regroupe les liens de navigation ?', tag: 'nav', target: 'html-nav' },
    { text: 'Niveau 3 : quelle balise contient le contenu principal unique ?', tag: 'main', target: 'html-main' },
    { text: 'Niveau 4 : quelle balise regroupe cette partie thématique de la page ?', tag: 'section', target: 'html-section' },
    { text: 'Niveau 5 : quelle balise contient le pied de page ?', tag: 'footer', target: 'html-footer' },
    { text: 'Niveau 6 : quelle balise porte le titre principal de la page ?', tag: 'h1', target: 'html-title' },
    { text: 'Niveau 7 : quelle balise représente un paragraphe de texte ?', tag: 'p', target: 'html-paragraph' },
    { text: 'Niveau 8 : quelle balise crée une liste non ordonnée ?', tag: 'ul', target: 'html-list' },
    { text: 'Niveau 9 : quelle balise crée une section d\'article autonome ?', tag: 'article', target: 'html-article' },
    { text: 'Niveau 10 : quelle balise contient une information complémentaire ?', tag: 'aside', target: 'html-aside' },
    { text: 'Niveau 11 : quelle balise contient une image avec sa légende ?', tag: 'figure', target: 'html-figure' },
    { text: 'Niveau 12 : quelle balise contient la légende de l\'image ?', tag: 'figcaption', target: 'html-figcaption' },
    { text: 'Niveau 13 : quelle balise crée un titre de niveau 2 ?', tag: 'h2', target: 'html-h2' },
    { text: 'Niveau 14 : quelle balise crée une liste ordonnée ?', tag: 'ol', target: 'html-ol' },
    { text: 'Niveau 15 : quelle balise représente un terme dans une liste de définitions ?', tag: 'dt', target: 'html-dt' },
    { text: 'Niveau 16 : quelle balise représente la définition de ce terme ?', tag: 'dd', target: 'html-dd' },
    { text: 'Niveau 17 : quelle balise crée un élément fort/important ?', tag: 'strong', target: 'html-strong' },
    { text: 'Niveau 18 : quelle balise crée une ligne horizontale ?', tag: 'hr', target: 'html-hr' },
    { text: 'Niveau 19 : quelle balise crée un saut de ligne ?', tag: 'br', target: 'html-br' },
    { text: 'Niveau 20 : quelle balise crée un lien vers une autre partie de la page ?', tag: 'a', target: 'html-link' },
    { text: 'Niveau 21 : quelle balise affiche une image sur la page ?', tag: 'img', target: 'html-img' },
    { text: 'Niveau 22 : quelle balise crée un tableau ?', tag: 'table', target: 'html-table' },
    { text: 'Niveau 23 : quelle balise définit l\'en-tête d\'un tableau ?', tag: 'thead', target: 'html-thead' },
    { text: 'Niveau 24 : quelle balise contient le corps du tableau ?', tag: 'tbody', target: 'html-tbody' },
    { text: 'Niveau 25 : quelle balise définit une cellule de tableau ?', tag: 'td', target: 'html-td' },
    { text: 'Niveau 26 : quelle balise définit une cellule d\'en-tête ?', tag: 'th', target: 'html-th' },
    { text: 'Niveau 27 : quelle balise regroupe les champs d’un formulaire ?', tag: 'form', target: 'html-form' },
    { text: 'Niveau 28 : quelle balise définit un champ de texte ?', tag: 'input', target: 'html-input' },
    { text: 'Niveau 29 : quelle balise définit une étiquette pour un champ de formulaire ?', tag: 'label', target: 'html-label' },
    { text: 'Niveau 30 : quelle balise définit une zone de texte ?', tag: 'textarea', target: 'html-textarea' },
    { text: 'Niveau 31 : quelle balise définit une liste de choix ?', tag: 'select', target: 'html-select' }
];

let currentLevel = 0;
let score = 0;

function loadState() {
    try {
        const state = JSON.parse(localStorage.getItem(`${GAME_PREFIX}_progress`));
        if (state && Number.isInteger(state.currentLevel) && typeof state.score === 'number') {
            currentLevel = Math.min(state.currentLevel, levels.length - 1);
            score = state.score;
        }
    } catch (error) {
        console.error('Erreur lors du chargement de la progression:', error);
    }
}

function saveState() {
    localStorage.setItem(`${GAME_PREFIX}_progress`, JSON.stringify({ currentLevel, score }));
}

function getDoneLevels() {
    try {
        return JSON.parse(localStorage.getItem(`${GAME_PREFIX}_done`)) || [];
    } catch (error) {
        console.error('Erreur lors du chargement des niveaux réussis:', error);
        return [];
    }
}

function completeLevel() {
    const doneLevels = getDoneLevels();
    if (!doneLevels.includes(currentLevel)) {
        doneLevels.push(currentLevel);
        localStorage.setItem(`${GAME_PREFIX}_done`, JSON.stringify(doneLevels));
        score += 1;
    }
}

function updateLevelList() {
    const doneLevels = getDoneLevels();
    levelList.innerHTML = '';
    levels.forEach((level, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'level-btn';
        button.textContent = `Niveau ${index + 1}`;
        if (doneLevels.includes(index)) button.classList.add('done');
        if (index === currentLevel) button.classList.add('selected');
        button.addEventListener('click', () => selectLevel(index));
        levelList.appendChild(button);
    });
}

function updateLevel() {
    levelText.textContent = levels[currentLevel].text;
    levelCounter.textContent = `Niveau ${currentLevel + 1} / ${levels.length}`;
    scoreDisplay.textContent = `Points : ${score}`;
    tagInput.value = '';
    statusDiv.textContent = '';
    nextBtn.style.display = 'none';
    preview.querySelectorAll('.html-hit').forEach(element => element.classList.remove('html-hit'));
    updateLevelList();
    saveState();
}

function selectLevel(index) {
    currentLevel = index;
    gameEnd.hidden = true;
    updateLevel();
}

function normalizeTag(value) {
    return value.trim().replace(/^<([a-z][a-z0-9-]*)>$/i, '$1').toLowerCase();
}

function testTag() {
    const tag = normalizeTag(tagInput.value);
    const level = levels[currentLevel];
    const targetElement = document.getElementById(level.target);
    preview.querySelectorAll('.html-hit').forEach(element => element.classList.remove('html-hit'));

    if (!/^[a-z][a-z0-9-]*$/.test(tag)) {
        statusDiv.textContent = 'Écris une seule balise HTML, par exemple <section>.';
        statusDiv.className = 'html-status error';
        return;
    }

    if (tag === level.tag && targetElement.tagName.toLowerCase() === tag) {
        targetElement.classList.add('html-hit');
        completeLevel();
        statusDiv.textContent = 'Bravo, cette balise correspond au rôle demandé !';
        statusDiv.className = 'html-status success';
        updateLevelList();
        scoreDisplay.textContent = `Points : ${score}`;
        saveState();
        if (currentLevel === levels.length - 1) finishGame();
        else nextBtn.style.display = 'inline-block';
    } else {
        statusDiv.textContent = 'Ce n’est pas la bonne balise pour ce rôle.';
        statusDiv.className = 'html-status error';
    }
}

function finishGame() {
    finalScore.textContent = `Score final : ${score} / ${levels.length}`;
    gameEnd.hidden = false;
}

function restartGame() {
    currentLevel = 0;
    score = 0;
    localStorage.removeItem(`${GAME_PREFIX}_progress`);
    localStorage.removeItem(`${GAME_PREFIX}_done`);
    gameEnd.hidden = true;
    updateLevel();
}

loadState();
updateLevel();
document.getElementById('test-btn').addEventListener('click', testTag);
tagInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') testTag();
});
nextBtn.addEventListener('click', () => {
    currentLevel += 1;
    updateLevel();
});
document.getElementById('restart-btn').addEventListener('click', restartGame);
