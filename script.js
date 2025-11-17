// ---------------------
//   NIVEAUX
// ---------------------
const box = document.getElementById("box");

const levels = [
    { text: "Niveau 1 : Quand l'écran fait moins de 600px → Le carré doit devenir bleu.",
      validate: () => getComputedStyle(box).backgroundColor === "rgb(0, 0, 255)" },

    { text: "Niveau 2 : Quand l'écran fait plus de 800px → Le carré doit mesurer 300px.",
      validate: () => box.offsetWidth === 300 },

    { text: "Niveau 3 : Entre 500px et 900px → Le carré doit devenir un cercle.",
      validate: () => getComputedStyle(box).borderRadius === "50%" },

    { text: "Niveau 4 : Quand l'écran fait moins de 400px → Le carré doit disparaître.",
      validate: () => getComputedStyle(box).display === "none" },

    { text: "Niveau 5 : Quand l'écran fait plus de 1000px → carré vert + largeur 400px.",
      validate: () =>
        getComputedStyle(box).backgroundColor === "rgb(0, 128, 0)" &&
        box.offsetWidth === 400 },

    { text: "Niveau 6 : Moins de 700px → carré = 100px.",
      validate: () => box.offsetWidth === 100 },

    { text: "Niveau 7 : Entre 600px et 900px → carré jaune.",
      validate: () => getComputedStyle(box).backgroundColor === "rgb(255, 255, 0)" },

    { text: "Niveau 8 : Plus de 900px → bordure noire 5px.",
      validate: () => getComputedStyle(box).borderWidth === "5px" },

    { text: "Niveau 9 : Moins de 500px → opacité 50%.",
      validate: () => getComputedStyle(box).opacity === "0.5" },

    { text: "Niveau 10 : Plus de 1100px → rotation 45°.",
      validate: () => getComputedStyle(box).transform.includes("45deg") },

    { text: "Niveau 11 : Moins de 550px → rectangle (300x120).",
      validate: () => box.offsetWidth === 300 && box.offsetHeight === 120 },

    { text: "Niveau 12 : Entre 700px et 1200px → carré blanc.",
      validate: () => getComputedStyle(box).backgroundColor === "rgb(255, 255, 255)" },

    { text: "Niveau 13 : Plus de 1300px → margin-top 50px.",
      validate: () => box.style.marginTop === "50px" },

    { text: "Niveau 14 : Moins de 500px → ombre portée.",
      validate: () => getComputedStyle(box).boxShadow !== "none" },

    { text: "Niveau 15 : Plus de 1000px → ovale.",
      validate: () => getComputedStyle(box).borderRadius.includes("50px") }
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

    const css = document.createElement("style");
    css.innerHTML = codeInput.value;
    document.body.appendChild(css);

    setTimeout(() => {
        if (levels[currentLevel].validate()) {
            score++;
            statusDiv.innerHTML = "Réussi";
            statusDiv.style.color = "green";
            nextBtn.style.display = "block";
        } else {
            statusDiv.innerHTML = "Incorrect";
            statusDiv.style.color = "red";
        }
    }, 150);
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
    const list = JSON.parse(localStorage.getItem("mq_scores") || "[]");

    list.push(entry);
    localStorage.setItem("mq_scores", JSON.stringify(list));

    updateScoreboard();
}

function updateScoreboard() {
    const list = JSON.parse(localStorage.getItem("mq_scores") || "[]");
    const tbody = document.getElementById("scoreboard-body");

    tbody.innerHTML = "";
    list.sort((a, b) => b.score - a.score || a.time - b.time);

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