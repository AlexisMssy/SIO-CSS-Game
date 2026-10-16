// F1 : tokens --sio-* et fondations visuelles de src/style/global.css (spec §2).
// Charge la vraie feuille de style dans une page de test, vérifie les couleurs calculées,
// puis passe la page à measurePage (contraste, cibles, débordement).
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { measurePage } = require('./measure.js');

const ROOT = __dirname;
const ORIGIN = 'http://sio.test';

// Les tokens attendus sont lus dans le tableau du §2 de la spec, pas recopiés ici.
function readSpecTokens() {
    const spec = fs.readFileSync(path.join(ROOT, 'specs', 'refonte.md'), 'utf8');
    const tokens = {};
    for (const [, name, value] of spec.matchAll(/^\| `(--sio-[a-z-]+)` \| `(#[0-9a-f]{6})` \|/gm)) tokens[name] = value;
    return tokens;
}

// Stylelint impose #fff là où la spec écrit #ffffff : on compare les couleurs, pas leur écriture.
const longHex = value => (/^#[0-9a-f]{3}$/.test(value) ? `#${[...value.slice(1)].map(c => c + c).join('')}` : value);

const hexToRgb = hex => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
    return `rgb(${r}, ${g}, ${b})`;
};

const PAGE = extra => `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Test des tokens</title><link rel="stylesheet" href="/src/style/global.css"></head>
<body class="sio-page">
<main>
  <a id="bouton" class="sio-button" href="#suite">Valider</a>
  <a id="noeud" class="sio-node sio-node--done" href="#niveau" aria-label="Niveau terminé">✓</a>
  <section id="carte" class="sio-card">
    <h2>Flexbox</h2>
    <p id="secondaire" class="sio-text-soft">3 niveaux sur 8 réussis</p>
    <p>Voir <a id="lien" class="sio-link" href="#aide">la leçon</a> avant de jouer.</p>
  </section>
  <pre id="code" class="sio-code"><code>.boite { display: flex; }</code></pre>
  <div id="terminal" class="sio-terminal"><span class="sio-terminal-ok">PASS</span> flex-wrap</div>
  ${extra || ''}
</main>
</body>
</html>`;

let browser;
before(async () => { browser = await chromium.launch(); });
after(async () => { await browser.close(); });

