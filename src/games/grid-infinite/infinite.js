const GRID_BEST_KEY = 'grid-infinite-best';
const GRID_SCORE_KEY = 'grid-infinite-score';
const cycleTypes = ['tracks', 'placements', 'areas'];
const areaLayouts = [
    { matrix: [['head', 'head'], ['side', 'main']] },
    { matrix: [['head', 'head', 'head'], ['side', 'main', 'main'], ['side', 'foot', 'foot']] },
    { matrix: [['head', 'head', 'head', 'head'], ['side', 'main', 'main', 'info'], ['side', 'foot', 'foot', 'info']] },
    { matrix: [['head', 'head', 'head', 'head', 'head'], ['side', 'main', 'main', 'main', 'info'], ['side', 'main', 'main', 'main', 'info'], ['foot', 'foot', 'foot', 'foot', 'foot']] }
];

const targetGrid = document.getElementById('target-grid');
const candidateGrid = document.getElementById('candidate-grid');
const codeInput = document.getElementById('grid-code');
const feedback = document.getElementById('grid-feedback');
const checkButton = document.getElementById('check-grid');
const nextButton = document.getElementById('next-grid');
const userStyle = getOrCreateStyleElement('grid-infinite-user-style');
let cycle = [];
let lastType = null;
let cyclesCompleted = 0;
let challenge = null;
let score = readScore(GRID_SCORE_KEY);
let bestScore = readScore(GRID_BEST_KEY);
let solved = false;
let round = score;

