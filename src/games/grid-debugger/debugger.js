const missions = [
    {
        title: 'Le modèle est désactivé',
        description: 'Le plan attend quatre colonnes et trois lignes. Le modèle Grid n’est pas activé.',
        hint: 'Repère la déclaration display du conteneur.',
        columns: 4,
        rows: 3,
        gap: '8px',
        pieces: [{ id: 'a', colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 2 }],
        expected: ['display: grid', 'grid-template-columns: repeat(4, 1fr)', 'grid-template-rows: repeat(3, 1fr)', 'gap: 8px', '#piece-a { grid-column: 1 / 2; grid-row: 1 / 2; }'],
        starter: '#candidate-grid {\n  display: block;\n  grid-template-columns: repeat(4, 1fr);\n  grid-template-rows: repeat(3, 1fr);\n  gap: 8px;\n}\n\n#piece-a { grid-column: 1 / 2; grid-row: 1 / 2; }'
    },
    {
        title: 'Une colonne de trop peu',
        description: 'La grille doit avoir quatre colonnes égales. La pièce A doit arriver dans la quatrième.',
        hint: 'Compte les pistes définies par grid-template-columns.',
        columns: 4,
        rows: 3,
        gap: '8px',
        pieces: [{ id: 'a', colStart: 4, colEnd: 5, rowStart: 2, rowEnd: 3 }],
        expected: ['display: grid', 'grid-template-columns: repeat(4, 1fr)', 'grid-template-rows: repeat(3, 1fr)', 'gap: 8px', '#piece-a { grid-column: 4 / 5; grid-row: 2 / 3; }'],
        starter: '#candidate-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(3, 1fr);\n  gap: 8px;\n}\n\n#piece-a { grid-column: 4 / 5; grid-row: 2 / 3; }'
    },
    {
        title: 'La troisième ligne manquante',
        description: 'La grille a besoin de trois lignes égales pour placer A tout en bas.',
        hint: 'La ligne de fin 4 est nécessaire pour occuper la troisième rangée.',
        columns: 4,
        rows: 3,
        gap: '8px',
        pieces: [{ id: 'a', colStart: 1, colEnd: 2, rowStart: 3, rowEnd: 4 }],
        expected: ['display: grid', 'grid-template-columns: repeat(4, 1fr)', 'grid-template-rows: repeat(3, 1fr)', 'gap: 8px', '#piece-a { grid-column: 1 / 2; grid-row: 3 / 4; }'],
        starter: '#candidate-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  grid-template-rows: repeat(2, 1fr);\n  gap: 8px;\n}\n\n#piece-a { grid-column: 1 / 2; grid-row: 3 / 4; }'
    },
    {
        title: 'Un espace trop serré',
        description: 'Les pièces doivent garder un écart de 12 px entre les pistes.',
        hint: 'Vérifie la valeur de gap sur le conteneur, pas sur chaque pièce.',
        columns: 4,
        rows: 3,
        gap: '12px',
        pieces: [{ id: 'a', colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 2 }, { id: 'b', colStart: 4, colEnd: 5, rowStart: 3, rowEnd: 4 }],
        expected: ['display: grid', 'grid-template-columns: repeat(4, 1fr)', 'grid-template-rows: repeat(3, 1fr)', 'gap: 12px', '#piece-a { grid-column: 1 / 2; grid-row: 1 / 2; }', '#piece-b { grid-column: 4 / 5; grid-row: 3 / 4; }'],
        starter: '#candidate-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  grid-template-rows: repeat(3, 1fr);\n  gap: 4px;\n}\n\n#piece-a { grid-column: 1 / 2; grid-row: 1 / 2; }\n#piece-b { grid-column: 4 / 5; grid-row: 3 / 4; }'
    },
    {
        title: 'La ligne de fin',
        description: 'A doit occuper les colonnes 2 et 3 de la première ligne.',
        hint: 'La ligne de fin est exclusive : pour occuper la colonne 3, termine à la ligne 4.',
        columns: 4,
        rows: 3,
        gap: '8px',
        pieces: [{ id: 'a', colStart: 2, colEnd: 4, rowStart: 1, rowEnd: 2 }],
        expected: ['display: grid', 'grid-template-columns: repeat(4, 1fr)', 'grid-template-rows: repeat(3, 1fr)', 'gap: 8px', '#piece-a { grid-column: 2 / 4; grid-row: 1 / 2; }'],
        starter: '#candidate-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  grid-template-rows: repeat(3, 1fr);\n  gap: 8px;\n}\n\n#piece-a { grid-column: 2 / 3; grid-row: 1 / 2; }'
    },
    {
        title: 'Deux lignes occupées',
        description: 'A doit couvrir les deux premières lignes dans la première colonne.',
        hint: 'La ligne finale doit être placée après la deuxième ligne.',
        columns: 4,
        rows: 3,
        gap: '8px',
        pieces: [{ id: 'a', colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 3 }],
        expected: ['display: grid', 'grid-template-columns: repeat(4, 1fr)', 'grid-template-rows: repeat(3, 1fr)', 'gap: 8px', '#piece-a { grid-column: 1 / 2; grid-row: 1 / 3; }'],
        starter: '#candidate-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  grid-template-rows: repeat(3, 1fr);\n  gap: 8px;\n}\n\n#piece-a { grid-column: 1 / 2; grid-row: 1 / 2; }'
    },
    {
        title: 'La deuxième zone',
        description: 'Place A à gauche et B sur les deux colonnes de droite de la première ligne.',
        hint: 'Le début de B est la ligne 3 ; sa fin doit être la ligne 5.',
        columns: 4,
        rows: 3,
        gap: '8px',
        pieces: [{ id: 'a', colStart: 1, colEnd: 3, rowStart: 1, rowEnd: 2 }, { id: 'b', colStart: 3, colEnd: 5, rowStart: 1, rowEnd: 2 }],
        expected: ['display: grid', 'grid-template-columns: repeat(4, 1fr)', 'grid-template-rows: repeat(3, 1fr)', 'gap: 8px', '#piece-a { grid-column: 1 / 3; grid-row: 1 / 2; }', '#piece-b { grid-column: 3 / 5; grid-row: 1 / 2; }'],
        starter: '#candidate-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  grid-template-rows: repeat(3, 1fr);\n  gap: 8px;\n}\n\n#piece-a { grid-column: 1 / 3; grid-row: 1 / 2; }\n#piece-b { grid-column: 3 / 4; grid-row: 1 / 2; }'
    },
    {
        title: 'Le plan complet',
        description: 'Répare le dernier placement pour compléter les quatre zones sans laisser de ligne vide.',
        hint: 'D et C occupent les deux dernières lignes ; la ligne de fin de D doit être 4.',
        columns: 4,
        rows: 3,
        gap: '8px',
        pieces: [{ id: 'a', colStart: 1, colEnd: 3, rowStart: 1, rowEnd: 2 }, { id: 'b', colStart: 3, colEnd: 5, rowStart: 1, rowEnd: 2 }, { id: 'c', colStart: 1, colEnd: 3, rowStart: 2, rowEnd: 4 }, { id: 'd', colStart: 3, colEnd: 5, rowStart: 2, rowEnd: 4 }],
        expected: ['display: grid', 'grid-template-columns: repeat(4, 1fr)', 'grid-template-rows: repeat(3, 1fr)', 'gap: 8px', '#piece-a { grid-column: 1 / 3; grid-row: 1 / 2; }', '#piece-b { grid-column: 3 / 5; grid-row: 1 / 2; }', '#piece-c { grid-column: 1 / 3; grid-row: 2 / 4; }', '#piece-d { grid-column: 3 / 5; grid-row: 2 / 4; }'],
        starter: '#candidate-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  grid-template-rows: repeat(3, 1fr);\n  gap: 8px;\n}\n\n#piece-a { grid-column: 1 / 3; grid-row: 1 / 2; }\n#piece-b { grid-column: 3 / 5; grid-row: 1 / 2; }\n#piece-c { grid-column: 1 / 3; grid-row: 2 / 4; }\n#piece-d { grid-column: 3 / 5; grid-row: 2 / 3; }'
    }
];

