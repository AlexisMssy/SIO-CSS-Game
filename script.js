// --- Définition des niveaux ---
const levels = [
    {
        text: "Niveau 1 : Quand l'écran fait moins de 600px → Le carré doit devenir bleu.",
        validate: () => {
            return window.getComputedStyle(document.getElementById('box')).backgroundColor === "rgb(0, 0, 255)";
        }
    },
    {
        text: "Niveau 2 : Quand l'écran fait plus de 800px → Le carré doit mesurer 300px.",
        validate: () => {
            return document.getElementById('box').offsetWidth === 300;
        }
    },
    {
        text: "Niveau 3 : Entre 500px et 900px → Le carré doit devenir un cercle.",
        validate: () => {
            return window.getComputedStyle(document.getElementById('box')).borderRadius === "50%";
        }
    },
    {
        text: "Niveau 4 : Quand l'écran fait moins de 400px → Le carré doit disparaître.",
        validate: () => {
            return window.getComputedStyle(document.getElementById('box')).display === "none";
        }
    },
    {
        text: "Niveau 5 : Quand l'écran fait plus de 1000px → Le carré doit devenir vert + largeur 400px.",
        validate: () => {
            const cs = window.getComputedStyle(document.getElementById('box'));
            return cs.backgroundColor === "rgb(0, 128, 0)" &&
                   document.getElementById('box').offsetWidth === 400;
        }
    },
    {
        text: "Niveau 6 : Quand l'écran fait moins de 700px → Le carré doit passer à 100px.",
        validate: () => {
            return document.getElementById('box').offsetWidth === 100;
        }
    },
    {
        text: "Niveau 7 : Quand l'écran est entre 600px et 900px → Le carré doit devenir jaune.",
        validate: () => {
            return window.getComputedStyle(document.getElementById('box')).backgroundColor === "rgb(255, 255, 0)";
        }
    },
    {
        text: "Niveau 8 : Quand l'écran fait plus de 900px → Le carré doit avoir une bordure noire de 5px.",
        validate: () => {
            return window.getComputedStyle(document.getElementById('box')).borderWidth === "5px";
        }
    },
    {
        text: "Niveau 9 : Quand l'écran est inférieur à 500px → Le carré doit être à 50% d'opacité.",
        validate: () => {
            return window.getComputedStyle(document.getElementById('box')).opacity === "0.5";
        }
    },
    {
        text: "Niveau 10 : Quand l'écran fait plus de 1100px → Le carré doit être tourné de 45 degrés.",
        validate: () => {
            return window.getComputedStyle(document.getElementById('box')).transform.includes("45deg");
        }
    },
    {
        text: "Niveau 11 : Quand l'écran fait moins de 550px → Le carré doit devenir un rectangle (300px x 120px).",
        validate: () => {
            const box = document.getElementById('box');
            return box.offsetWidth === 300 && box.offsetHeight === 120;
        }
    },
    {
        text: "Niveau 12 : Entre 700px et 1200px → Le carré doit devenir blanc.",
        validate: () => {
            return window.getComputedStyle(document.getElementById('box')).backgroundColor === "rgb(255, 255, 255)";
        }
    },
    {
        text: "Niveau 13 : Quand l'écran fait plus de 1300px → Le carré doit être centré ET avec une marge haute de 50px.",
        validate: () => {
            return document.getElementById('box').style.marginTop === "50px";
        }
    },
    {
        text: "Niveau 14 : Quand l'écran fait moins de 500px → Le carré doit avoir une ombre portée.",
        validate: () => {
            return window.getComputedStyle(document.getElementById('box')).boxShadow !== "none";
        }
    },
    {
        text: "Niveau 15 : Quand l'écran fait plus de 1000px → Le carré doit devenir un ovale (border-radius: 50px / 25px).",
        validate: () => {
            const br = window.getComputedStyle(document.getElementById('box')).borderRadius;
            return br.includes("50px") || br.includes("25px");
        }
    }
];

let currentLevel = 0;

// Initialisation
document.getElementById("level-text").textContent = levels[currentLevel].text;

// --- Fonction Test ---
document.getElementById("test-btn").onclick = function () {
    const css = document.createElement("style");
    css.innerHTML = document.getElementById("code-input").value;
    document.body.appendChild(css);

    setTimeout(() => {
        if (levels[currentLevel].validate()) {
            document.getElementById("status").innerHTML = "✅ Bravo ! Niveau réussi.";
            document.getElementById("status").style.color = "green";
            document.getElementById("next-level").style.display = "block";
        } else {
            document.getElementById("status").innerHTML = "❌ Pas encore ! Essaie encore.";
            document.getElementById("status").style.color = "red";
        }
    }, 200);
};

// --- Niveau suivant ---
document.getElementById("next-level").onclick = function () {
    currentLevel++;

    if (currentLevel >= levels.length) {
        document.getElementById("level-text").innerHTML = "🎉 Jeu terminé ! Bravo 🎉";
        document.getElementById("code-input").style.display = "none";
        document.getElementById("next-level").style.display = "none";
        return;
    }

    document.getElementById("level-text").textContent = levels[currentLevel].text;
    document.getElementById("code-input").value = "";
    document.getElementById("status").innerHTML = "";
    document.getElementById("next-level").style.display = "none";
};