const GAME_PREFIX = 'code-quiz';
const levels = [
    {
        code: '<h1>Bonjour</h1>\n<p>Bienvenue</p>',
        question: 'Quelles affirmations sont exactes ?',
        options: ['Le code contient un titre principal.', 'Le code contient un paragraphe.', 'Le code crée un lien.', 'Le texte est bleu par défaut.', 'C’est une règle CSS.'],
        correct: [0, 1]
    },
    {
        code: '.alerte {\n  color: red;\n  font-weight: bold;\n}',
        question: 'Quelles affirmations décrivent cette règle ?',
        options: ['Elle cible la classe alerte.', 'Elle colore le texte en rouge.', 'Elle ajoute un fond rouge.', 'Elle met le texte en gras.', 'Elle crée un élément HTML.'],
        correct: [0, 1, 3]
    },
    {
        code: '<a href="/contact">Contact</a>',
        question: 'Quelles affirmations sont exactes ?',
        options: ['Le code crée un lien cliquable.', 'Le texte visible est Contact.', 'Le lien pointe vers /accueil.', 'C’est une règle CSS.', 'La balise fermante est présente.'],
        correct: [0, 1, 4]
    },
    {
        code: '@media (max-width: 600px) {\n  #box { background-color: blue; }\n}',
        question: 'Quelles affirmations sont exactes ?',
        options: ['La règle s’applique jusqu’à 600 px de large.', 'Elle cible l’élément d’id box.', 'Le fond devient bleu.', 'Elle ajoute une classe box.', 'Elle s’applique uniquement au survol.'],
        correct: [0, 1, 2]
    },
    {
        code: '<ul>\n  <li>Rouge</li>\n  <li>Vert</li>\n</ul>',
        question: 'Quelles affirmations sont exactes ?',
        options: ['C’est une liste non ordonnée.', 'Elle contient deux éléments de liste.', 'C’est une liste numérotée.', 'ul est une propriété CSS.', 'Les éléments sont automatiquement en gras.'],
        correct: [0, 1]
    },
    {
        code: 'button:hover {\n  background-color: green;\n}',
        question: 'Quelles affirmations sont exactes ?',
        options: ['La règle s’applique au survol.', 'Elle colore le fond en vert.', 'Elle cible la classe button.', 'Elle crée un bouton HTML.', 'Elle change le texte en vert.'],
        correct: [0, 1]
    },
    {
        code: '<img src="logo.png" alt="Logo du site">',
        question: 'Quelles affirmations sont exactes ?',
        options: ['Le navigateur tente d’afficher logo.png.', 'Le texte alternatif est Logo du site.', 'img est une balise sans balise fermante.', 'C’est une règle CSS.', 'L’image reçoit automatiquement une bordure.'],
        correct: [0, 1, 2]
    },
    {
        code: '.carte {\n  padding: 16px;\n  margin: 8px;\n}',
        question: 'Quelles affirmations sont exactes ?',
        options: ['La règle cible la classe carte.', 'L’espace intérieur vaut 16 px.', 'L’espace extérieur vaut 8 px.', 'La règle cible l’id carte.', 'La taille du texte vaut 16 px.'],
        correct: [0, 1, 2]
    }
];

const levelText = document.getElementById('level-text');
const levelCounter = document.getElementById('level-counter');
const scoreDisplay = document.getElementById('score-display');
const codeSample = document.getElementById('code-sample');
const questionText = document.getElementById('quiz-question');
const optionsContainer = document.getElementById('answer-options');
const testBtn = document.getElementById('test-btn');
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
    testBtn.disabled = true;
}

function renderOptions() {
    optionsContainer.innerHTML = '';
    levels[currentLevel].options.forEach((option, index) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = String(index);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(option));
        optionsContainer.appendChild(label);
    });
}

function updateLevel() {
    const level = levels[currentLevel];
    levelText.textContent = `Niveau ${currentLevel + 1} : lis le code puis choisis les affirmations exactes.`;
    levelCounter.textContent = `Niveau ${currentLevel + 1} / ${levels.length}`;
    scoreDisplay.textContent = `Points : ${score}`;
    codeSample.textContent = level.code;
    questionText.textContent = level.question;
    statusDiv.textContent = '';
    testBtn.disabled = false;
    nextBtn.style.display = 'none';
    renderOptions();
    saveState();
}

function checkAnswer() {
    if (currentLevel >= levels.length) return;

    const selected = Array.from(optionsContainer.querySelectorAll('input:checked'))
        .map(checkbox => Number(checkbox.value))
        .sort((first, second) => first - second);
    const expected = [...levels[currentLevel].correct].sort((first, second) => first - second);
    const isCorrect = selected.length === expected.length && selected.every((answer, index) => answer === expected[index]);

    if (!isCorrect) {
        statusDiv.textContent = 'Il manque une bonne réponse ou une proposition incorrecte est cochée.';
        statusDiv.className = 'code-status error';
        return;
    }

    const doneLevels = getDoneLevels();
    if (!doneLevels.includes(currentLevel)) {
        doneLevels.push(currentLevel);
        localStorage.setItem(`${GAME_PREFIX}_done`, JSON.stringify(doneLevels));
        score += 1;
    }

    statusDiv.textContent = 'Exact, toutes les réponses sélectionnées sont correctes.';
    statusDiv.className = 'code-status success';
    scoreDisplay.textContent = `Points : ${score}`;
    optionsContainer.querySelectorAll('input').forEach(checkbox => { checkbox.disabled = true; });
    testBtn.disabled = true;

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

testBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', nextLevel);
document.getElementById('restart-btn').addEventListener('click', restartGame);