function readScore(key) {
    try {
        const value = Number(localStorage.getItem(key));
        return Number.isSafeInteger(value) && value >= 0 ? value : 0;
    } catch {
        return 0;
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = randomInt(0, index);
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}

function nextCycleType() {
    if (cycle.length === 0) {
        cycle = cyclesCompleted === 0 ? [...cycleTypes] : shuffle(cycleTypes);
        if (cyclesCompleted > 0 && cycle[0] === lastType) [cycle[0], cycle[1]] = [cycle[1], cycle[0]];
        cyclesCompleted++;
    }
    lastType = cycle.shift();
    return lastType;
}

function createTrackSpec(count) {
    if (Math.random() < 0.55) {
        return { css: `repeat(${count}, 1fr)`, weights: Array(count).fill(1) };
    }
    const weights = Array.from({ length: count }, () => randomInt(1, 3));
    if (weights.every(weight => weight === weights[0])) weights[0] = weights[0] === 1 ? 2 : 1;
    return { css: weights.map(weight => `${weight}fr`).join(' '), weights };
}

function createRandomPieces(columns, rows, maxPieces = 4) {
    const occupied = Array.from({ length: rows }, () => Array(columns).fill(false));
    const pieces = [];
    const count = randomInt(2, Math.min(maxPieces, Math.floor(columns * rows / 2)));

    for (let index = 0; index < count; index++) {
        const maxColumnSpan = columns > 2 ? 2 : 1;
        const maxRowSpan = rows > 2 ? 2 : 1;
        let placement = null;
        for (let attempt = 0; attempt < 80 && !placement; attempt++) {
            const columnSpan = randomInt(1, maxColumnSpan);
            const rowSpan = randomInt(1, maxRowSpan);
            const columnStart = randomInt(1, columns - columnSpan + 1);
            const rowStart = randomInt(1, rows - rowSpan + 1);
            const cells = [];
            for (let row = rowStart - 1; row < rowStart - 1 + rowSpan; row++) {
                for (let column = columnStart - 1; column < columnStart - 1 + columnSpan; column++) {
                    cells.push([row, column]);
                }
            }
            if (cells.every(([row, column]) => !occupied[row][column])) {
                cells.forEach(([row, column]) => { occupied[row][column] = true; });
                placement = {
                    id: String.fromCharCode(97 + index),
                    colStart: columnStart,
                    colEnd: columnStart + columnSpan,
                    rowStart: rowStart,
                    rowEnd: rowStart + rowSpan
                };
            }
        }
        if (!placement) break;
        pieces.push(placement);
    }
    return pieces;
}

function createAreaPieces(matrix) {
    const positions = new Map();
    matrix.forEach((row, rowIndex) => row.forEach((area, columnIndex) => {
        if (area === '.') return;
        if (!positions.has(area)) positions.set(area, { id: String.fromCharCode(97 + positions.size), area, rowStart: rowIndex + 1, rowEnd: rowIndex + 2, colStart: columnIndex + 1, colEnd: columnIndex + 2 });
        const piece = positions.get(area);
        piece.rowStart = Math.min(piece.rowStart, rowIndex + 1);
        piece.rowEnd = Math.max(piece.rowEnd, rowIndex + 2);
        piece.colStart = Math.min(piece.colStart, columnIndex + 1);
        piece.colEnd = Math.max(piece.colEnd, columnIndex + 2);
    }));
    return [...positions.values()];
}

function createChallenge(type) {
    const areaLayout = type === 'areas' ? areaLayouts[randomInt(0, areaLayouts.length - 1)] : null;
    const rows = areaLayout ? areaLayout.matrix.length : randomInt(2, 5);
    const columns = areaLayout ? areaLayout.matrix[0].length : randomInt(2, 5);
    const columnTracks = createTrackSpec(columns);
    const rowTracks = createTrackSpec(rows);
    const gap = `${randomInt(8, 16)}px`;
    let pieces;
    let areas = null;

    if (type === 'areas') {
        areas = areaLayout.matrix;
        pieces = createAreaPieces(areas);
    } else {
        pieces = createRandomPieces(columns, rows, type === 'tracks' ? 3 : 5);
    }

    return {
        type,
        rows,
        columns,
        gap,
        columnTracks,
        rowTracks,
        pieces,
        areas,
        number: round + 1
    };
}

function pieceElement(piece, isTarget) {
    const element = document.createElement('div');
    element.id = `${isTarget ? 'target-' : ''}piece-${piece.id}`;
    element.className = `infinite-piece infinite-piece--${piece.id}`;
    if (isTarget && piece.area) {
        const letter = document.createElement('span');
        letter.textContent = piece.id.toUpperCase();
        const areaName = document.createElement('small');
        areaName.textContent = piece.area;
        element.append(letter, areaName);
    } else {
        element.textContent = piece.id.toUpperCase();
    }
    if (isTarget) {
        if (piece.area) element.style.gridArea = piece.area;
        else {
            element.style.gridColumn = `${piece.colStart} / ${piece.colEnd}`;
            element.style.gridRow = `${piece.rowStart} / ${piece.rowEnd}`;
        }
    }
    return element;
}

function applyTarget() {
    targetGrid.style.display = 'grid';
    targetGrid.style.gridTemplateColumns = challenge.columnTracks.css;
    targetGrid.style.gridTemplateRows = challenge.rowTracks.css;
    targetGrid.style.gap = challenge.gap;
    targetGrid.style.gridTemplateAreas = challenge.areas
        ? challenge.areas.map(row => `"${row.join(' ')}"`).join(' ')
        : 'none';
    targetGrid.replaceChildren(...challenge.pieces.map(piece => pieceElement(piece, true)));
    renderLineMarkers();
}

function trackSizes(value) {
    return value.match(/[\d.]+px/g)?.map(track => parseFloat(track)) || [];
}

function renderLineMarkers() {
    const markerLayer = document.getElementById('target-line-markers');
    markerLayer.replaceChildren();
    const style = getComputedStyle(targetGrid);
    const columns = trackSizes(style.gridTemplateColumns);
    const rows = trackSizes(style.gridTemplateRows);
    const columnGap = parseFloat(style.columnGap) || 0;
    const rowGap = parseFloat(style.rowGap) || 0;
    const gridBounds = targetGrid.getBoundingClientRect();
    const layerBounds = markerLayer.getBoundingClientRect();

    function addMarkers(tracks, gap, axis) {
        const origin = axis === 'column' ? gridBounds.left - layerBounds.left : gridBounds.top - layerBounds.top;
        for (let line = 1; line <= tracks.length + 1; line++) {
            // Les lignes intérieures sont centrées dans le gap entre deux pistes.
            const tracksBefore = tracks.slice(0, line - 1).reduce((sum, track) => sum + track, 0);
            const gapsBefore = Math.max(0, line - 2) * gap;
            const innerOffset = line > 1 && line <= tracks.length ? gap / 2 : 0;
            const position = tracksBefore + gapsBefore + innerOffset;
            const marker = document.createElement('span');
            marker.className = `grid-line-marker grid-line-marker--${axis}`;
            marker.textContent = String(line);
            markerLayer.appendChild(marker);
            if (axis === 'column') {
                marker.style.left = `${origin + position}px`;
            } else {
                marker.style.top = `${origin + position}px`;
                marker.style.left = `${gridBounds.left - layerBounds.left - marker.offsetWidth}px`;
            }
            // Le trait part du bord du repère et va jusqu'au bord opposé de la grille.
            const lineLength = axis === 'column'
                ? gridBounds.bottom - layerBounds.top - marker.offsetTop - marker.offsetHeight
                : gridBounds.right - layerBounds.left - marker.offsetLeft - marker.offsetWidth;
            marker.style.setProperty('--line-length', `${lineLength}px`);
            // Une ligne intérieure occupe toute l'épaisseur du gap.
            marker.style.setProperty('--gap-size', `${line > 1 && line <= tracks.length ? gap : 0}px`);
        }
    }

    addMarkers(columns, columnGap, 'column');
    addMarkers(rows, rowGap, 'row');
}

function starterCode() {
    return '#candidate-grid {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  grid-template-rows: repeat(2, 1fr);\n  gap: 0;\n}\n\n#piece-a { grid-column: 1 / 2; grid-row: 1 / 2; }';
}

function updateScore() {
    document.getElementById('current-score').textContent = String(score);
    document.getElementById('best-score').textContent = String(bestScore);
    try {
        localStorage.setItem(GRID_SCORE_KEY, String(score));
        localStorage.setItem(GRID_BEST_KEY, String(bestScore));
    } catch {
        feedback.textContent = 'Score non sauvegardé sur cet appareil.';
    }
}

function startChallenge() {
    round++;
    challenge = createChallenge(nextCycleType());
    challenge.number = round;
    solved = false;
    document.getElementById('challenge-number').textContent = `GRILLE ${String(round).padStart(2, '0')}`;
    document.getElementById('challenge-family').textContent = {
        tracks: 'PISTES & ESPACEMENTS',
        placements: 'PLACEMENTS PAR LIGNES',
        areas: 'ZONES NOMMÉES'
    }[challenge.type];
    document.getElementById('challenge-instruction').textContent = `${columnsLabel(challenge.columns)} × ${rowsLabel(challenge.rows)} · gap ${challenge.gap}`;
    applyTarget();
    candidateGrid.replaceChildren(...challenge.pieces.map(piece => pieceElement(piece, false)));
    codeInput.value = starterCode();
    userStyle.textContent = codeInput.value;
    feedback.textContent = '';
    feedback.style.color = '';
    checkButton.disabled = false;
    nextButton.hidden = true;
    document.getElementById('candidate-state').textContent = 'À COMPOSER';
    document.getElementById('candidate-state').dataset.state = '';
}

function columnsLabel(count) {
    return `${count} ${count === 1 ? 'colonne' : 'colonnes'}`;
}

function rowsLabel(count) {
    return `${count} ${count === 1 ? 'ligne' : 'lignes'}`;
}

function rectMatches(target, actual) {
    return Math.abs(target.x - actual.x) < 1 && Math.abs(target.y - actual.y) < 1 &&
        Math.abs(target.width - actual.width) < 1 && Math.abs(target.height - actual.height) < 1;
}

function gridsMatch() {
    const targetStyle = getComputedStyle(targetGrid);
    const actualStyle = getComputedStyle(candidateGrid);
    if (actualStyle.display !== 'grid' ||
        actualStyle.gridTemplateColumns !== targetStyle.gridTemplateColumns ||
        actualStyle.gridTemplateRows !== targetStyle.gridTemplateRows ||
        actualStyle.gap !== targetStyle.gap) return false;

    if (challenge.areas && actualStyle.gridTemplateAreas !== targetStyle.gridTemplateAreas) return false;

    const targetOrigin = targetGrid.getBoundingClientRect();
    const candidateOrigin = candidateGrid.getBoundingClientRect();
    return challenge.pieces.every(piece => {
        const target = document.getElementById(`target-piece-${piece.id}`).getBoundingClientRect();
        const actual = document.getElementById(`piece-${piece.id}`).getBoundingClientRect();
        return rectMatches(
            { x: target.x - targetOrigin.x, y: target.y - targetOrigin.y, width: target.width, height: target.height },
            { x: actual.x - candidateOrigin.x, y: actual.y - candidateOrigin.y, width: actual.width, height: actual.height }
        );
    });
}

function verifyChallenge() {
    userStyle.textContent = codeInput.value;
    if (!gridsMatch()) {
        feedback.textContent = 'La grille ne correspond pas encore à la cible. Vérifie les pistes, l’espacement et le placement.';
        feedback.style.color = '#a73e2e';
        document.getElementById('candidate-state').textContent = 'À AJUSTER';
        document.getElementById('candidate-state').dataset.state = 'error';
        return;
    }

    if (!solved) {
        score++;
        solved = true;
        bestScore = Math.max(bestScore, score);
        updateScore();
    }
    feedback.textContent = 'Grille validée : +1 point. Une nouvelle cible est prête.';
    feedback.style.color = '#356e54';
    document.getElementById('candidate-state').textContent = 'VALIDÉE';
    document.getElementById('candidate-state').dataset.state = 'success';
    checkButton.disabled = true;
    nextButton.hidden = false;
}

codeInput.addEventListener('input', () => {
    userStyle.textContent = codeInput.value;
    if (!solved) {
        document.getElementById('candidate-state').textContent = 'APERÇU';
        document.getElementById('candidate-state').dataset.state = '';
        feedback.textContent = '';
    }
});
checkButton.addEventListener('click', verifyChallenge);
nextButton.addEventListener('click', startChallenge);
new ResizeObserver(renderLineMarkers).observe(targetGrid);

startChallenge();
updateScore();