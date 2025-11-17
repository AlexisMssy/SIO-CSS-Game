// ---------------------
//   NIVEAUX
// ---------------------
const box = document.getElementById("box");

const levels = [
    {
        text: "Niveau 1 : Quand l'écran fait moins de 600px → Le carré doit devenir bleu.",
        validate: () => getComputedStyle(box).backgroundColor === "rgb(0, 0, 255)"
    },

    {
        text: "Niveau 2 : Quand l'écran fait plus de 800px → Le carré doit mesurer 300px.",
        validate: () => box.offsetWidth === 300
    },

    {
        text: "Niveau 3 : Entre 500px et 900px → Le carré doit devenir un cercle.",
        validate: () => getComputedStyle(box).borderRadius.includes("50%")
    },

    {
        text: "Niveau 4 : Quand l'écran fait moins de 400px → Le carré doit disparaître.",
        validate: () => getComputedStyle(box).display === "none"
    },

    {
        text: "Niveau 5 : Quand l'écran fait plus de 1000px → carré vert + largeur 400px.",
        validate: () =>
            getComputedStyle(box).backgroundColor === "rgb(0, 128, 0)" &&
            box.offsetWidth === 400
    },

    {
        text: "Niveau 6 : Moins de 700px → carré = 100px.",
        validate: () => box.offsetWidth === 100
    },

    {
        text: "Niveau 7 : Entre 600px et 900px → carré jaune.",
        validate: () => getComputedStyle(box).backgroundColor === "rgb(255, 255, 0)"
    },

    {
        text: "Niveau 8 : Plus de 900px → bordure noire 5px.",
        validate: () => getComputedStyle(box).borderWidth === "5px"
    },

    {
        text: "Niveau 9 : Moins de 500px → opacité 50%.",
        validate: () => getComputedStyle(box).opacity === "0.5"
    },

    {
        text: "Niveau 10 : Plus de 1100px → rotation 45°.",
        validate: () => getComputedStyle(box).transform.includes("45deg")
    },

    {
        text: "Niveau 11 : Moins de 550px → rectangle (300x120).",
        validate: () => box.offsetWidth === 300 && box.offsetHeight === 120
    },

    {
        text: "Niveau 12 : Entre 700px et 1200px → carré blanc.",
        validate: () => getComputedStyle(box).backgroundColor === "rgb(255, 255, 255)"
    },

    {
        text: "Niveau 13 : Plus de 1300px → margin-top 50px.",
        validate: () => getComputedStyle(box).marginTop === "50px"
    },

    {
        text: "Niveau 14 : Moins de 500px → ombre portée.",
        validate: () => getComputedStyle(box).boxShadow !== "none"
    },

    {
        text: "Niveau 15 : Plus de 1000px → ovale.",
        validate: () => getComputedStyle(box).borderRadius.includes("50px")
    }
];

// ---------------------
// VARIABLES & INIT
// ---------------------
let currentLevel = 0;
let score = 0;
let startTime = Date.now();

const levelText = document.getElementById("level-text");
const codeInput = document.getElementById("code-input");
const statusDiv = document.getElementById("status");
const nextBtn = document.getElementById("next-level");
const gameEnd = document.getElementById("game-end");

levelText.textContent = levels[currentLevel].text;

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

            if (levels[currentLevel].validate()) {
                score++;
                statusDiv.textContent = "Réussi";
                statusDiv.style.color = "green";
                nextBtn.style.display = "block";
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

    if (currentLevel >= levels.length) {
        endGame();
        return;
    }

    levelText.textContent = levels[currentLevel].text;
    codeInput.value = "";
    statusDiv.innerHTML = "";
    nextBtn.style.display = "none";
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

    gameEnd.style.display = "block";
    codeInput.style.display = "none";
    nextBtn.style.display = "none";
    levelText.textContent = "Jeu terminé";
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
document.getElementById("restart-btn").onclick = () => location.reload();

// ---------------------
// RECHARGER CSS EXTERNE
// ---------------------
const reloadCssBtn = document.getElementById('reload-css-btn');
if (reloadCssBtn) {
    reloadCssBtn.onclick = async () => {
        try {
            const res = await fetch('style.css');
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const text = await res.text();

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
                statusDiv.textContent = 'CSS rechargé depuis style.css';
                statusDiv.style.color = 'blue';
            }));

        } catch (err) {
            statusDiv.textContent = 'Erreur: impossible de charger correction.css — active Live Server ou lance un serveur local';
            statusDiv.style.color = 'red';
            console.error(err);
        }
    };
}