// Vérifie le paquet déployé : la CI ne met en ligne que le dossier dist/,
// qui doit contenir exactement la liste autorisée, rien d'autre.
const { test, before } = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

function listFiles(dir, base = dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? listFiles(full, base) : [path.relative(base, full).split(path.sep).join('/')];
    });
}

// Fichiers de src/ visibles par git (suivis ou nouveaux, mais jamais ignorés comme les corrigés).
function gitVisibleFiles(dir) {
    const out = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '--', dir], { cwd: ROOT, encoding: 'utf8' });
    return out.split('\n').filter(Boolean).filter(file => fs.existsSync(path.join(ROOT, file)));
}

function expectedFiles() {
    const publicFiles = fs.readdirSync(path.join(ROOT, 'public'));
    return [
        'index.html',
        'google8d2576bc6e0adcad.html',
        ...publicFiles,
        ...gitVisibleFiles('src'),
    ].sort();
}

before(() => {
    try {
        execFileSync(process.execPath, [path.join(ROOT, 'build.js')], { cwd: ROOT, stdio: 'pipe' });
    } catch (error) {
        throw new Error(`build.js a échoué : ${error.stderr || error.message}`);
    }
});

test('dist/ contient exactement la liste autorisée', () => {
    assert.deepStrictEqual(listFiles(DIST).sort(), expectedFiles());
});

test('les fichiers de public/ sont à la racine de dist/', () => {
    assert.ok(fs.existsSync(path.join(DIST, 'robots.txt')));
    assert.ok(!fs.existsSync(path.join(DIST, 'public')));
});

test('ni tests, ni outillage, ni documents internes dans dist/', () => {
    const forbidden = /(^|\/)(node_modules|specs|docs|\.claude|\.github|reports|playwright-report|test-results)\/|\.test\.js$|^test\.js$|correction|^package(-lock)?\.json$|\.md$|^build\.js$|^measure\.js$/;
    const leaks = listFiles(DIST).filter(file => forbidden.test(file));
    assert.deepStrictEqual(leaks, []);
});

test('une copie identique des fichiers (pas de fichier vide ou tronqué)', () => {
    for (const file of ['index.html', 'src/utils/utils.js']) {
        assert.ok(fs.readFileSync(path.join(DIST, file)).equals(fs.readFileSync(path.join(ROOT, file))), file);
    }
    assert.ok(fs.readFileSync(path.join(DIST, 'robots.txt')).equals(fs.readFileSync(path.join(ROOT, 'public', 'robots.txt'))));
});
