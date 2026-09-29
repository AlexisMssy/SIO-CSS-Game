const GAME_PREFIX = 'find-error';
const levels = [
    {
        code: '<h1>Bienvenue</h2>',
        question: 'Quelle correction apparie correctement les balises ?',
        options: ['<h1>Bienvenue</h1>', '<h2>Bienvenue</h2>', '<h1>Bienvenue</h1></h2>', '<h1>Bienvenue</h2></h1>'],
        correct: 0
    },
    {
        code: 'p {\n  color = blue;\n}',
        question: 'Quelle déclaration CSS est valide ?',
        options: ['color: blue;', 'color == blue;', 'color; blue;', 'color => blue;'],
        correct: 0
    },
    {
        code: '<img src="logo.png"></img>',
        question: 'Quelle version corrige cette image et fournit un texte alternatif ?',
        options: ['<img src="logo.png" alt="Logo">', '<image src="logo.png">', '<img>logo.png</img>', '<img src="logo.png" alt>'],
        correct: 0
    },
    {
        code: '.carte {\n  padding: 16;\n}',
        question: 'Quelle valeur ajoute 16 pixels d’espace intérieur ?',
        options: ['padding: 16px;', 'padding = 16px;', 'padding: 16;', 'padding: px16;'],
        correct: 0
    },
    {
        code: '.carte\n  background: white;\n}',
        question: 'Quelle version corrige la structure de la règle CSS ?',
        options: ['.carte { background: white; }', '.carte ( background: white; )', '.carte { background = white; }', '.carte: background: white;'],
        correct: 0
    },
    {
        code: '<ul><p>Vert</p></ul>',
        question: 'Quel élément convient dans une liste non ordonnée ?',
        options: ['<ul><li>Vert</li></ul>', '<ul><item>Vert</item></ul>', '<ul><p>Vert</ul>', '<li><ul>Vert</li></ul>'],
        correct: 0
    },
    {
        code: '<button class="btn">Valider</button>\n.bouton { color: red; }',
        question: 'Quel sélecteur cible ce bouton ?',
        options: ['.btn { color: red; }', '#btn { color: red; }', 'button.btn { color red; }', '.button { color: red; }'],
        correct: 0
    },
    {
        code: '<label for="email">E-mail</label>\n<input id="mail" type="email">',
        question: 'Quelle correction associe le label au champ ?',
        options: ['<input id="email" type="email">', '<input class="email" type="email">', '<label id="mail">E-mail</label>', '<input for="email" type="email">'],
        correct: 0
    },
    {
        code: '.alerte {\n  background-color: blu;\n}',
        question: 'Quelle valeur CSS nomme correctement cette couleur ?',
        options: ['background-color: blue;', 'background-color = blue;', 'background: blu;', 'color: #blu;'],
        correct: 0
    },
    {
        code: '<a hfer="/contact">Contact</a>',
        question: 'Quelle correction rend le lien valide ?',
        options: ['<a href="/contact">Contact</a>', '<link href="/contact">Contact</link>', '<a src="/contact">Contact</a>', '<a href=/contact>Contact<a>'],
        correct: 0
    }
];

const levelText = document.getElementById('level-text');
const levelCounter = document.getElementById('level-counter');
const scoreDisplay = document.getElementById('score-display');
const codeSample = document.getElementById('code-sample');
const questionText = document.getElementById('fix-question');
const optionsContainer = document.getElementById('fix-options');
const statusDiv = document.getElementById('status');
const nextBtn = document.getElementById('next-level');
const gameEnd = document.getElementById('game-end');
const finalScore = document.getElementById('final-score');

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
}

function renderOptions() {
    optionsContainer.innerHTML = '';
    levels[currentLevel].options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(index));
        optionsContainer.appendChild(button);
    });
}

function updateLevel() {
    const level = levels[currentLevel];
    levelText.textContent = `Niveau ${currentLevel + 1} : trouve l’erreur et choisis la bonne correction.`;
    levelCounter.textContent = `Niveau ${currentLevel + 1} / ${levels.length}`;
    scoreDisplay.textContent = `Points : ${score}`;
    codeSample.textContent = level.code;
    questionText.textContent = level.question;
    statusDiv.textContent = '';
    nextBtn.style.display = 'none';
    renderOptions();
    saveState();
}

function checkAnswer(answerIndex) {
    if (currentLevel >= levels.length) return;

    if (answerIndex !== levels[currentLevel].correct) {
        statusDiv.textContent = 'Cette correction ne répare pas l’erreur. Essaie encore.';
        statusDiv.className = 'code-status error';
        return;
    }

    const doneLevels = getDoneLevels();
    if (!doneLevels.includes(currentLevel)) {
        doneLevels.push(currentLevel);
        localStorage.setItem(`${GAME_PREFIX}_done`, JSON.stringify(doneLevels));
        score += 1;
    }

    statusDiv.textContent = 'Bien vu, cette correction répare le code.';
    statusDiv.className = 'code-status success';
    scoreDisplay.textContent = `Points : ${score}`;
    optionsContainer.querySelectorAll('button').forEach(button => { button.disabled = true; });

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

nextBtn.addEventListener('click', nextLevel);
document.getElementById('restart-btn').addEventListener('click', restartGame);