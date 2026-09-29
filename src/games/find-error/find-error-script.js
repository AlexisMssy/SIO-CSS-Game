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
    },
    {
        code: '.carte {\n  color: navy;\n',
        question: 'Quelle correction ferme correctement la règle CSS ?',
        options: ['.carte { color: navy; }', '.carte ( color: navy; )', '.carte { color: navy )', '.carte: color: navy;'],
        correct: 0
    },
    {
        code: '<ul><li>HTML</p></ul>',
        question: 'Quelle balise ferme correctement cet élément de liste ?',
        options: ['</ul>', '</li>', '</list>', '</p>'],
        correct: 1
    },
    {
        code: 'h2 {\n  font-size: 18;\n}',
        question: 'Quelle valeur donne une taille de texte de 18 pixels ?',
        options: ['font-size: px18;', 'font-size: 18em;', 'font-size: 18px;', 'font-size = 18px;'],
        correct: 2
    },
    {
        code: '#menu {\n  display: flxe;\n}',
        question: 'Quelle valeur active correctement Flexbox ?',
        options: ['display: flexbox;', 'display: inline-flexbox;', 'display = flex;', 'display: flex;'],
        correct: 3
    },
    {
        code: '<label for="password">Mot de passe</label><input id="pass" type="password">',
        question: 'Quel identifiant doit porter le champ pour correspondre au label ?',
        options: ['name="password"', 'id="password"', 'class="password"', 'for="password"'],
        correct: 1
    },
    {
        code: '.alerte {\n  background-color: #12GG00;\n}',
        question: 'Quelle couleur hexadécimale corrige cette valeur invalide ?',
        options: ['#12CC00', '#12GG00', '#12G000', '#12CC0'],
        correct: 0
    },
    {
        code: '<a href="/cours">Voir le cours<a>',
        question: 'Quelle balise ferme correctement ce lien ?',
        options: ['</link>', '</href>', '</a>', '</button>'],
        correct: 2
    },
    {
        code: '.grille {\n  display: grid;\n  grid-template-columns: repeat(2, 1 fr);\n}',
        question: 'Quelle valeur définit deux colonnes de même largeur ?',
        options: ['repeat(2, 1fr)', 'repeat(2, 1 fr)', '2 columns equal', '1fr repeat(2)'],
        correct: 0
    },
    {
        code: 'Texte<br></br>suivant',
        question: 'Quelle version respecte la syntaxe de la balise de saut de ligne ?',
        options: ['Texte<break>suivant', 'Texte<br>suivant', 'Texte</br>suivant', 'Texte<br></br>suivant'],
        correct: 1
    },
    {
        code: '<button disabled="false">Envoyer</button>',
        question: 'Quelle version rend réellement ce bouton actif ?',
        options: ['<button disabled>Envoyer</button>', '<button disabled="0">Envoyer</button>', '<button disabled="">Envoyer</button>', '<button>Envoyer</button>'],
        correct: 3
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

function shuffleChoices(choices) {
    const shuffled = [...choices];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}

function renderOptions() {
    optionsContainer.innerHTML = '';
    const choices = levels[currentLevel].options.map((text, index) => ({ text, index }));
    shuffleChoices(choices).forEach(choice => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = choice.text;
        button.addEventListener('click', () => checkAnswer(choice.index));
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