const GAME_PREFIX = 'flexbox';
const flexContainer = document.getElementById('flex-container');
const codeInput = document.getElementById('code-input');
const levelText = document.getElementById('level-text');
const levelCounter = document.getElementById('level-counter');
const levelList = document.getElementById('level-list');
const scoreDisplay = document.getElementById('score-display');
const statusDiv = document.getElementById('status');
const nextBtn = document.getElementById('next-level');
const gameEnd = document.getElementById('game-end');
const finalScore = document.getElementById('final-score');
const containerStyle = () => getComputedStyle(flexContainer);
const itemStyle = id => getComputedStyle(document.getElementById(id));

const levels = [
    { text: 'Niveau 1 : active Flexbox sur le conteneur.', expected: ['#flex-container { display: flex'], validate: () => containerStyle().display === 'flex' },
    { text: 'Niveau 2 : dispose les éléments sur une ligne.', expected: ['#flex-container { flex-direction: row'], validate: () => containerStyle().flexDirection === 'row' },
    { text: 'Niveau 3 : centre les éléments sur l’axe principal.', expected: ['#flex-container { justify-content: center'], validate: () => containerStyle().justifyContent === 'center' },
    { text: 'Niveau 4 : répartis les éléments avec un espace entre eux.', expected: ['#flex-container { justify-content: space-between'], validate: () => containerStyle().justifyContent === 'space-between' },
    { text: 'Niveau 5 : centre les éléments sur l’axe secondaire.', expected: ['#flex-container { align-items: center'], validate: () => containerStyle().alignItems === 'center' },
    { text: 'Niveau 6 : ajoute 16px d’espace entre les éléments.', expected: ['#flex-container { gap: 16px'], validate: () => containerStyle().gap === '16px' },
    { text: 'Niveau 7 : empile les éléments en colonne.', expected: ['#flex-container { flex-direction: column'], validate: () => containerStyle().flexDirection === 'column' },
    { text: 'Niveau 8 : autorise les éléments à passer à la ligne.', expected: ['#flex-container { flex-wrap: wrap'], advanced: true, validate: () => containerStyle().flexWrap === 'wrap' },
    { text: 'Niveau 9 : inverse le sens de la ligne.', expected: ['#flex-container { flex-direction: row-reverse'], advanced: true, validate: () => containerStyle().flexDirection === 'row-reverse' },
    { text: 'Niveau 10 : répartis l’espace autour des éléments.', expected: ['#flex-container { justify-content: space-around'], advanced: true, validate: () => containerStyle().justifyContent === 'space-around' },
    { text: 'Niveau 11 : aligne les éléments en bas du conteneur.', expected: ['#flex-container { align-items: flex-end'], advanced: true, validate: () => containerStyle().alignItems === 'flex-end' },
    { text: 'Niveau 12 : répartis les lignes sur l’axe secondaire.', expected: ['#flex-container { flex-wrap: wrap', 'align-content: space-between'], advanced: true, validate: () => containerStyle().flexWrap === 'wrap' && containerStyle().alignContent === 'space-between' },
    { text: 'Niveau 13 : laisse le premier élément grandir.', expected: ['#flex-item-a { flex-grow: 1'], advanced: true, validate: () => itemStyle('flex-item-a').flexGrow === '1' },
    { text: 'Niveau 14 : empêche le deuxième élément de rétrécir.', expected: ['#flex-item-b { flex-shrink: 0'], advanced: true, validate: () => itemStyle('flex-item-b').flexShrink === '0' },
    { text: 'Niveau 15 : donne une base de 140px au troisième élément.', expected: ['#flex-item-c { flex-basis: 140px'], advanced: true, validate: () => itemStyle('flex-item-c').flexBasis === '140px' },
    { text: 'Niveau 16 : combine croissance, réduction et base sur le premier élément.', expected: ['#flex-item-a { flex: 1 1 120px'], advanced: true, validate: () => itemStyle('flex-item-a').flexGrow === '1' && itemStyle('flex-item-a').flexShrink === '1' && itemStyle('flex-item-a').flexBasis === '120px' },
    { text: 'Niveau 17 : place le quatrième élément en premier.', expected: ['#flex-item-d { order: -1'], advanced: true, validate: () => itemStyle('flex-item-d').order === '-1' },
    { text: 'Niveau 18 : aligne le deuxième élément indépendamment des autres.', expected: ['#flex-item-b { align-self: flex-end'], advanced: true, validate: () => itemStyle('flex-item-b').alignSelf === 'flex-end' },
    { text: 'Niveau 19 : combine retour à la ligne, espacement et alignement.', expected: ['#flex-container { display: flex', 'flex-wrap: wrap', 'justify-content: space-between', 'align-items: center', 'gap: 12px'], advanced: true, validate: () => containerStyle().display === 'flex' && containerStyle().flexWrap === 'wrap' && containerStyle().justifyContent === 'space-between' && containerStyle().alignItems === 'center' && containerStyle().gap === '12px' },
    { text: 'Niveau 20 : construis une rangée flexible avec une base de 140px et un espace de 12px.', expected: ['#flex-container { display: flex', 'flex-direction: row', 'gap: 12px', '#flex-item-a { flex: 1 1 140px'], advanced: true, validate: () => containerStyle().display === 'flex' && containerStyle().flexDirection === 'row' && containerStyle().gap === '12px' && itemStyle('flex-item-a').flexGrow === '1' && itemStyle('flex-item-a').flexBasis === '140px' }
];

