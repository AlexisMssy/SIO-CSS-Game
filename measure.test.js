// Prouve que chaque mesure de measure.js détecte un problème posé volontairement,
// et ne signale rien sur une page saine.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { measurePage, isBlocking, readExemptPages, findPages } = require('./measure.js');

let browser;
before(async () => { browser = await chromium.launch(); });
after(async () => { await browser.close(); });

async function measure(html, widths) {
    const page = await browser.newPage();
    await page.setContent(`<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#fff8ec;color:#1f1a3d">${html}</body></html>`);
    const results = await measurePage(page, widths);
    await page.close();
    return results.flatMap(r => r.problems.map(p => ({ width: r.width, ...p })));
}

test('une page saine ne signale aucun problème aux trois largeurs', async () => {
    const problems = await measure('<p>Bonjour</p><button style="min-width:44px;min-height:44px">OK</button>');
    assert.deepStrictEqual(problems, []);
});

test('débordement : un bloc de 600px est signalé à 375px, pas à 768px', async () => {
    const problems = await measure('<div id="trop-large" style="width:600px">large</div>', [375, 768]);
    const overflow = problems.filter(p => p.kind === 'débordement');
    assert.deepStrictEqual(overflow.map(p => p.width), [375]);
    assert.match(overflow[0].elements[0], /trop-large/);
});

test('débordement : un bloc de code qui défile dans son cadre est accepté', async () => {
    const problems = await measure('<pre style="overflow-x:auto;max-width:100%"><code style="display:block;width:900px">code long</code></pre>', [375]);
    assert.deepStrictEqual(problems.filter(p => p.kind === 'débordement'), []);
});

test('cible : un bouton de 30px de haut est signalé', async () => {
    const problems = await measure('<button style="width:120px;height:30px">Valider</button>', [375]);
    const targets = problems.filter(p => p.kind === 'cible');
    assert.strictEqual(targets.length, 1);
    assert.match(targets[0].detail, /120×30px/);
});

test('cible : un lien dans une phrase est exempté, un lien seul est mesuré', async () => {
    const problems = await measure('<p>Lis <a href="#a">la consigne</a> avant.</p><nav><a href="#b">Accueil</a></nav>', [375]);
    const targets = problems.filter(p => p.kind === 'cible');
    assert.strictEqual(targets.length, 1);
    assert.match(targets[0].elements[0], /Accueil/);
});

test('contraste : gris clair sur blanc (2,85:1) est signalé', async () => {
    const problems = await measure('<p style="background:#fff;color:#999">Consigne</p>', [375]);
    const contrast = problems.filter(p => p.kind === 'contraste');
    assert.strictEqual(contrast.length, 1);
    assert.match(contrast[0].detail, /^2\.85:1/);
});

test('contraste : le même gris à 24px est jugé au seuil de 3:1', async () => {
    const problems = await measure('<p style="background:#fff;color:#888;font-size:24px">Titre</p>', [375]);
    assert.deepStrictEqual(problems.filter(p => p.kind === 'contraste'), []);
});

test('contraste : un fond en dégradé est signalé à vérifier, sans bloquer', async () => {
    const problems = await measure('<p style="background:linear-gradient(#fff,#000)">Texte</p>', [375]);
    assert.ok(problems.every(p => p.warning));
    assert.strictEqual(problems.length, 1);
});

// ---------- Quelles pages bloquent : toutes, sauf les exemptions temporaires ----------

test('bloquante par défaut : une page absente des exemptions bloque', () => {
    assert.strictEqual(isBlocking('src/games/nouveau/nouveau.html', { exempt: new Set(['index.html']) }), true);
});

test('exemption : une page listée (pas encore refaite) ne bloque pas', () => {
    assert.strictEqual(isBlocking('index.html', { exempt: new Set(['index.html']) }), false);
});

test('pages demandées en ligne de commande : toujours bloquantes, même exemptées', () => {
    assert.strictEqual(isBlocking('index.html', { exempt: new Set(['index.html']), requested: ['index.html'] }), true);
});

test('chaque exemption désigne une page qui existe (pas de ligne périmée ni de faute de frappe)', () => {
    execFileSync(process.execPath, [path.join(__dirname, 'build.js')], { stdio: 'ignore' });
    const pages = new Set(findPages(path.join(__dirname, 'dist')));
    const stale = readExemptPages().filter(page => !pages.has(page));
    assert.deepStrictEqual(stale, []);
});

test('l’ancienne liste « bloquantes » a disparu (une seule règle possible)', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, 'measure-blocking.txt')), false);
});
