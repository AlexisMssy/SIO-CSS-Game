const GAME_PREFIX = 'selectors';
const preview = document.getElementById('selector-preview');
const selectorInput = document.getElementById('selector-input');
const levelText = document.getElementById('level-text');
const levelCounter = document.getElementById('level-counter');
const levelList = document.getElementById('level-list');
const scoreDisplay = document.getElementById('score-display');
const statusDiv = document.getElementById('status');
const nextBtn = document.getElementById('next-level');
const gameEnd = document.getElementById('game-end');
const finalScore = document.getElementById('final-score');

const levels = [
    { text: 'Niveau 1 : sélectionne tous les paragraphes avec une balise.', kind: 'tag', targets: ['intro-text', 'first-paragraph', 'second-paragraph'], expectedCount: 3 },
    { text: 'Niveau 2 : sélectionne précisément le titre avec son id.', kind: 'id', targets: ['main-title'] },
    { text: 'Niveau 3 : sélectionne le bloc qui possède la classe important-box.', kind: 'class', targets: ['important-box'] },
    { text: 'Niveau 4 : sélectionne le bouton avec une balise.', kind: 'tag', targets: ['action-button'], tag: 'button' },
    { text: 'Niveau 5 : sélectionne précisément le bloc avec l’id important-box.', kind: 'id', targets: ['important-box'] },
    { text: 'Niveau 6 : sélectionne les deux éléments qui portent la classe badge.', kind: 'class', targets: ['tip', 'warning'] },
    { text: 'Niveau 7 : sélectionne le titre de niveau 3 avec une balise.', kind: 'tag', targets: ['callout'], tag: 'h3' },
    { text: 'Niveau 8 : sélectionne le bloc avec la classe callout.', kind: 'class', targets: ['callout'] }
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

function saveDoneLevel() {
    const doneLevels = getDoneLevels();
    if (!doneLevels.includes(currentLevel)) {
        doneLevels.push(currentLevel);
        localStorage.setItem(`${GAME_PREFIX}_done`, JSON.stringify(doneLevels));
        score += 1;
    }
}

function updateScore() {
    scoreDisplay.textContent = `Points : ${score}`;
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
    selectorInput.value = '';
    statusDiv.textContent = '';
    nextBtn.style.display = 'none';
    preview.querySelectorAll('.selector-hit').forEach(element => element.classList.remove('selector-hit'));
    updateLevelList();
    updateScore();
    saveState();
}

function selectLevel(index) {
    currentLevel = index;
    updateLevel();
}

function selectorKind(selector) {
    if (/^[a-z][a-z0-9-]*$/i.test(selector)) return 'tag';
    if (/^#[a-z][a-z0-9_-]*$/i.test(selector)) return 'id';
    if (/^\.[a-z][a-z0-9_-]*$/i.test(selector)) return 'class';
    return null;
}

function testSelector() {
    const selector = selectorInput.value.trim();
    const level = levels[currentLevel];
    const kind = selectorKind(selector);

    preview.querySelectorAll('.selector-hit').forEach(element => element.classList.remove('selector-hit'));
    if (!kind) {
        statusDiv.textContent = 'Utilise une seule balise, un seul #id ou une seule .class.';
        statusDiv.className = 'selector-status error';
        return;
    }

    let selected;
    try {
        selected = Array.from(preview.querySelectorAll(selector));
    } catch (error) {
        selected = [];
    }

    const expectedTargets = level.targets.map(id => document.getElementById(id));
    const targetsMatch = selected.length === expectedTargets.length && expectedTargets.every(target => selected.includes(target));
    const kindMatches = kind === level.kind;
    const tagMatches = !level.tag || selector.toLowerCase() === level.tag;

    selected.forEach(element => element.classList.add('selector-hit'));

    if (kindMatches && targetsMatch && tagMatches) {
        saveDoneLevel();
        statusDiv.textContent = 'Bravo, ce sélecteur cible exactement les bons éléments !';
        statusDiv.className = 'selector-status success';
        nextBtn.style.display = currentLevel === levels.length - 1 ? 'none' : 'inline-block';
        updateLevelList();
        updateScore();
        saveState();
        if (currentLevel === levels.length - 1) finishGame();
    } else {
        statusDiv.textContent = 'Ce sélecteur ne cible pas les bons éléments ou n’est pas du bon type.';
        statusDiv.className = 'selector-status error';
    }
}

function finishGame() {
    gameEnd.hidden = false;
    finalScore.textContent = `Score final : ${score} / ${levels.length}`;
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
document.getElementById('test-btn').addEventListener('click', testSelector);
selectorInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') testSelector();
});
nextBtn.addEventListener('click', () => {
    currentLevel += 1;
    updateLevel();
});
document.getElementById('restart-btn').addEventListener('click', restartGame);