async function openPage(extra) {
    const page = await browser.newPage();
    await page.route(`${ORIGIN}/**`, route => {
        const { pathname } = new URL(route.request().url());
        if (pathname === '/page') return route.fulfill({ contentType: 'text/html', body: PAGE(extra) });
        const file = path.join(ROOT, pathname);
        if (!file.startsWith(ROOT) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
        const types = { '.css': 'text/css', '.woff2': 'font/woff2' };
        return route.fulfill({ contentType: types[path.extname(file)] || 'application/octet-stream', body: fs.readFileSync(file) });
    });
    await page.goto(`${ORIGIN}/page`, { waitUntil: 'networkidle' });
    return page;
}

const styleOf = (page, selector, props) => page.$eval(selector, (el, list) => {
    const s = getComputedStyle(el);
    return Object.fromEntries(list.map(p => [p, s.getPropertyValue(p)]));
}, props);

const problemsOf = async page => (await measurePage(page)).flatMap(r => r.problems.map(p => ({ width: r.width, ...p })));

test('le tableau du §2 est lu correctement (13 tokens)', () => {
    assert.strictEqual(Object.keys(readSpecTokens()).length, 13);
});

test('chaque token --sio-* de :root vaut la valeur du §2', async () => {
    const page = await openPage();
    const actual = await page.evaluate(names => Object.fromEntries(
        names.map(n => [n, getComputedStyle(document.documentElement).getPropertyValue(n).trim().toLowerCase()])), Object.keys(readSpecTokens()));
    await page.close();
    assert.deepStrictEqual(Object.fromEntries(Object.entries(actual).map(([k, v]) => [k, longHex(v)])), readSpecTokens());
});

test('bouton principal : texte --sio-ink sur --sio-accent, ombre --sio-accent-deep, pastille', async () => {
    const t = readSpecTokens();
    const page = await openPage();
    const s = await styleOf(page, '#bouton', ['color', 'background-color', 'border-top-left-radius', 'box-shadow', 'min-height']);
    await page.close();
    assert.strictEqual(s.color, hexToRgb(t['--sio-ink']));
    assert.strictEqual(s['background-color'], hexToRgb(t['--sio-accent']));
    assert.strictEqual(s['border-top-left-radius'], '999px');
    assert.strictEqual(s['box-shadow'], `${hexToRgb(t['--sio-accent-deep'])} 0px 5px 0px 0px`);
    assert.ok(parseFloat(s['min-height']) >= 44);
});

test('nœud terminé : fond --sio-success-deep, ✓ blanc', async () => {
    const t = readSpecTokens();
    const page = await openPage();
    const s = await styleOf(page, '#noeud', ['color', 'background-color']);
    await page.close();
    assert.strictEqual(s.color, 'rgb(255, 255, 255)');
    assert.strictEqual(s['background-color'], hexToRgb(t['--sio-success-deep']));
});

test('carte : fond --sio-surface, bordure 3px --sio-ink, rayon 24px, ombre relief', async () => {
    const t = readSpecTokens();
    const page = await openPage();
    const s = await styleOf(page, '#carte', ['background-color', 'border-top-width', 'border-top-style', 'border-top-color', 'border-top-left-radius', 'box-shadow']);
    await page.close();
    assert.strictEqual(s['background-color'], hexToRgb(t['--sio-surface']));
    assert.strictEqual(s['border-top-width'], '3px');
    assert.strictEqual(s['border-top-style'], 'solid');
    assert.strictEqual(s['border-top-color'], hexToRgb(t['--sio-ink']));
    assert.strictEqual(s['border-top-left-radius'], '24px');
    assert.strictEqual(s['box-shadow'], `${hexToRgb(t['--sio-ink'])} 0px 6px 0px 0px`);
});

test('texte secondaire et lien : --sio-ink-soft et --sio-accent-deep', async () => {
    const t = readSpecTokens();
    const page = await openPage();
    const soft = await styleOf(page, '#secondaire', ['color']);
    const link = await styleOf(page, '#lien', ['color']);
    await page.close();
    assert.strictEqual(soft.color, hexToRgb(t['--sio-ink-soft']));
    assert.strictEqual(link.color, hexToRgb(t['--sio-accent-deep']));
});

test('bloc de code et terminal sombres, en JetBrains Mono', async () => {
    const t = readSpecTokens();
    const page = await openPage();
    const code = await styleOf(page, '#code', ['background-color', 'color', 'font-family']);
    const terminal = await styleOf(page, '#terminal', ['background-color', 'font-family']);
    const ok = await styleOf(page, '.sio-terminal-ok', ['color']);
    await page.close();
    assert.strictEqual(code['background-color'], hexToRgb(t['--sio-ink']));
    assert.strictEqual(code.color, hexToRgb(t['--sio-ground']));
    assert.match(code['font-family'], /JetBrains Mono/);
    assert.strictEqual(terminal['background-color'], hexToRgb(t['--sio-terminal']));
    assert.match(terminal['font-family'], /JetBrains Mono/);
    assert.strictEqual(ok.color, hexToRgb(t['--sio-terminal-ok']));
});

test('page de test : fond --sio-ground, police Bricolage Grotesque', async () => {
    const t = readSpecTokens();
    const page = await openPage();
    const s = await styleOf(page, 'body', ['background-color', 'color', 'font-family']);
    await page.close();
    assert.strictEqual(s['background-color'], hexToRgb(t['--sio-ground']));
    assert.strictEqual(s.color, hexToRgb(t['--sio-ink']));
    assert.match(s['font-family'], /Bricolage Grotesque/);
});

test('mesures : aucun problème de contraste, de cible ni de débordement aux trois largeurs', async () => {
    const page = await openPage();
    const problems = await problemsOf(page);
    await page.close();
    assert.deepStrictEqual(problems, []);
});

// Preuve que la mesure détecte l'interdit de la spec §2 : jamais de texte blanc sur accent ni sur success.
test('mesures : texte blanc sur --sio-accent est signalé en contraste', async () => {
    const page = await openPage('<p id="interdit" style="background:var(--sio-accent);color:#fff">Valider</p>');
    const problems = (await problemsOf(page)).filter(p => p.kind === 'contraste');
    await page.close();
    assert.strictEqual(problems.length, 3, 'une fois par largeur');
    assert.ok(problems.every(p => /interdit/.test(p.elements[0]) && /^2\.\d\d:1/.test(p.detail)), JSON.stringify(problems));
});

test('mesures : texte blanc sur --sio-success est signalé en contraste', async () => {
    const page = await openPage('<p id="interdit" style="background:var(--sio-success);color:#fff">Réussi</p>');
    const problems = (await problemsOf(page)).filter(p => p.kind === 'contraste');
    await page.close();
    assert.strictEqual(problems.length, 3);
    assert.ok(problems.every(p => /interdit/.test(p.elements[0])));
});

test('polices : les deux fichiers woff2 sont chargés depuis le dépôt, sans requête externe', async () => {
    const page = await browser.newPage();
    const external = [];
    page.on('request', r => { if (!r.url().startsWith(ORIGIN) && !r.url().startsWith('data:')) external.push(r.url()); });
    await page.route(`${ORIGIN}/**`, route => {
        const { pathname } = new URL(route.request().url());
        if (pathname === '/page') return route.fulfill({ contentType: 'text/html', body: PAGE() });
        const file = path.join(ROOT, pathname);
        if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
        return route.fulfill({ contentType: path.extname(file) === '.css' ? 'text/css' : 'font/woff2', body: fs.readFileSync(file) });
    });
    await page.goto(`${ORIGIN}/page`, { waitUntil: 'networkidle' });
    const loaded = await page.evaluate(async () => {
        await document.fonts.ready;
        return [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '')).sort();
    });
    await page.close();
    assert.deepStrictEqual(external, []);
    assert.ok(loaded.includes('Bricolage Grotesque'), `chargées : ${loaded}`);
    assert.ok(loaded.includes('JetBrains Mono'), `chargées : ${loaded}`);
});

test('polices : licences OFL présentes à côté des fichiers, font-display: swap partout', () => {
    const css = fs.readFileSync(path.join(ROOT, 'src', 'style', 'global.css'), 'utf8');
    const faces = css.match(/@font-face\s*{[^}]*}/g) || [];
    assert.ok(faces.length >= 2);
    for (const face of faces) assert.match(face, /font-display:\s*swap/);
    assert.ok(!/fonts\.googleapis|fonts\.gstatic/.test(css));
    const files = fs.readdirSync(path.join(ROOT, 'src', 'fonts'));
    assert.ok(files.some(f => /bricolage.*\.woff2$/i.test(f)));
    assert.ok(files.some(f => /jetbrains.*\.woff2$/i.test(f)));
    assert.ok(files.some(f => /bricolage.*(OFL|LICENSE)/i.test(f)));
    assert.ok(files.some(f => /jetbrains.*(OFL|LICENSE)/i.test(f)));
});
