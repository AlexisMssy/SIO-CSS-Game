const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('src/games/html/html.html', 'utf8');
const script = fs.readFileSync('src/games/html/html-script.js', 'utf8');

function createGame() {
    const elements = new Map();
    for (const [, tag, id] of html.matchAll(/<([a-z][a-z0-9]*)\b[^>]*\bid="([^"]+)"/gi)) {
        assert.ok(!elements.has(id), `Identifiant HTML dupliqué : ${id}`);
        const classes = new Set();
        elements.set(id, {
            tagName: tag.toUpperCase(),
            classList: {
                add: name => classes.add(name),
                remove: name => classes.delete(name),
                contains: name => classes.has(name)
            },
            style: {},
            addEventListener() {},
            appendChild() {},
            querySelectorAll: selector => selector === '.html-hit'
                ? [...elements.values()].filter(element => element.classList.contains('html-hit'))
                : []
        });
    }

    const storage = new Map();
    const context = vm.createContext({
        document: {
            getElementById: id => elements.get(id) || null,
            createElement: () => ({ classList: { add() {} }, addEventListener() {} })
        },
        localStorage: {
            getItem: key => storage.get(key) || null,
            setItem: (key, value) => storage.set(key, value),
            removeItem: key => storage.delete(key)
        },
        console
    });
    vm.runInContext(script, context);
    return { context, elements, levels: vm.runInContext('levels', context) };
}

test('chaque niveau HTML cible une balise existante et accepte sa réponse', () => {
    const { context, elements, levels } = createGame();
    assert.equal(levels.length, 31);

    levels.forEach((level, index) => {
        assert.match(level.text, new RegExp(`^Niveau ${index + 1} :`));
        const target = elements.get(level.target);
        assert.ok(target, `Niveau ${index + 1} : cible absente (${level.target})`);
        assert.equal(target.tagName.toLowerCase(), level.tag, `Niveau ${index + 1} : mauvaise cible`);

        vm.runInContext(`selectLevel(${index})`, context);
        elements.get('tag-input').value = `<${level.tag}>`;
        vm.runInContext('testTag()', context);
        assert.equal(elements.get('status').className, 'html-status success', `Niveau ${index + 1} refusé`);
        assert.equal(elements.get('score-display').textContent, `Points : ${index + 1}`);
    });

    assert.equal(elements.get('final-score').textContent, 'Score final : 31 / 31');
    assert.equal(elements.get('game-end').hidden, false);
    vm.runInContext('testTag()', context);
    assert.equal(elements.get('score-display').textContent, 'Points : 31');
});

test('le libellé du formulaire désigne le champ de saisie', () => {
    assert.match(html, /<label\b[^>]*id="html-label"[^>]*for="html-input"/);
});