const targetGrid = document.getElementById('target-grid');
const candidateGrid = document.getElementById('candidate-grid');
const targetGuide = document.getElementById('target-guide');
const attemptGuide = document.getElementById('attempt-guide');
const codeInput = document.getElementById('debug-code');
const missionList = document.getElementById('mission-list');
const feedback = document.getElementById('debugger-feedback');
const nextMission = document.getElementById('next-mission');
const completed = new Set();
let currentMission = 0;

function createGuide(guide) {
    guide.replaceChildren();
    for (let row = 1; row <= 3; row++) {
        for (let column = 1; column <= 4; column++) {
            const cell = document.createElement('span');
            cell.textContent = `${row}.${column}`;
            guide.appendChild(cell);
        }
    }
}

function createPiece(piece, target = false) {
    const element = document.createElement('div');
    element.id = target ? `target-piece-${piece.id}` : `piece-${piece.id}`;
    element.className = `debug-piece debug-piece--${piece.id}`;
    element.textContent = piece.id.toUpperCase();
    if (target) {
        element.style.gridColumn = `${piece.colStart} / ${piece.colEnd}`;
        element.style.gridRow = `${piece.rowStart} / ${piece.rowEnd}`;
    }
    return element;
}

function updateMissionList() {
    missionList.replaceChildren();
    missions.forEach((mission, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = String(index + 1).padStart(2, '0');
        button.setAttribute('aria-label', `Mission ${index + 1} : ${mission.title}`);
        if (index === currentMission) button.setAttribute('aria-current', 'step');
        if (completed.has(index)) button.classList.add('is-complete');
        button.addEventListener('click', () => selectMission(index));
        missionList.appendChild(button);
    });
    document.getElementById('debugger-score').textContent = `${completed.size} / ${missions.length}`;
}

