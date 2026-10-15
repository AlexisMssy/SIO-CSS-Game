// Construit dist/, le seul dossier déployé en ligne.
// Liste d'autorisation : tout ce qui n'est pas listé ici reste hors ligne
// (tests, outillage, specs, CLAUDE.md, node_modules…).
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

const ALLOWED = ['index.html', 'google8d2576bc6e0adcad.html', 'src'];

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST);

for (const name of ALLOWED) {
    fs.cpSync(path.join(ROOT, name), path.join(DIST, name), { recursive: true });
}

// Le contenu de public/ (robots.txt, sitemap.xml, favicon.ico) va à la racine du site.
fs.cpSync(path.join(ROOT, 'public'), DIST, { recursive: true });

console.log(`dist/ construit : ${fs.readdirSync(DIST).join(', ')}`);
