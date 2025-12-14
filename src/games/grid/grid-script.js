// Grid-based game — 30 niveaux
const GAME_PREFIX = "grid";
const grid = document.getElementById('grid');

// Helper pour obtenir les cartes
function cards() {
    return Array.from(grid.querySelectorAll('.card'));
}

function saveLevelCode(levelIndex, code) {
    try {
        const codes = JSON.parse(localStorage.getItem(GAME_PREFIX + '_level_codes') || '{}');
        codes[levelIndex] = code;
        localStorage.setItem(GAME_PREFIX + '_level_codes', JSON.stringify(codes));
    } catch (e) { console.error(e); }
}

function loadLevelCode(levelIndex) {
    try {
        const codes = JSON.parse(localStorage.getItem(GAME_PREFIX + '_level_codes') || '{}');
        return codes[levelIndex] || '';
    } catch (e) {
        console.error(e);
        return '';
    }
}

const levels = [
    {
        text: 'Niveau 1 : < 480px → 1 colonne.',
        validate: () => getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length === 1,
        expected: ['max-width: 480px']
    },
    {
        text: 'Niveau 2 : ≥ 481px → 2 colonnes.',
        validate: () => getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length === 2,
        expected: ['min-width: 481px']
    },
    {
        text: 'Niveau 3 : ≥ 768px → 3 colonnes.',
        validate: () => getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length === 3,
        expected: ['min-width: 768px']
    },
    {
        text: 'Niveau 4 : ≥ 1024px → 4 colonnes.',
        validate: () => getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length === 4,
        expected: ['min-width: 1024px']
    },
    {
        text: 'Niveau 5 : ≥ 900px → gap = 24px.',
        validate: () => getComputedStyle(grid).columnGap.includes('24px'),
        expected: ['min-width: 900px']
    },
    {
        text: 'Niveau 6 : 600–900px → items centrés (justify-items:center).',
        validate: () => getComputedStyle(grid).justifyItems === 'center',
        expected: ['min-width: 600px', 'max-width: 900px']
    },
    {
        text: 'Niveau 7 : ≥ 1100px → premier élément span 2 colonnes.',
        validate: () => {
            const c = cards();
            if (!c.length) return false;
            const rects = c.map(el => el.getBoundingClientRect());
            const avg = rects.reduce((s, r) => s + r.width, 0) / rects.length;
            return rects[0].width > avg * 1.6;
        },
        expected: ['min-width: 1100px']
    },
    {
        text: 'Niveau 8 : < 400px → items empilés (grid-auto-flow: row).',
        validate: () => getComputedStyle(grid).gridAutoFlow.includes('row'),
        expected: ['max-width: 400px']
    },
    {
        text: 'Niveau 9 : ≥ 1000px → grid-auto-rows présent (rows > 0).',
        validate: () => {
            const v = getComputedStyle(grid).gridAutoRows;
            return v && v !== 'auto';
        },
        expected: ['min-width: 1000px']
    },
    {
        text: 'Niveau 10 : 700–900px → align-content: start.',
        validate: () => getComputedStyle(grid).alignContent === 'start',
        expected: ['min-width: 700px', 'max-width: 900px']
    },
    {
        text: 'Niveau 11 : ≥ 1500px → max-width du conteneur appliqué.',
        validate: () => {
            const v = getComputedStyle(grid).maxWidth;
            return v && v !== 'none' && v !== '0px';
        },
        expected: ['min-width: 1500px']
    },
    {
        text: 'Niveau 12 : < 320px → cacher les images dans les cartes.',
        validate: () => cards().every(c => {
            const img = c.querySelector('img');
            return !img || getComputedStyle(img).display === 'none';
        }),
        expected: ['max-width: 320px']
    },
    {
        text: 'Niveau 13 : ≥ 1700px → gap augmenté et scale des items.',
        validate: () => getComputedStyle(grid).columnGap && parseFloat(getComputedStyle(grid).columnGap) >= 28,
        expected: ['min-width: 1700px']
    },
    {
        text: 'Niveau 14 : 900–1100px → columns minmax(200px,1fr).',
        validate: () => {
            // Vérifie la présence de minmax dans le code source via expected string
            // Pour la vérification visuelle, s'assure qu'il y a au moins 1 colonne
            return getComputedStyle(grid).gridTemplateColumns.split(' ').length >= 1;
        },
        expected: ['min-width: 900px', 'max-width: 1100px', 'minmax']
    },
    {
        text: 'Niveau 15 : ≥ 2000px → 6 colonnes.',
        validate: () => getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length >= 6,
        expected: ['min-width: 2000px']
    },
    {
        text: 'Niveau 16 : ≥ 1600px → grid-template-areas réarrangée.',
        validate: () => getComputedStyle(grid).gridTemplateAreas && getComputedStyle(grid).gridTemplateAreas !== 'none',
        expected: ['min-width: 1600px']
    },
    {
        text: 'Niveau 17 : 480–600px → n afficher que 3 éléments visibles.',
        validate: () => cards().filter(c => c.offsetParent !== null).length <= 3,
        expected: ['min-width: 480px', 'max-width: 600px']
    },
    {
        text: 'Niveau 18 : ≥ 800px → grid-auto-flow: column.',
        validate: () => getComputedStyle(grid).gridAutoFlow.includes('column'),
        expected: ['min-width: 800px']
    },
    {
        text: 'Niveau 19 : ≥ 1250px → gap = 32px.',
        validate: () => getComputedStyle(grid).columnGap.includes('32px'),
        expected: ['min-width: 1250px']
    },
    {
        text: 'Niveau 20 : < 360px → réduire la taille de police des cartes.',
        validate: () => parseFloat(getComputedStyle(cards()[0]).fontSize) <= 13,
        expected: ['max-width: 360px']
    },
    {
        text: 'Niveau 21 : 1000–1300px → colonnes 2fr 1fr.',
        validate: () => getComputedStyle(grid).gridTemplateColumns.split(' ')[0].includes('2fr'),
        expected: ['min-width: 1000px', 'max-width: 1300px']
    },
    {
        text: 'Niveau 22 : ≥ 2100px → 7 colonnes.',
        validate: () => getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length >= 7,
        expected: ['min-width: 2100px']
    },
    {
        text: 'Niveau 23 : ≥ 1550px → premiers items occupent 2 lignes (grid-row span).',
        validate: () => {
            const rects = cards().map(c => c.getBoundingClientRect());
            const avgH = rects.reduce((s, r) => s + r.height, 0) / rects.length;
            return rects[0].height > avgH * 1.8 || rects[1].height > avgH * 1.8;
        },
        expected: ['min-width: 1550px']
    },
    {
        text: 'Niveau 24 : ≥ 1700px → 5 colonnes (repeat(5,1fr)).',
        validate: () => getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length === 5,
        expected: ['min-width: 1700px']
    }
];

