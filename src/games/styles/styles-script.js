const GAME_PREFIX = 'styles';
const target = document.getElementById('css-target');
const styleInput = document.getElementById('style-input');
const levelText = document.getElementById('level-text');
const levelCounter = document.getElementById('level-counter');
const levelList = document.getElementById('level-list');
const scoreDisplay = document.getElementById('score-display');
const statusDiv = document.getElementById('status');
const nextBtn = document.getElementById('next-level');
const gameEnd = document.getElementById('game-end');
const finalScore = document.getElementById('final-score');

const levels = [
    { text: 'Niveau 1 : change la couleur du texte en bleu (#0066cc).', property: 'color', value: 'rgb(0, 102, 204)' },
    { text: 'Niveau 2 : donne un fond jaune à la carte.', property: 'background-color', value: 'rgb(255, 215, 0)' },
    { text: 'Niveau 3 : règle la taille du texte à 24px.', property: 'font-size', value: '24px' },
    { text: 'Niveau 4 : centre le texte de la carte.', property: 'text-align', value: 'center' },
    { text: 'Niveau 5 : ajoute 24px d’espace intérieur.', property: 'padding', value: '24px' },
    { text: 'Niveau 6 : arrondis les coins avec 16px.', property: 'border-radius', value: '16px' },
    { text: 'Niveau 7 : ajoute une bordure noire de 3px.', property: 'border', value: '3px solid rgb(34, 34, 34)' },
    { text: 'Niveau 8 : règle la largeur de la carte à 280px.', property: 'width', value: '280px' },
    { text: 'Niveau 9 : rends la carte légèrement transparente (70%).', property: 'opacity', value: '0.7' },
    { text: 'Niveau 10 : ajoute 16px d’espace extérieur.', property: 'margin', value: '16px' },
    { text: 'Niveau 11 : rends le texte en gras (700).', property: 'font-weight', value: '700' },
    { text: 'Niveau 12 : souligne le texte de la carte.', property: 'text-decoration', value: 'underline' },
    { text: 'Niveau 13 : transforme la carte en ligne-bloc.', property: 'display', value: 'inline-block' },
    { text: 'Niveau 14 : positionne la carte en absolu.', property: 'position', value: 'absolute' },
    { text: 'Niveau 15 : ajoute une ombre portée à la carte.', property: 'box-shadow', value: '0px 4px 8px rgba(0, 0, 0, 0.2)' },
    { text: 'Niveau 16 : tourne la carte de 90 degrés.', property: 'transform', value: 'rotate(90deg)' },
    { text: 'Niveau 17 : ajoute une transition sur le survol.', property: 'transition', value: 'all 0.3s ease' },
    { text: 'Niveau 18 : change le curseur en main.', property: 'cursor', value: 'pointer' },
    { text: 'Niveau 19 : place la carte devant un autre élément (z-index).', property: 'z-index', value: '10' },
    { text: 'Niveau 20 : cache le dépassement de contenu.', property: 'overflow', value: 'hidden' },
    { text: 'Niveau 21 : définit la taille de la flex de la carte.', property: 'flex', value: '1 1 0%' },
    { text: 'Niveau 22 : définit la grille à 2 colonnes.', property: 'grid-template-columns', value: '1fr 1fr' },
    { text: 'Niveau 23 : définit la hauteur minimum de la carte.', property: 'min-height', value: '200px' },
    { text: 'Niveau 24 : utilise une image de fond.', property: 'background-image', value: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'><rect width=\'10\' height=\'10\' fill=\'white\'/></svg>")' },
    { text: 'Niveau 25 : définit la taille de l’image de fond.', property: 'background-size', value: 'cover' },
    { text: 'Niveau 26 : espace les lettres de 2px.', property: 'letter-spacing', value: '2px' },
    { text: 'Niveau 27 : définit l’interligne à 1.5.', property: 'line-height', value: '1.5' },
    { text: 'Niveau 28 : aligne le texte verticalement.', property: 'vertical-align', value: 'middle' },
    { text: 'Niveau 29 : force l’affichage sur une seule ligne.', property: 'white-space', value: 'nowrap' },
    { text: 'Niveau 30 : change le style de la puce de liste.', property: 'list-style', value: 'square' },
    { text: 'Niveau 31 : effondre les bordures du tableau.', property: 'border-collapse', value: 'collapse' },
    { text: 'Niveau 32 : définit le modèle de boîte border-box.', property: 'box-sizing', value: 'border-box' },
    { text: 'Niveau 33 : cache la carte (visibilité).', property: 'visibility', value: 'hidden' },
    { text: 'Niveau 34 : définit la largeur maximum de la carte.', property: 'max-width', value: '320px' },
    { text: 'Niveau 35 : définit la hauteur maximum de la carte.', property: 'max-height', value: '200px' }
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
    styleInput.value = '';
    statusDiv.textContent = '';
    nextBtn.style.display = 'none';
    target.removeAttribute('style');
    updateLevelList();
    saveState();
}

function selectLevel(index) {
    currentLevel = index;
    updateLevel();
}

function parseDeclaration(value) {
    const match = value.trim().match(/^([a-z-]+)\s*:\s*([^;]+);?$/i);
    if (!match) return null;
    return { property: match[1].toLowerCase(), value: match[2].trim() };
}

function testStyle() {
    const declaration = parseDeclaration(styleInput.value);
    const level = levels[currentLevel];
    if (!declaration || declaration.property !== level.property) {
        statusDiv.textContent = `Utilise la propriété ${level.property} avec une valeur CSS valide.`;
        statusDiv.className = 'style-status error';
        return;
    }

    target.style.setProperty(declaration.property, declaration.value);
    const computedValue = getComputedStyle(target).getPropertyValue(level.property).trim();
    const expectedValue = level.value;

    if (computedValue === expectedValue) {
        completeLevel();
        statusDiv.textContent = 'Bravo, la propriété est correctement appliquée !';
        statusDiv.className = 'style-status success';
        updateLevelList();
        scoreDisplay.textContent = `Points : ${score}`;
        saveState();
        if (currentLevel === levels.length - 1) finishGame();
        else nextBtn.style.display = 'inline-block';
    } else {
        statusDiv.textContent = 'La propriété est bonne, mais sa valeur ne correspond pas encore au défi.';
        statusDiv.className = 'style-status error';
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
document.getElementById('test-btn').addEventListener('click', testStyle);
styleInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') testStyle();
});
nextBtn.addEventListener('click', () => {
    currentLevel += 1;
    updateLevel();
});
document.getElementById('restart-btn').addEventListener('click', restartGame);
