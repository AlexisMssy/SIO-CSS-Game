const GAME_PREFIX = 'identify-code';
const levels = [
    { code: '<h1>Atelier web</h1>', language: 'html' },
    { code: 'p {\n  color: tomato;\n}', language: 'css' },
    { code: '<a href="/contact">Contact</a>', language: 'html' },
    { code: '@media (max-width: 600px) {\n  .card { display: block; }\n}', language: 'css' },
    { code: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>', language: 'html' },
    { code: '#menu {\n  display: flex;\n  gap: 12px;\n}', language: 'css' },
    { code: '<img src="logo.png" alt="Logo du site">', language: 'html' },
    { code: '.bouton:hover {\n  background-color: teal;\n}', language: 'css' },
    { code: '<form>\n  <label for="email">E-mail</label>\n  <input id="email" type="email">\n</form>', language: 'html' },
    { code: 'body {\n  margin: 0;\n  font-family: sans-serif;\n}', language: 'css' }
];

const levelText = document.getElementById('level-text');
const levelCounter = document.getElementById('level-counter');
const scoreDisplay = document.getElementById('score-display');
const codeSample = document.getElementById('code-sample');
const statusDiv = document.getElementById('status');
const nextBtn = document.getElementById('next-level');
const gameEnd = document.getElementById('game-end');
const finalScore = document.getElementById('final-score');
const htmlBtn = document.getElementById('answer-html');
const cssBtn = document.getElementById('answer-css');

let currentLevel = 0;
let score = 0;

function getDoneLevels() {
    try {
        return JSON.parse(localStorage.getItem(`${GAME_PREFIX}_done`)) || [];
    } catch (error) {
        console.error('Erreur lors du chargement des niveaux réussis:', error);
        return [];
    }
}

function saveState() {
    localStorage.setItem(`${GAME_PREFIX}_progress`, JSON.stringify({ currentLevel, score }));
}

function showGameEnd() {
    finalScore.textContent = `Score final : ${score} / ${levels.length}`;
    gameEnd.hidden = false;
    htmlBtn.disabled = true;
    cssBtn.disabled = true;
}

function updateLevel() {
    const level = levels[currentLevel];
    levelText.textContent = `Niveau ${currentLevel + 1} : cet extrait est-il du HTML ou du CSS ?`;
    levelCounter.textContent = `Niveau ${currentLevel + 1} / ${levels.length}`;
    scoreDisplay.textContent = `Points : ${score}`;
    codeSample.textContent = level.code;
    statusDiv.textContent = '';
    htmlBtn.disabled = false;
    cssBtn.disabled = false;
    nextBtn.style.display = 'none';
    saveState();
}

function checkAnswer(language) {
    if (currentLevel >= levels.length) return;

    if (language !== levels[currentLevel].language) {
        statusDiv.textContent = 'Pas tout à fait. Regarde les balises ou les règles de style.';
        statusDiv.className = 'code-status error';
        return;
    }

    const doneLevels = getDoneLevels();
    if (!doneLevels.includes(currentLevel)) {
        doneLevels.push(currentLevel);
        localStorage.setItem(`${GAME_PREFIX}_done`, JSON.stringify(doneLevels));
        score += 1;
    }

    statusDiv.textContent = `Exact : c’est du ${language.toUpperCase()}.`;
    statusDiv.className = 'code-status success';
    scoreDisplay.textContent = `Points : ${score}`;
    htmlBtn.disabled = true;
    cssBtn.disabled = true;

    if (currentLevel === levels.length - 1) {
        currentLevel = levels.length;
        saveState();
        showGameEnd();
    } else {
        nextBtn.style.display = 'inline-block';
        saveState();
    }
}

function nextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel += 1;
        updateLevel();
    }
}

function restartGame() {
    localStorage.removeItem(`${GAME_PREFIX}_progress`);
    localStorage.removeItem(`${GAME_PREFIX}_done`);
    currentLevel = 0;
    score = 0;
    gameEnd.hidden = true;
    updateLevel();
}

try {
    const progress = JSON.parse(localStorage.getItem(`${GAME_PREFIX}_progress`));
    if (progress && Number.isInteger(progress.currentLevel) && typeof progress.score === 'number') {
        currentLevel = Math.max(0, Math.min(progress.currentLevel, levels.length));
        score = progress.score;
    }
} catch (error) {
    console.error('Erreur lors du chargement de la progression:', error);
}

if (currentLevel >= levels.length) showGameEnd();
else updateLevel();

htmlBtn.addEventListener('click', () => checkAnswer('html'));
cssBtn.addEventListener('click', () => checkAnswer('css'));
nextBtn.addEventListener('click', nextLevel);
document.getElementById('restart-btn').addEventListener('click', restartGame);