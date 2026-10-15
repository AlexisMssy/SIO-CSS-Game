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
        code: '<ul>\n  <li>Rouge</li>\n  <li>Vert</li>\n</ul>',
        question: 'Quelles affirmations sont exactes ?',
        options: ['C’est une liste non ordonnée.', 'Elle contient deux éléments de liste.', 'C’est une liste numérotée.', 'ul est une propriété CSS.', 'Les éléments sont automatiquement en gras.'],
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
        code: '<p class="message" style="color: red;">Ouverture</p>\n.message { color: blue; }',
        question: 'Quelle couleur s’affiche et comment garder le style externe ?',
        options: ['Le texte est rouge : le style inline est prioritaire.', 'Le texte est bleu : la règle externe est toujours prioritaire.', 'Retirer le style inline permet à la règle externe de s’appliquer.', 'Ajouter !important est la solution recommandée.', 'Le navigateur ignore toujours les styles inline.'],
        correct: [0, 2]
    },
    {
        code: '<nav class="menu"><a>Accueil</a><a>Contact</a></nav>\n.menu { display: flex; justify-content: space-between; gap: 1rem; }',
        question: 'Quelles affirmations sont exactes ?',
        options: ['nav identifie une zone de navigation.', 'Les liens directs deviennent des éléments flex.', 'justify-content répartit les éléments sur l’axe principal.', 'gap ajoute une marge extérieure à chaque lien.', 'La classe menu se sélectionne avec #menu.', 'Le texte s’aligne automatiquement à droite.'],
        correct: [0, 1, 2]
    },
    {
        code: '<div class="layout"><main>Contenu</main><aside>À côté</aside></div>\n.layout { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }',
        question: 'Quelles affirmations sont exactes ?',
        options: ['display: grid active une grille sur le conteneur.', 'La première colonne reçoit deux parts et la seconde une part.', 'gap ajoute un espacement constant entre les pistes.', 'Grid ne s’applique qu’aux descendants imbriqués.', 'La grille est limitée à une seule colonne.', 'La navigation du site doit obligatoirement utiliser Grid.'],
        correct: [0, 1, 2]
    },
    {
        code: '<nav><a>Accueil</a><div><a>Informations</a></div></nav>\nh1, h2, h3 { color: navy; }\np.important { font-weight: bold; }',
        question: 'Quelles affirmations décrivent les sélecteurs vus en S8 ?',
        options: ['nav a cible les deux liens descendants.', 'nav > a cible uniquement le lien enfant direct.', 'La virgule permet de grouper plusieurs sélecteurs.', 'p.important cible un paragraphe portant la classe important.', 'nav a et nav > a ciblent toujours exactement les mêmes éléments.', 'p.important cible un élément dont l’id est important.'],
        correct: [0, 1, 2, 3]
    },
    {
        code: '.grille {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}',
        question: 'Quelles affirmations décrivent cette grille ?',
        options: ['Elle définit trois colonnes.', 'repeat(3, 1fr) remplace trois valeurs 1fr répétées.', 'gap crée un espacement de 16 px entre les pistes.', 'La propriété doit être écrite sur chaque carte séparément.', 'display: grid active le modèle Grid sur le conteneur.', 'La règle cible l’id grille.'],
        correct: [0, 1, 2, 4]
    },
    {
        code: 'https://www.sioservices.fr/support',
        question: 'Quelles parties de cette URL sont correctement identifiées ?',
        options: ['https est le protocole.', 'www.sioservices.fr est le nom de domaine.', '/support est le chemin vers la ressource.', 'support est l’adresse IP du serveur.', 'https est le nom du serveur DNS.'],
        correct: [0, 1, 2]
    },
    {
        code: 'www.sioservices.fr → DNS → adresse IP',
        question: 'Quel rôle joue le DNS dans ce parcours ?',
        options: ['Il associe le nom de domaine à une adresse IP.', 'Il met en forme les titres de la page.', 'Il remplace la requête HTTP.', 'Il permet de retrouver la machine à contacter.', 'Il transforme le HTML en CSS.'],
        correct: [0, 3]
    },
    {
        code: 'Navigateur (client) → requête HTTP GET /support → serveur Web',
        question: 'Quelles affirmations décrivent cet échange ?',
        options: ['Le navigateur envoie la requête.', 'Le serveur répond à la demande du client.', 'GET /support demande une ressource au serveur.', 'Le DNS envoie la page au navigateur.', 'Le serveur doit envoyer une requête au client avant toute demande.'],
        correct: [0, 1, 2]
    },
    {
        code: 'HTTP/1.1 404 Not Found',
        question: 'Quel diagnostic correspond le mieux à cette réponse ?',
        options: ['Le serveur a répondu, mais la ressource demandée est introuvable.', 'Le DNS est forcément en panne.', 'Le navigateur n’a jamais contacté de serveur.', 'Le CSS empêche la page d’exister.', 'La page a forcément été supprimée du navigateur.'],
        correct: [0]
    },
    {
        code: '<h1>Support</h1>\nh1 { color: navy; }\nbutton.addEventListener("click", ...)',
        question: 'Associe chaque extrait à son rôle principal.',
        options: ['La balise h1 relève du HTML et structure le contenu.', 'La règle h1 { color: navy; } relève du CSS et présente le titre.', 'addEventListener permet au JavaScript de réagir à une action.', 'Le CSS associe un nom de domaine à une adresse IP.', 'HTML gère principalement les échanges HTTP avec le serveur.'],
        correct: [0, 1, 2]
    },
    {
        code: 'git status\ngit add .\ngit commit -m "Fix HTML structure"\ngit log --oneline',
        question: 'Quelles affirmations décrivent les commandes du cycle de travail vu en S5 ?',
        options: ['git status affiche l’état des fichiers.', 'git add prépare les modifications à valider.', 'git commit enregistre une étape avec un message.', 'git log affiche l’historique des commits.', 'git status crée automatiquement un commit.'],
        correct: [0, 1, 2, 3]
    },
    {
        code: '@media (max-width: 600px) {\n  #box { background-color: blue; }\n}',
        question: 'Quelles affirmations sont exactes ?',
        options: ['La règle s’applique jusqu’à 600 px de large.', 'Elle cible l’élément d’id box.', 'Le fond devient bleu.', 'Elle ajoute une classe box.', 'Elle s’applique uniquement au survol.'],
        correct: [0, 1, 2],
        advanced: true
    },
    {
        code: 'button:hover {\n  background-color: green;\n}',
        question: 'Quelles affirmations sont exactes ?',
        options: ['La règle s’applique au survol.', 'Elle colore le fond en vert.', 'Elle cible la classe button.', 'Elle crée un bouton HTML.', 'Elle change le texte en vert.'],
        correct: [0, 1],
        advanced: true
    },
    {
        code: '<article class="fiche">\n  <h2>Atelier</h2>\n</article>\n.fiche { border: 1px solid; padding: 12px; }',
        question: 'Quelles affirmations sont exactes ?',
        options: ['article crée un élément de contenu autonome.', 'La classe fiche se sélectionne avec .fiche.', 'padding ajoute un espace intérieur de 12 px.', 'La bordure est verte.', 'h2 est un sélecteur CSS.', 'La règle .fiche cible un id.'],
        correct: [0, 1, 2],
        advanced: true
    },
    {
        code: '<form>\n  <label for="mail">Courriel</label>\n  <input id="mail" type="email" required>\n  <button type="submit">Envoyer</button>\n</form>',
        question: 'Quelles affirmations décrivent correctement ce formulaire ?',
        options: ['Le label est associé au champ mail.', 'required rend la saisie obligatoire.', 'Le champ utilise la validation de type e-mail.', 'Le bouton soumet le formulaire.', 'La balise form est une règle CSS.', 'Le label pointe vers un id absent.'],
        correct: [0, 1, 2, 3],
        advanced: true
    },
    {
        code: 'input:focus-visible {\n  outline: 3px solid orange;\n}',
        question: 'Quelles affirmations sont exactes ?',
        options: ['Le sélecteur cible un champ en focus visible.', 'outline ajoute un contour sans modifier la place dans la mise en page.', 'La couleur du contour est orange.', 'La règle cible seulement les champs désactivés.', 'outline est une balise HTML.', 'La règle impose une largeur de 3 px au champ.'],
        correct: [0, 1, 2],
        advanced: true
    },
    {
        code: '.carte {\n  width: 240px;\n  padding: 20px;\n  border: 2px solid;\n}',
        question: 'Avec le modèle de boîte content-box par défaut, quelles affirmations sont exactes ?',
        options: ['La largeur de contenu vaut 240 px.', 'Le padding ajoute 40 px à la largeur extérieure.', 'La bordure ajoute 4 px à la largeur extérieure.', 'La largeur extérieure totale vaut 284 px.', 'padding décrit une marge extérieure.', 'box-sizing vaut border-box automatiquement.'],
        correct: [0, 1, 2, 3],
        advanced: true
    },
    {
        code: '<section class="alerte"><p>Attention <strong>important</strong></p></section>\n.alerte { color: maroon; }\n.alerte strong { font-weight: bold; }',
        question: 'Quelles affirmations sont exactes ?',
        options: ['section est un élément HTML de regroupement.', 'Le paragraphe hérite de la couleur maroon.', 'Le sélecteur .alerte strong cible le strong descendant.', 'font-weight règle la graisse du texte.', 'strong remplace section dans le DOM.', 'La couleur maroon est une valeur de background-color.'],
        correct: [0, 1, 2, 3],
        advanced: true
    },
    {
        code: '.carte { transition: transform 200ms ease; }\n@media (prefers-reduced-motion: reduce) {\n  .carte { transition: none; }\n}',
        question: 'Quelles affirmations sont exactes ?',
        options: ['La transition concerne transform.', 'La durée normale indiquée est de 200 ms.', 'La préférence de réduction des animations désactive cette transition.', 'La media query dépend de la largeur de l’écran.', 'ease est un sélecteur CSS.', 'La règle réduit automatiquement la taille de la carte.'],
        correct: [0, 1, 2],
        advanced: true
    },
    {
        code: '<nav aria-label="Principale"><a class="actif" href="/">Accueil</a></nav>\nnav[aria-label="Principale"] .actif { font-weight: 700; }',
        question: 'Quelles affirmations sont exactes ?',
        options: ['nav est une région de navigation.', 'aria-label donne un nom accessible à cette région.', 'Le sélecteur cible .actif à l’intérieur du nav nommé Principale.', 'font-weight: 700 met le texte en gras.', 'Le sélecteur cible tous les liens du document.', 'aria-label est une propriété CSS.'],
        correct: [0, 1, 2, 3],
        advanced: true
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
    levelText.textContent = `${level.advanced ? 'Approfondissement — ' : ''}Niveau ${currentLevel + 1} : lis le code puis choisis les affirmations exactes.`;
    if (level.advanced) levelText.classList.add('level-desc--advanced');
    else levelText.classList.remove('level-desc--advanced');
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