// Helper pour vérifier les sous-chaînes attendues
function checkExpectedForLevel(levelIndex) {
    const lvl = levels[levelIndex];
    const code = (codeInput && codeInput.value) ? codeInput.value.toLowerCase() : '';
    if (!lvl.expected || !lvl.expected.length) return { ok: true, missing: [] };
    const missing = lvl.expected.filter(s => !code.includes(s.toLowerCase()));
    return { ok: missing.length === 0, missing };
}

// ---------------------
// VARIABLES & INIT
// ---------------------
let currentLevel = 0;
let score = 0;

const levelText = document.getElementById('level-text');
const codeInput = document.getElementById('code-input');
const statusDiv = document.getElementById('status');
const nextBtn = document.getElementById('next-level');
const levelCounter = document.getElementById('level-counter');
const levelList = document.getElementById('level-list');
const scoreDisplay = document.getElementById('score-display');

// Sauvegarde/restaure la progression
function saveProgress() {
    try {
        localStorage.setItem('grid_progress', JSON.stringify({
            currentLevel,
            score
        }));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde de la progression:', e);
    }
}

function loadProgress() {
    try {
        const data = JSON.parse(localStorage.getItem('grid_progress'));
        if (data && typeof data.currentLevel === 'number' && typeof data.score === 'number') {
            return data;
        }
    } catch (e) {
        console.error('Erreur lors du chargement de la progression:', e);
    }
    return null;
}

// Restauration au chargement
const progress = loadProgress();
if (progress) {
    currentLevel = progress.currentLevel;
    score = progress.score;
}

// Liste des niveaux réussis
function getDoneLevels() {
    try {
        return JSON.parse(localStorage.getItem('grid_done')) || [];
    } catch (e) {
        console.error('Erreur lors du chargement des niveaux réussis:', e);
        return [];
    }
}

function setDoneLevels(done) {
    try {
        localStorage.setItem('grid_done', JSON.stringify(done));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde des niveaux réussis:', e);
    }
}

function updateLevelCounter() {
    if (!levelCounter) return;
    levelCounter.textContent = `Niveau ${currentLevel + 1} / ${levels.length}`;
    updateLevelList();
}

function updateScoreDisplay() {
    if (!scoreDisplay) return;
    scoreDisplay.textContent = `Points: ${score}`;
}

