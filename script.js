// ---------------------
//   NIVEAUX
// ---------------------
const GAME_PREFIX = "mq";
const box = document.getElementById("box");

const levels = [
    {
        text: "Niveau 1 : Quand l'écran fait moins de 600px → Le carré doit devenir bleu.",
        validate: () => getComputedStyle(box).backgroundColor === "rgb(0, 0, 255)",
        expected: ["max-width: 600px"]
    },

    {
        text: "Niveau 2 : Quand l'écran fait plus de 800px → Le carré doit mesurer 300px.",
        validate: () => box.offsetWidth === 300,
        expected: ["min-width: 801px"]
    },

    {
        text: "Niveau 3 : Entre 500px et 900px → Le carré doit devenir un cercle.",
        validate: () => getComputedStyle(box).borderRadius.includes("50%"),
        expected: ["min-width: 500px", "max-width: 900px"]
    },

    {
        text: "Niveau 4 : Quand l'écran fait moins de 400px → Le carré doit disparaître.",
        validate: () => getComputedStyle(box).display === "none",
        expected: ["max-width: 400px"]
    },

    {
        text: "Niveau 5 : Quand l'écran fait plus de 1000px → carré vert + largeur 400px.",
        validate: () =>
            getComputedStyle(box).backgroundColor === "rgb(0, 128, 0)" &&
            box.offsetWidth === 400,
        expected: ["min-width: 1001px"]
    },

    {
        text: "Niveau 6 : Moins de 700px → carré = 100px.",
        validate: () => box.offsetWidth === 100,
        expected: ["max-width: 700px"]
    },

    {
        text: "Niveau 7 : Entre 600px et 900px → carré jaune.",
        validate: () => getComputedStyle(box).backgroundColor === "rgb(255, 255, 0)",
        expected: ["min-width: 600px", "max-width: 900px"]
    },

    {
        text: "Niveau 8 : Plus de 900px → bordure noire 5px.",
        validate: () => getComputedStyle(box).borderWidth === "5px",
        expected: ["min-width: 901px"]
    },

    {
        text: "Niveau 9 : Moins de 500px → opacité 50%.",
        validate: () => getComputedStyle(box).opacity === "0.5",
        expected: ["max-width: 500px"]
    },

    {
        text: "Niveau 10 : Plus de 1100px → rotation 45°.",
        validate: () => {
            const t = getComputedStyle(box).transform;
            if (!t || t === "none") return false;
            // matrix(a, b, c, d, tx, ty)
            const match = t.match(/^matrix\(([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)\)$/);
            if (!match) return false;
            const a = parseFloat(match[1]);
            const b = parseFloat(match[2]);
            // angle in radians: Math.atan2(b, a)
            const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
            return Math.abs(angle) === 45;
        },
        expected: ["min-width: 1101px"]
    },

    {
        text: "Niveau 11 : Moins de 550px → rectangle (300x120).",
        validate: () => box.offsetWidth === 300 && box.offsetHeight === 120,
        expected: ["max-width: 550px"]
    },

    {
        text: "Niveau 12 : Entre 700px et 1200px → carré blanc.",
        validate: () => getComputedStyle(box).backgroundColor === "rgb(255, 255, 255)",
        expected: ["min-width: 700px", "max-width: 1200px"]
    },

    {
        text: "Niveau 13 : Plus de 1300px → margin-top 50px.",
        validate: () => getComputedStyle(box).marginTop === "50px",
        expected: ["min-width: 1301px"]
    },

    {
        text: "Niveau 14 : Moins de 500px → ombre portée.",
        validate: () => getComputedStyle(box).boxShadow !== "none",
        expected: ["max-width: 500px"]
    },

    {
        text: "Niveau 15 : Plus de 1000px → ovale.",
        validate: () => getComputedStyle(box).borderRadius.includes("50px"),
        expected: ["min-width: 1001px"]
    }
    ,
    {
        text: "Niveau 16 : Plus de 1400px → largeur 450px.",
        validate: () => box.offsetWidth === 450,
        expected: ["min-width: 1401px"]
    },
    {
        text: "Niveau 17 : Moins de 350px → le carré doit disparaître.",
        validate: () => getComputedStyle(box).display === "none",
        expected: ["max-width: 350px"]
    },
    {
        text: "Niveau 18 : Entre 800px et 1000px → fond purple.",
        validate: () => getComputedStyle(box).backgroundColor === "rgb(128, 0, 128)",
        expected: ["min-width: 800px", "max-width: 1000px"]
    },
    {
        text: "Niveau 19 : Plus de 900px → opacité 80%.",
        validate: () => getComputedStyle(box).opacity === "0.8",
        expected: ["min-width: 901px"]
    },
    {
        text: "Niveau 20 : Plus de 1500px → margin-left = 30px.",
        validate: () => getComputedStyle(box).marginLeft === "30px",
        expected: ["min-width: 1501px"]
    },
    {
        text: "Niveau 21 : Entre 600px et 700px → fond orange.",
        validate: () => getComputedStyle(box).backgroundColor === "rgb(255, 165, 0)",
        expected: ["min-width: 600px", "max-width: 700px"]
    },
    {
        text: "Niveau 22 : Moins de 480px → ombre portée.",
        validate: () => getComputedStyle(box).boxShadow !== "none",
        expected: ["max-width: 480px"]
    },
    {
        text: "Niveau 23 : Plus de 1200px → largeur 500px et hauteur 200px.",
        validate: () => box.offsetWidth === 500 && box.offsetHeight === 200,
        expected: ["min-width: 1201px"]
    },
    {
        text: "Niveau 24 : Entre 400px et 600px → bordure dashed 2px.",
        validate: () => getComputedStyle(box).borderStyle === "dashed" && getComputedStyle(box).borderWidth === "2px",
        expected: ["min-width: 400px", "max-width: 600px"]
    },
    {
        text: "Niveau 25 : Moins de 200px → opacité 30%.",
        validate: () => getComputedStyle(box).opacity === "0.3",
        expected: ["max-width: 200px"]
    },
    {
        text: "Niveau 26 : Plus de 1700px → scale 1.5.",
        validate: () => {
            const t = getComputedStyle(box).transform;
            if (!t || t === "none") return false;
            // handle 2D matrix(a, b, c, d, tx, ty)
            const m2 = t.match(/^matrix\(([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)\)$/);
            if (m2) {
                const a = parseFloat(m2[1]);
                const b = parseFloat(m2[2]);
                const c = parseFloat(m2[3]);
                const d = parseFloat(m2[4]);
                const scaleX = Math.hypot(a, b);
                const scaleY = Math.hypot(c, d);
                return Math.abs(scaleX - 1.5) < 0.03 && Math.abs(scaleY - 1.5) < 0.03;
            }
            // handle 3D matrix3d(...) where scaleX ~ matrix3d[0], scaleY ~ matrix3d[5]
            const m3 = t.match(/^matrix3d\(([^)]+)\)$/);
            if (m3) {
                const parts = m3[1].split(',').map(s => parseFloat(s.trim()));
                if (parts.length >= 16) {
                    const a = parts[0];
                    const b = parts[1];
                    const c = parts[4];
                    const d = parts[5];
                    const scaleX = Math.hypot(a, b);
                    const scaleY = Math.hypot(c, d);
                    return Math.abs(scaleX - 1.5) < 0.03 && Math.abs(scaleY - 1.5) < 0.03;
                }
            }
            return false;
        },
        expected: ["min-width: 1701px"]
    },
    {
        text: "Niveau 27 : Entre 100px et 400px → border-radius 15px.",
        validate: () => getComputedStyle(box).borderRadius.includes("15px"),
        expected: ["min-width: 100px", "max-width: 400px"]
    },
    {
        text: "Niveau 28 : Plus de 2000px → fond cyan.",
        validate: () => getComputedStyle(box).backgroundColor === "rgb(0, 255, 255)",
        expected: ["min-width: 2001px"]
    },
    {
        text: "Niveau 29 : Entre 900px et 950px → largeur 220px.",
        validate: () => box.offsetWidth === 220,
        expected: ["min-width: 900px", "max-width: 950px"]
    },
    {
        text: "Niveau 30 : Plus de 1600px → rotation -30°.",
        validate: () => {
            const t = getComputedStyle(box).transform;
            if (!t || t === "none") return false;
            const match = t.match(/^matrix\(([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)\)$/);
            if (!match) return false;
            const a = parseFloat(match[1]);
            const b = parseFloat(match[2]);
            const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
            return Math.abs(angle) === 30;
        },
        expected: ["min-width: 1601px"]
    }
];

// helper: check expected substrings presence (case-insensitive)
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
// Sauvegarde/restaure la progression
function saveProgress() {
    localStorage.setItem('mq_progress', JSON.stringify({
        currentLevel,
        score
    }));
}

function loadProgress() {
    try {
        const data = JSON.parse(localStorage.getItem('mq_progress'));
        if (data && typeof data.currentLevel === 'number' && typeof data.score === 'number') {
            return data;
        }
    } catch (e) {
        console.error('Erreur lors du chargement de la progression:', e);
    }
    return null;
}

let currentLevel = 0;
let score = 0;

// restauration au chargement
const progress = loadProgress();
if (progress) {
    currentLevel = progress.currentLevel;
    score = progress.score;
}

const levelText = document.getElementById("level-text");
const codeInput = document.getElementById("code-input");
const statusDiv = document.getElementById("status");
const nextBtn = document.getElementById("next-level");
const gameEnd = document.getElementById("game-end");
const levelCounter = document.getElementById('level-counter');
const levelList = document.getElementById('level-list');

const scoreDisplay = document.getElementById('score-display');

levelText.textContent = levels[currentLevel].text;
// afficher le compteur initial
function updateLevelCounter() {
    if (!levelCounter) return;
    levelCounter.textContent = `Niveau ${currentLevel + 1} / ${levels.length}`;
    levelCounter.style.display = '';
    updateLevelList();
}

function updateScoreDisplay() {
    if (!scoreDisplay) return;
    scoreDisplay.textContent = `Points: ${score}`;
}

// mettre à jour l'affichage du score après initialisation des éléments DOM
updateScoreDisplay();

// Liste des niveaux réussis (sauvegardée avec la progression)
function getDoneLevels() {
    try {
        return JSON.parse(localStorage.getItem('mq_done_levels')) || [];
    } catch (e) {
        console.error('Erreur lors du chargement des niveaux réussis:', e);
        return [];
    }
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

function setDoneLevels(done) {
    try {
        localStorage.setItem('mq_done_levels', JSON.stringify(done));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde des niveaux réussis:', e);
    }
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

updateLevelCounter();

// ---------------------
// TEST DU NIVEAU
// ---------------------
const testBtn = document.getElementById("test-btn");
if (testBtn) {
    testBtn.onclick = () => {
        if (!codeInput || !box || !statusDiv || !nextBtn) {
            console.error('Éléments DOM manquants pour le test');
            return;
        }

        try {
            const css = getOrCreateStyleElement('mq-user-style');
            css.textContent = codeInput.value;
            saveLevelCode(currentLevel, codeInput.value.trim());

            waitForReflow(box, () => {
                if (currentLevel >= levels.length || !levels[currentLevel]) {
                    console.error('Niveau invalide:', currentLevel);
                    return;
                }

                const effectOk = levels[currentLevel].validate();
                const expectedCheck = checkExpectedForLevel(currentLevel);

                if (effectOk && expectedCheck.ok) {
                    // marquer le niveau comme fait et n'ajouter au score qu'une seule fois
                    const doneLevels = getDoneLevels();
                    const alreadyDone = doneLevels.includes(currentLevel);
                    if (!alreadyDone) {
                        score++;
                        doneLevels.push(currentLevel);
                        setDoneLevels(doneLevels);
                        saveProgress();
                    }

                    statusDiv.textContent = alreadyDone ? "Déjà réussi" : "Réussi";
                    statusDiv.style.color = "green";
                    nextBtn.style.display = "block";
                    updateLevelList();
                    updateScoreDisplay();
                } else if (effectOk && !expectedCheck.ok) {
                    // effet présent mais media query manquante
                    const missingText = expectedCheck.missing.join(', ');
                    showToast(`Effet OK mais il manque la media query attendue: ${missingText}`, 'error', 5000);
                    statusDiv.textContent = `Incorrect — media query manquante: ${missingText}`;
                    statusDiv.style.color = 'orange';
                } else {
                    statusDiv.textContent = "Incorrect";
                    statusDiv.style.color = "red";
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
        currentLevel++;
        saveProgress();
        if (currentLevel >= levels.length) {
            endGame();
            return;
        }
        if (levelText) levelText.textContent = levels[currentLevel].text;
        if (codeInput) codeInput.value = loadLevelCode(currentLevel);
        if (statusDiv) statusDiv.innerHTML = "";
        nextBtn.style.display = "none";
        updateLevelCounter();
    };
}

// ---------------------
// FIN DE PARTIE
// ---------------------
function endGame() {
    const finalScoreEl = document.getElementById("final-score");
    if (finalScoreEl) {
        finalScoreEl.textContent = `Score : ${score} / ${levels.length}`;
    }

    // save score without time
    saveScore(score);
    updateScoreboard();

    // reset progression sauvegardée
    try {
        localStorage.removeItem('mq_progress');
    } catch (e) {
        console.error('Erreur lors de la suppression de la progression:', e);
    }

    if (gameEnd) gameEnd.style.display = "block";
    if (codeInput) codeInput.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    if (levelText) levelText.textContent = "Jeu terminé";
    if (levelCounter) levelCounter.style.display = 'none';
}

// ---------------------
// SCOREBOARD LOCAL
// ---------------------

function saveScore(score) {
    const name = prompt("Ton nom pour le classement ?") || "Anonyme";

    const entry = { name, score };

    let list = [];

    try {
        list = JSON.parse(localStorage.getItem("mq_scores")) || [];
    } catch (e) {
        console.error('Erreur lors de la lecture du scoreboard:', e);
        list = []; // si JSON cassé
    }

    try {
        list.push(entry);
        localStorage.setItem("mq_scores", JSON.stringify(list));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde du score:', e);
        showToast('Erreur lors de la sauvegarde du score', 'error');
    }
}

// Mise à jour visuelle
function updateScoreboard() {
    let list = [];
    try {
        list = JSON.parse(localStorage.getItem("mq_scores") || "[]");
    } catch (e) {
        console.error("Erreur lors de la lecture du scoreboard:", e);
        return;
    }

    list.sort((a, b) => b.score - a.score);

    const tbody = document.getElementById("scoreboard-body");
    if (!tbody) return;

    // Optimisation : construire le HTML en une seule fois au lieu d'utiliser +=
    const rowsHtml = list.map(row => `
        <tr>
            <td>${escapeHtml(row.name)}</td>
            <td>${row.score}</td>
        </tr>
    `).join('');

    tbody.innerHTML = rowsHtml;
}

/**
 * Échappe les caractères HTML pour éviter les injections XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

updateScoreboard();

// ---------------------
// REJOUER
// ---------------------
const restartBtn = document.getElementById("restart-btn");
if (restartBtn) {
    restartBtn.onclick = () => {
        try {
            localStorage.removeItem('mq_progress');
            localStorage.removeItem('mq_done_levels');
        } catch (e) {
            console.error('Erreur lors de la réinitialisation:', e);
        }
        location.reload();
    };
}

// ---------------------
// RECHARGER CSS EXTERNE
// ---------------------
// Les fonctions utilitaires sont maintenant dans utils.js

const reloadCssBtn = document.getElementById('reload-css-btn');
if (reloadCssBtn) {
    // maintenant, le bouton recharge le CSS contenu dans le textarea `code-input`
    reloadCssBtn.onclick = () => {
        try {
            if (!codeInput) {
                showToast('Erreur : zone de code introuvable', 'error');
                return;
            }
            const css = getOrCreateStyleElement('mq-user-style');
            css.textContent = codeInput.value;

            waitForReflow(box, () => {
                showToast('CSS appliqué depuis la zone de code', 'success');
            });
        } catch (err) {
            showToast('Erreur : impossible d\'appliquer le CSS', 'error');
            console.error(err);
        }
    };
}