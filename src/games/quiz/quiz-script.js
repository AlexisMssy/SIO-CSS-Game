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
    },
    {
        code: '<article class="fiche">\n  <h2>Atelier</h2>\n</article>\n.fiche { border: 1px solid; padding: 12px; }',
        question: 'Quelles affirmations sont exactes ?',
        options: ['article crée un élément de contenu autonome.', 'La classe fiche se sélectionne avec .fiche.', 'padding ajoute un espace intérieur de 12 px.', 'La bordure est verte.', 'h2 est un sélecteur CSS.', 'La règle .fiche cible un id.'],
        correct: [0, 1, 2]
    },
    {
        code: '<p class="note">Important</p>\np { color: teal; }\n.note { color: maroon; }',
        question: 'Quelles affirmations décrivent correctement la cascade ?',
        options: ['Les deux règles correspondent au paragraphe.', 'La règle .note est plus spécifique que p.', 'Le texte sera maroon.', 'La première règle gagne toujours.', '.note cible un id.', 'color modifie la couleur de fond.'],
        correct: [0, 1, 2]
    },
    {
        code: '<nav class="menu"><a>Accueil</a><a>Contact</a></nav>\n.menu { display: flex; justify-content: space-between; gap: 1rem; }',
        question: 'Quelles affirmations sont exactes ?',
        options: ['nav identifie une zone de navigation.', 'Les liens directs deviennent des éléments flex.', 'justify-content répartit les éléments sur l’axe principal.', 'gap ajoute une marge extérieure à chaque lien.', 'La classe menu se sélectionne avec #menu.', 'Le texte s’aligne automatiquement à droite.'],
        correct: [0, 1, 2]
    },
    {
        code: '<div class="layout"><main>Contenu</main><aside>À côté</aside></div>\n.layout { display: grid; grid-template-columns: 1fr 2fr; }\n@media (max-width: 600px) { .layout { grid-template-columns: 1fr; } }',
        question: 'Quelles affirmations sont exactes ?',
        options: ['La grille a deux colonnes au-dessus de 600 px.', 'La seconde colonne reçoit deux fractions de largeur.', 'À 600 px ou moins, la grille passe à une colonne.', 'La media query s’applique uniquement au-dessus de 600 px.', 'Le sélecteur cible un id nommé layout.', 'display: grid active le modèle Grid.'],
        correct: [0, 1, 2, 5]
    },
    {
        code: '<form>\n  <label for="mail">Courriel</label>\n  <input id="mail" type="email" required>\n  <button type="submit">Envoyer</button>\n</form>',
        question: 'Quelles affirmations décrivent correctement ce formulaire ?',
        options: ['Le label est associé au champ mail.', 'required rend la saisie obligatoire.', 'Le champ utilise la validation de type e-mail.', 'Le bouton soumet le formulaire.', 'La balise form est une règle CSS.', 'Le label pointe vers un id absent.'],
        correct: [0, 1, 2, 3]
    },
    {
        code: 'input:focus-visible {\n  outline: 3px solid orange;\n}',
        question: 'Quelles affirmations sont exactes ?',
        options: ['Le sélecteur cible un champ en focus visible.', 'outline ajoute un contour sans modifier la place dans la mise en page.', 'La couleur du contour est orange.', 'La règle cible seulement les champs désactivés.', 'outline est une balise HTML.', 'La règle impose une largeur de 3 px au champ.'],
        correct: [0, 1, 2]
    },
    {
        code: '.carte {\n  width: 240px;\n  padding: 20px;\n  border: 2px solid;\n}',
        question: 'Avec le modèle de boîte content-box par défaut, quelles affirmations sont exactes ?',
        options: ['La largeur de contenu vaut 240 px.', 'Le padding ajoute 40 px à la largeur extérieure.', 'La bordure ajoute 4 px à la largeur extérieure.', 'La largeur extérieure totale vaut 284 px.', 'padding décrit une marge extérieure.', 'box-sizing vaut border-box automatiquement.'],
        correct: [0, 1, 2, 3]
    },
    {
        code: '<section class="alerte"><p>Attention <strong>important</strong></p></section>\n.alerte { color: maroon; }\n.alerte strong { font-weight: bold; }',
        question: 'Quelles affirmations sont exactes ?',
        options: ['section est un élément HTML de regroupement.', 'Le paragraphe hérite de la couleur maroon.', 'Le sélecteur .alerte strong cible le strong descendant.', 'font-weight règle la graisse du texte.', 'strong remplace section dans le DOM.', 'La couleur maroon est une valeur de background-color.'],
        correct: [0, 1, 2, 3]
    },
    {
        code: '<p id="message" class="note">Bonjour</p>\np { color: teal; }\n.note { color: orange; }\n#message { color: navy; }',
        question: 'Quelles affirmations sont exactes ?',
        options: ['Les trois règles correspondent au paragraphe.', 'Le sélecteur d’id est le plus spécifique des trois.', 'La couleur finale est navy.', 'La règle p gagne parce qu’elle apparaît en premier.', '.note cible un élément ayant la classe note.', 'color définit la couleur de fond.'],
        correct: [0, 1, 2, 4]
    },
    {
        code: '.grille {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 16px;\n}',
        question: 'Quelles affirmations décrivent cette grille ?',
        options: ['Elle définit trois colonnes.', 'Chaque colonne reçoit une fraction égale de l’espace.', 'gap crée un espacement de 16 px entre les pistes.', 'minmax(0, 1fr) autorise une piste à rétrécir sous sa taille min-content.', 'display: grid crée une liste HTML.', 'La règle cible l’id grille.'],
        correct: [0, 1, 2, 3]
    },
    {
        code: '.carte { transition: transform 200ms ease; }\n@media (prefers-reduced-motion: reduce) {\n  .carte { transition: none; }\n}',
        question: 'Quelles affirmations sont exactes ?',
        options: ['La transition concerne transform.', 'La durée normale indiquée est de 200 ms.', 'La préférence de réduction des animations désactive cette transition.', 'La media query dépend de la largeur de l’écran.', 'ease est un sélecteur CSS.', 'La règle réduit automatiquement la taille de la carte.'],
        correct: [0, 1, 2]
    },
    {
        code: '<nav aria-label="Principale"><a class="actif" href="/">Accueil</a></nav>\nnav[aria-label="Principale"] .actif { font-weight: 700; }',
        question: 'Quelles affirmations sont exactes ?',
        options: ['nav est une région de navigation.', 'aria-label donne un nom accessible à cette région.', 'Le sélecteur cible .actif à l’intérieur du nav nommé Principale.', 'font-weight: 700 met le texte en gras.', 'Le sélecteur cible tous les liens du document.', 'aria-label est une propriété CSS.'],
        correct: [0, 1, 2, 3]
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

function shuffleChoices(choices) {
    const shuffled = [...choices];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}

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
    const choices = levels[currentLevel].options.map((text, index) => ({ text, index }));
    shuffleChoices(choices).forEach(choice => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = String(choice.index);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(choice.text));
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