let currentLevel = 0;
let score = 0;

function readStored(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(`${GAME_PREFIX}_${key}`)) ?? fallback;
    } catch (error) {
        console.error('Erreur lors du chargement de la progression:', error);
        return fallback;
    }
}

function saveProgress() {
    localStorage.setItem(`${GAME_PREFIX}_progress`, JSON.stringify({ currentLevel, score }));
}

function saveLevelCode() {
    const savedCodes = readStored('codes', {});
    savedCodes[currentLevel] = codeInput.value;
    localStorage.setItem(`${GAME_PREFIX}_codes`, JSON.stringify(savedCodes));
}

function updateLevelList() {
    const doneLevels = readStored('done', []);
    levelList.innerHTML = '';

    if (levels.some(level => level.advanced)) {
        const legend = document.createElement('span');
        legend.className = 'level-list-legend';
        legend.textContent = '* Approfondissement : notion hors des objectifs obligatoires du cours.';
        levelList.appendChild(legend);
    }
    levels.forEach((level, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'level-btn';
        button.textContent = `Niveau ${index + 1}${level.advanced ? ' *' : ''}`;
        if (level.advanced) {
            button.classList.add('level-btn--advanced');
            button.title = 'Approfondissement : notion hors des objectifs obligatoires du cours.';
        }
        if (doneLevels.includes(index)) button.classList.add('done');
        if (index === currentLevel) button.classList.add('selected');
        button.addEventListener('click', () => selectLevel(index));
        levelList.appendChild(button);
    });
}

function updateLevel() {
    const level = levels[currentLevel];
    levelText.textContent = `${level.advanced ? 'Approfondissement — ' : ''}${level.text}`;
    if (level.advanced) levelText.classList.add('level-desc--advanced');
    else levelText.classList.remove('level-desc--advanced');
    levelCounter.textContent = `Niveau ${currentLevel + 1} / ${levels.length}`;
    scoreDisplay.textContent = `Points : ${score}`;
    codeInput.value = readStored('codes', {})[currentLevel] || '';
    statusDiv.textContent = '';
    nextBtn.style.display = 'none';
    updateLevelList();
    saveProgress();
}

function selectLevel(index) {
    saveLevelCode();
    currentLevel = index;
    updateLevel();
}

function checkExpected(level) {
    const normalize = value => value.replace(/\s+/g, '').toLowerCase();
    const code = normalize(codeInput.value);
    return level.expected.every(snippet => code.includes(normalize(snippet)));
}

function testLevel() {
    const style = getOrCreateStyleElement('flexbox-user-style');
    style.textContent = codeInput.value;
    saveLevelCode();
    waitForReflow(flexContainer, () => {
        const level = levels[currentLevel];
        if (!checkExpected(level)) {
            statusDiv.textContent = 'Le CSS ne contient pas encore toutes les déclarations attendues.';
            statusDiv.style.color = 'orange';
            return;
        }
        if (!level.validate()) {
            statusDiv.textContent = 'Le code est présent, mais le rendu ne correspond pas encore à l’objectif.';
            statusDiv.style.color = 'red';
            return;
        }

        const doneLevels = readStored('done', []);
        if (!doneLevels.includes(currentLevel)) {
            doneLevels.push(currentLevel);
            score += 1;
            localStorage.setItem(`${GAME_PREFIX}_done`, JSON.stringify(doneLevels));
        }
        statusDiv.textContent = 'Défi réussi !';
        statusDiv.style.color = 'green';
        scoreDisplay.textContent = `Points : ${score}`;
        nextBtn.style.display = currentLevel === levels.length - 1 ? 'none' : 'inline-block';
        updateLevelList();
        saveProgress();
        if (currentLevel === levels.length - 1) finishGame();
    });
}

function finishGame() {
    gameEnd.hidden = false;
    finalScore.textContent = `Score final : ${score} / ${levels.length}`;
}

function restartGame() {
    currentLevel = 0;
    score = 0;
    ['progress', 'done', 'codes'].forEach(key => localStorage.removeItem(`${GAME_PREFIX}_${key}`));
    gameEnd.hidden = true;
    const style = document.getElementById('flexbox-user-style');
    if (style) style.textContent = '';
    updateLevel();
}

const savedProgress = readStored('progress', null);
if (savedProgress && Number.isInteger(savedProgress.currentLevel) && Number.isFinite(savedProgress.score)) {
    currentLevel = Math.max(0, Math.min(savedProgress.currentLevel, levels.length - 1));
    score = savedProgress.score;
}

updateLevel();
document.getElementById('test-btn').addEventListener('click', testLevel);
nextBtn.addEventListener('click', () => {
    saveLevelCode();
    currentLevel += 1;
    if (currentLevel >= levels.length) {
        finishGame();
        return;
    }
    updateLevel();
});
document.getElementById('restart-btn').addEventListener('click', restartGame);