const GAME_PREFIX = 'grid-atelier';
const grid = document.getElementById('grid');
const codeInput = document.getElementById('code-input');
const levelText = document.getElementById('level-text');
const levelCounter = document.getElementById('level-counter');
const levelList = document.getElementById('level-list');
const scoreDisplay = document.getElementById('score-display');
const statusDiv = document.getElementById('status');
const nextBtn = document.getElementById('next-level');
const gameEnd = document.getElementById('game-end');
const finalScore = document.getElementById('final-score');
const cards = () => Array.from(grid.querySelectorAll('.card'));
const gridStyle = () => getComputedStyle(grid);
const firstCardStyle = () => cards()[0] && getComputedStyle(cards()[0]);
const puzzleStyle = id => getComputedStyle(document.getElementById(id));
const tracks = value => value.trim().split(/\s+/).filter(Boolean);

const levels = [
    { text: 'Niveau 1 : active le modèle Grid sur le conteneur.', expected: ['display: grid'], validate: () => gridStyle().display === 'grid' },
    { text: 'Niveau 2 : crée deux colonnes de largeur égale avec 1fr.', expected: ['grid-template-columns: 1fr 1fr'], validate: () => tracks(gridStyle().gridTemplateColumns).length === 2 },
    { text: 'Niveau 3 : crée trois colonnes avec repeat().', expected: ['grid-template-columns: repeat(3, 1fr)'], validate: () => tracks(gridStyle().gridTemplateColumns).length === 3 },
    { text: 'Niveau 4 : définis deux lignes de 100px.', expected: ['grid-template-rows: 100px 100px'], validate: () => tracks(gridStyle().gridTemplateRows).slice(0, 2).every(track => parseFloat(track) === 100) },
    { text: 'Niveau 5 : règle l’espace entre lignes et colonnes à 20px.', expected: ['gap: 20px'], validate: () => gridStyle().gap === '20px' },
    { text: 'Niveau 6 : fais occuper les colonnes entre les lignes 1 et 3 à la première carte.', expected: ['#grid-card-featured { grid-column: 1 / 3'], validate: () => firstCardStyle()?.gridColumnEnd === '3' },
    { text: 'Niveau 7 : fais occuper les lignes entre les lignes 1 et 3 à la première carte.', expected: ['#grid-card-featured { grid-row: 1 / 3'], validate: () => firstCardStyle()?.gridRowEnd === '3' },
    { text: 'Niveau 8 : compose une grille avec des zones header, main et side.', expected: ['grid-template-areas: "header header" "main side"', '#grid-card-featured { grid-area: header', '#grid-card-main { grid-area: main', '#grid-card-side { grid-area: side'], validate: () => gridStyle().gridTemplateAreas !== 'none' && firstCardStyle().gridArea === 'header' && getComputedStyle(cards()[1]).gridArea === 'main' && getComputedStyle(cards()[2]).gridArea === 'side' },
    { text: 'Niveau 9 : place A sur deux colonnes et deux lignes, en haut à gauche.', expected: ['#puzzle-a { grid-column: 1 / 3; grid-row: 1 / 3'], validate: () => puzzleStyle('puzzle-a').gridColumnEnd === '3' && puzzleStyle('puzzle-a').gridRowEnd === '3' },
    { text: 'Niveau 10 : place B sur les colonnes 3–4 de la première ligne.', expected: ['#puzzle-b { grid-column: 3 / 5; grid-row: 1 / 2'], validate: () => puzzleStyle('puzzle-b').gridColumnStart === '3' && puzzleStyle('puzzle-b').gridColumnEnd === '5' && puzzleStyle('puzzle-b').gridRowStart === '1' },
    { text: 'Niveau 11 : place C sur les colonnes 3–4 de la deuxième ligne.', expected: ['#puzzle-c { grid-column: 3 / 5; grid-row: 2 / 3'], validate: () => puzzleStyle('puzzle-c').gridColumnStart === '3' && puzzleStyle('puzzle-c').gridColumnEnd === '5' && puzzleStyle('puzzle-c').gridRowStart === '2' },
    { text: 'Niveau 12 : place D sur toute la dernière ligne.', expected: ['#puzzle-d { grid-column: 1 / 5; grid-row: 3 / 4'], validate: () => puzzleStyle('puzzle-d').gridColumnStart === '1' && puzzleStyle('puzzle-d').gridColumnEnd === '5' && puzzleStyle('puzzle-d').gridRowStart === '3' },
    { text: 'Niveau 13 : crée trois colonnes de proportions 1fr, 2fr et 1fr.', expected: ['grid-template-columns: 1fr 2fr 1fr'], validate: () => tracks(gridStyle().gridTemplateColumns).length === 3 },
    { text: 'Niveau 14 : répartis les colonnes avec justify-content.', expected: ['justify-content: space-between'], validate: () => gridStyle().justifyContent === 'space-between' },
    { text: 'Niveau 15 : centre l’ensemble des pistes sur l’axe vertical.', expected: ['align-content: center'], validate: () => gridStyle().alignContent === 'center' },
    { text: 'Niveau 16 : espace les colonnes de 32px.', expected: ['column-gap: 32px'], advanced: true, validate: () => gridStyle().columnGap === '32px' },
    { text: 'Niveau 17 : espace les lignes de 24px.', expected: ['row-gap: 24px'], advanced: true, validate: () => gridStyle().rowGap === '24px' },
    { text: 'Niveau 18 : centre les éléments dans leurs cellules horizontalement.', expected: ['justify-items: center'], advanced: true, validate: () => gridStyle().justifyItems === 'center' },
    { text: 'Niveau 19 : aligne les éléments en bas de leurs cellules.', expected: ['align-items: end'], advanced: true, validate: () => gridStyle().alignItems === 'end' },
    { text: 'Niveau 20 : combine les deux axes avec place-items.', expected: ['place-items: center end'], advanced: true, validate: () => gridStyle().justifyItems === 'end' && gridStyle().alignItems === 'center' },
    { text: 'Niveau 21 : place automatiquement les éléments en colonnes.', expected: ['grid-auto-flow: column'], advanced: true, validate: () => gridStyle().gridAutoFlow === 'column' },
    { text: 'Niveau 22 : active le placement dense en remplissant les trous par ligne.', expected: ['grid-auto-flow: row dense'], advanced: true, validate: () => gridStyle().gridAutoFlow.includes('dense') },
    { text: 'Niveau 23 : donne 120px aux colonnes implicites.', expected: ['grid-auto-columns: 120px'], advanced: true, validate: () => gridStyle().gridAutoColumns === '120px' },
    { text: 'Niveau 24 : donne une hauteur minimale de 80px aux lignes implicites.', expected: ['grid-auto-rows: minmax(80px, auto)'], advanced: true, validate: () => gridStyle().gridAutoRows !== 'auto' },
    { text: 'Niveau 25 : crée deux colonnes avec minmax().', expected: ['grid-template-columns: repeat(2, minmax(180px, 1fr))'], advanced: true, validate: () => tracks(gridStyle().gridTemplateColumns).length === 2 },
    { text: 'Niveau 26 : utilise auto-fit pour adapter les colonnes à l’espace disponible.', expected: ['grid-template-columns: repeat(auto-fit, minmax(160px, 1fr))'], advanced: true, validate: () => tracks(gridStyle().gridTemplateColumns).length >= 1 },
    { text: 'Niveau 27 : nomme les lignes de début et de fin des colonnes.', expected: ['grid-template-columns: [start] 1fr 2fr [end]'], advanced: true, validate: () => gridStyle().gridTemplateColumns.includes('[start]') && gridStyle().gridTemplateColumns.includes('[end]') },
    { text: 'Niveau 28 : place la première carte au centre vertical et à droite.', expected: ['#grid-card-featured { place-self: center end'], advanced: true, validate: () => firstCardStyle()?.alignSelf === 'center' && firstCardStyle()?.justifySelf === 'end' },
    { text: 'Niveau 29 : combine trois colonnes, des lignes flexibles et un espacement.', expected: ['grid-template-columns: repeat(3, 1fr)', 'grid-auto-rows: minmax(100px, auto)', 'gap: 1rem'], advanced: true, validate: () => tracks(gridStyle().gridTemplateColumns).length === 3 && gridStyle().rowGap === '16px' && gridStyle().gridAutoRows !== 'auto' },
    { text: 'Niveau 30 : construis une grille fluide avec auto-fit, minmax() et un gap.', expected: ['grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))', 'gap: 16px'], advanced: true, validate: () => tracks(gridStyle().gridTemplateColumns).length >= 1 && gridStyle().gap === '16px' }
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
    const style = getOrCreateStyleElement('grid-atelier-user-style');
    style.textContent = codeInput.value;
    saveLevelCode();
    waitForReflow(grid, () => {
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
