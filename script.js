// ---------------------
//   NIVEAUX
// ---------------------
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
    } catch {}
    return null;
}

let currentLevel = 0;
let score = 0;
let startTime = Date.now();

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

levelText.textContent = levels[currentLevel].text;
// afficher le compteur initial
function updateLevelCounter() {
    if (!levelCounter) return;
    levelCounter.textContent = `Niveau ${currentLevel + 1} / ${levels.length}`;
    levelCounter.style.display = '';
}

updateLevelCounter();

// ---------------------
// TEST DU NIVEAU
// ---------------------
document.getElementById("test-btn").onclick = () => {
    // reuse a single <style> element so we don't keep appending many tags
    let css = document.getElementById('mq-user-style');
    if (!css) {
        css = document.createElement('style');
        css.id = 'mq-user-style';
        document.head.appendChild(css);
    }
    css.textContent = codeInput.value;

    // force reflow so computed styles are up-to-date
    void box.offsetWidth;

    // wait two frames to ensure styles applied before validating
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {

            const effectOk = levels[currentLevel].validate();
            const expectedCheck = checkExpectedForLevel(currentLevel);

            if (effectOk && expectedCheck.ok) {
                score++;
                statusDiv.textContent = "Réussi";
                statusDiv.style.color = "green";
                nextBtn.style.display = "block";
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
    });
};

// ---------------------
// PASSER AU NIVEAU SUIVANT
// ---------------------
nextBtn.onclick = () => {
    currentLevel++;
    saveProgress();
    if (currentLevel >= levels.length) {
        endGame();
        return;
    }
    levelText.textContent = levels[currentLevel].text;
    codeInput.value = "";
    statusDiv.innerHTML = "";
    nextBtn.style.display = "none";
    updateLevelCounter();
};

// ---------------------
// FIN DE PARTIE
// ---------------------
function endGame() {
    const totalTime = Math.round((Date.now() - startTime) / 1000);

    document.getElementById("final-score").textContent =
        `Score : ${score} / ${levels.length}`;

    document.getElementById("final-time").textContent =
        `Temps total : ${totalTime} sec`;

    saveScore(score, totalTime);
    updateScoreboard();

    // reset progression sauvegardée
    localStorage.removeItem('mq_progress');

    gameEnd.style.display = "block";
    codeInput.style.display = "none";
    nextBtn.style.display = "none";
    levelText.textContent = "Jeu terminé";
    if (levelCounter) levelCounter.style.display = 'none';
}

// ---------------------
// SCOREBOARD LOCAL
// ---------------------
function saveScore(score, time) {
    const name = prompt("Ton nom pour le classement ?") || "Anonyme";

    const entry = { name, score, time };

    let list = [];

    try {
        list = JSON.parse(localStorage.getItem("mq_scores")) || [];
    } catch {
        list = []; // si JSON cassé
    }

    list.push(entry);
    localStorage.setItem("mq_scores", JSON.stringify(list));
}

// Mise à jour visuelle
function updateScoreboard() {
    let list = JSON.parse(localStorage.getItem("mq_scores") || "[]");

    list.sort((a, b) => b.score - a.score || a.time - b.time);

    const tbody = document.getElementById("scoreboard-body");

    tbody.innerHTML = "";

    list.forEach(row => {
        tbody.innerHTML += `
            <tr>
                <td>${row.name}</td>
                <td>${row.score}</td>
                <td>${row.time}s</td>
            </tr>
        `;
    });
}

updateScoreboard();

// ---------------------
// REJOUER
// ---------------------
document.getElementById("restart-btn").onclick = () => {
    localStorage.removeItem('mq_progress');
    location.reload();
};

// ---------------------
// RECHARGER CSS EXTERNE
// ---------------------
// simple toast notification helper
function showToast(message, type = 'info', duration = 3000) {
    const t = document.createElement('div');
    t.className = `toast toast--${type}`;
    t.textContent = message;
    document.body.appendChild(t);

    // force reflow then show
    requestAnimationFrame(() => t.classList.add('show'));

    setTimeout(() => {
        t.classList.remove('show');
        // remove after transition
        setTimeout(() => t.remove(), 220);
    }, duration);
}

const reloadCssBtn = document.getElementById('reload-css-btn');
if (reloadCssBtn) {
    // maintenant, le bouton recharge le CSS contenu dans le textarea `code-input`
    reloadCssBtn.onclick = () => {
        try {
            const text = codeInput.value;

            let css = document.getElementById('mq-user-style');
            if (!css) {
                css = document.createElement('style');
                css.id = 'mq-user-style';
                document.head.appendChild(css);
            }
            css.textContent = text;

            // force reflow et attendre deux frames (comme pour le test)
            void box.offsetWidth;
            requestAnimationFrame(() => requestAnimationFrame(() => {
                showToast('CSS appliqué depuis la zone de code', 'success');
            }));

        } catch (err) {
            showToast('Erreur : impossible d\'appliquer le CSS', 'error');
            console.error(err);
        }
    };
}