function updateLevelList() {
    if (!levelList) return;
    const doneLevels = getDoneLevels();
    levelList.innerHTML = '';
    
    levels.forEach((lvl, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'level-btn';
        btn.textContent = `Niveau ${i + 1}`;
        
        if (doneLevels.includes(i)) btn.classList.add('done');
        if (i === currentLevel) btn.classList.add('selected');
        
        btn.onclick = () => {
            currentLevel = i;
            levelText.textContent = levels[currentLevel].text;
            codeInput.value = loadLevelCode(currentLevel);
            statusDiv.innerHTML = '';
            nextBtn.style.display = 'none';
            updateLevelCounter();
            saveProgress();
        };
        
        levelList.appendChild(btn);
    });
}

// Initialisation
if (levelText) levelText.textContent = levels[currentLevel].text;
updateLevelCounter();
updateScoreDisplay();

// ---------------------
// TEST DU NIVEAU
// ---------------------
const testBtn = document.getElementById('test-btn');
if (testBtn) {
    testBtn.onclick = () => {
        if (!codeInput || !grid || !statusDiv || !nextBtn) {
            console.error('Éléments DOM manquants pour le test');
            return;
        }

        try {
            const css = getOrCreateStyleElement('mq-user-style-grid');
            css.textContent = codeInput.value;
            saveLevelCode(currentLevel, codeInput.value.trim());

            waitForReflow(grid, () => {
                if (currentLevel >= levels.length || !levels[currentLevel]) {
                    console.error('Niveau invalide:', currentLevel);
                    return;
                }

                const effectOk = levels[currentLevel].validate();
                const expectedCheck = checkExpectedForLevel(currentLevel);

                if (effectOk && expectedCheck.ok) {
                    const doneLevels = getDoneLevels();
                    const alreadyDone = doneLevels.includes(currentLevel);
                    
                    if (!alreadyDone) {
                        score++;
                        doneLevels.push(currentLevel);
                        setDoneLevels(doneLevels);
                        saveProgress();
                    }

                    statusDiv.textContent = alreadyDone ? 'Déjà réussi' : 'Réussi';
                    statusDiv.style.color = 'green';
                    nextBtn.style.display = 'block';
                    updateLevelList();
                    updateScoreDisplay();
                } else if (effectOk && !expectedCheck.ok) {
                    const missingText = expectedCheck.missing.join(', ');
                    showToast('Effet OK mais media query manquante: ' + missingText, 'error', 4500);
                    statusDiv.textContent = 'Incorrect — media query manquante';
                    statusDiv.style.color = 'orange';
                } else {
                    statusDiv.textContent = 'Incorrect';
                    statusDiv.style.color = 'red';
                }
            });
        } catch (err) {
            console.error('Erreur lors du test:', err);
            showToast('Erreur lors du test', 'error');
        }
    };
}

// ---------------------
// PASSER AU NIVEAU SUIVANT
// ---------------------
if (nextBtn) {
    nextBtn.onclick = () => {
        saveLevelCode(currentLevel, codeInput.value.trim());
        currentLevel++;
        saveProgress();
        
        if (currentLevel >= levels.length) {
            const finalScore = document.getElementById('final-score');
            const gameEnd = document.getElementById('game-end');
            
            if (finalScore) finalScore.textContent = `Score : ${score} / ${levels.length}`;
            if (gameEnd) gameEnd.style.display = 'block';
            if (codeInput) codeInput.style.display = 'none';
            nextBtn.style.display = 'none';
            if (levelText) levelText.textContent = 'Jeu terminé';
            return;
        }
        
        if (levelText) levelText.textContent = levels[currentLevel].text;
        if (codeInput) codeInput.value = '';
        if (statusDiv) statusDiv.innerHTML = '';
        nextBtn.style.display = 'none';
        updateLevelCounter();
    };
}

// ---------------------
// RECHARGER CSS EXTERNE
// ---------------------
const reloadCssBtn = document.getElementById('reload-css-btn');
if (reloadCssBtn) {
    reloadCssBtn.onclick = () => {
        try {
            if (!codeInput) {
                showToast('Erreur : zone de code introuvable', 'error');
                return;
            }
            const css = getOrCreateStyleElement('mq-user-style-grid');
            css.textContent = codeInput.value;

            waitForReflow(grid, () => {
                showToast('CSS appliqué', 'success', 1500);
            });
        } catch (e) {
            showToast('Erreur : impossible d\'appliquer le CSS', 'error', 2000);
            console.error(e);
        }
    };
}