function applyStarterCode() {
    getOrCreateStyleElement('grid-debug-user-style').textContent = codeInput.value;
}

function updateMission() {
    const mission = missions[currentMission];
    document.getElementById('mission-index').textContent = `MISSION ${String(currentMission + 1).padStart(2, '0')} / ${String(missions.length).padStart(2, '0')}`;
    document.getElementById('mission-title').textContent = mission.title;
    document.getElementById('mission-description').textContent = mission.description;
    document.getElementById('mission-hint').textContent = mission.hint;
    targetGrid.style.display = 'grid';
    targetGrid.style.gridTemplateColumns = `repeat(${mission.columns}, 1fr)`;
    targetGrid.style.gridTemplateRows = `repeat(${mission.rows}, 1fr)`;
    targetGrid.style.gap = mission.gap;
    targetGuide.style.setProperty('--guide-gap', mission.gap);
    attemptGuide.style.setProperty('--guide-gap', mission.gap);
    targetGrid.replaceChildren(...mission.pieces.map(piece => createPiece(piece, true)));
    candidateGrid.replaceChildren(...mission.pieces.map(piece => createPiece(piece)));
    codeInput.value = mission.starter;
    applyStarterCode();
    feedback.textContent = '';
    nextMission.hidden = true;
    document.getElementById('attempt-status').textContent = 'À CORRIGER';
    document.getElementById('attempt-status').dataset.state = 'error';
    updateMissionList();
}

function selectMission(index) {
    currentMission = index;
    updateMission();
}

function normalizedCode(value) {
    return value.replace(/\s+/g, '').toLowerCase();
}

function countTracks(value) {
    return value.trim().split(/\s+/).filter(Boolean).length;
}

function layoutMatches(mission) {
    const style = getComputedStyle(candidateGrid);
    if (style.display !== 'grid' || countTracks(style.gridTemplateColumns) !== mission.columns ||
        countTracks(style.gridTemplateRows) !== mission.rows || style.gap !== mission.gap) return false;

    const targetOrigin = targetGrid.getBoundingClientRect();
    const candidateOrigin = candidateGrid.getBoundingClientRect();
    return mission.pieces.every(target => {
        const actual = document.getElementById(`piece-${target.id}`);
        const expected = document.getElementById(`target-piece-${target.id}`);
        const actualStyle = getComputedStyle(actual);
        const actualBounds = actual.getBoundingClientRect();
        const expectedBounds = expected.getBoundingClientRect();
        return actualStyle.gridColumnStart === String(target.colStart) &&
            actualStyle.gridColumnEnd === String(target.colEnd) &&
            actualStyle.gridRowStart === String(target.rowStart) &&
            actualStyle.gridRowEnd === String(target.rowEnd) &&
            Math.abs((actualBounds.x - candidateOrigin.x) - (expectedBounds.x - targetOrigin.x)) < 1 &&
            Math.abs((actualBounds.y - candidateOrigin.y) - (expectedBounds.y - targetOrigin.y)) < 1 &&
            Math.abs(actualBounds.width - expectedBounds.width) < 1 &&
            Math.abs(actualBounds.height - expectedBounds.height) < 1;
    });
}

function checkMission() {
    applyStarterCode();
    const mission = missions[currentMission];
    const code = normalizedCode(codeInput.value);
    if (!mission.expected.every(rule => code.includes(normalizedCode(rule)))) {
        feedback.textContent = 'Le CSS contient encore une déclaration à corriger.';
        feedback.style.color = '#a73e2e';
        document.getElementById('attempt-status').textContent = 'À CORRIGER';
        document.getElementById('attempt-status').dataset.state = 'error';
        return;
    }

    if (!layoutMatches(mission)) {
        feedback.textContent = 'Les déclarations sont présentes, mais le rendu ne correspond pas encore au plan.';
        feedback.style.color = '#a73e2e';
        document.getElementById('attempt-status').textContent = 'HORS PLAN';
        document.getElementById('attempt-status').dataset.state = 'error';
        return;
    }

    completed.add(currentMission);
    feedback.textContent = completed.size === missions.length ? 'Debugger terminé : huit erreurs corrigées.' : 'Erreur corrigée. Les lignes de placement correspondent au plan.';
    feedback.style.color = '#356e54';
    document.getElementById('attempt-status').textContent = 'CORRIGÉ';
    document.getElementById('attempt-status').dataset.state = 'success';
    nextMission.hidden = currentMission === missions.length - 1;
    updateMissionList();
}

document.getElementById('check-css').addEventListener('click', checkMission);
document.getElementById('reset-code').addEventListener('click', () => {
    codeInput.value = missions[currentMission].starter;
    applyStarterCode();
    feedback.textContent = '';
    document.getElementById('attempt-status').textContent = 'À CORRIGER';
    document.getElementById('attempt-status').dataset.state = 'error';
});
document.getElementById('next-mission').addEventListener('click', () => {
    if (currentMission < missions.length - 1) selectMission(currentMission + 1);
});

createGuide(targetGuide);
createGuide(attemptGuide);
updateMission();