const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function loadGame(htmlPath, scriptPath) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const script = fs.readFileSync(scriptPath, 'utf8');
    const elements = new Map();

    function createElement(tagName = 'div') {
        const children = [];
        let htmlContent = '';
        const element = {
            tagName: tagName.toUpperCase(),
            children,
            style: {},
            appendChild(child) {
                children.push(child);
                return child;
            },
            addEventListener() {},
            querySelectorAll(selector) {
                const matches = [];
                function visit(parent) {
                    for (const child of parent.children || []) {
                        if (selector.startsWith('input') && child.tagName === 'INPUT') {
                            if (!selector.includes(':checked') || child.checked) matches.push(child);
                        }
                        visit(child);
                    }
                }
                visit(this);
                return matches;
            }
        };
        Object.defineProperty(element, 'innerHTML', {
            get: () => htmlContent,
            set: value => {
                htmlContent = value;
                if (value === '') children.length = 0;
            }
        });
        return element;
    }

    for (const [, tag, id] of html.matchAll(/<([a-z][a-z0-9]*)\b[^>]*\bid="([^"]+)"/gi)) {
        assert.ok(!elements.has(id), `Identifiant HTML dupliqué : ${id}`);
        elements.set(id, createElement(tag));
    }

    const storage = new Map();
    const context = vm.createContext({
        document: {
            getElementById: id => elements.get(id) || null,
            createElement,
            createTextNode: text => ({ textContent: text, children: [] })
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

test('le jeu HTML ou CSS accepte les dix classifications attendues', () => {
    const { context, elements, levels } = loadGame(
        'src/games/identify/identify.html',
        'src/games/identify/identify-script.js'
    );

    levels.forEach((level, index) => {
        vm.runInContext(`checkAnswer('${level.language}')`, context);
        assert.match(elements.get('status').textContent, /^Exact/, `Extrait ${index + 1} refusé`);
        if (index < levels.length - 1) vm.runInContext('nextLevel()', context);
    });

    assert.equal(vm.runInContext('score', context), 10);
    assert.equal(elements.get('final-score').textContent, 'Score final : 10 / 10');
});

test('le quiz exige toutes les bonnes réponses et en contient cinq par niveau', () => {
    const { context, elements, levels } = loadGame(
        'src/games/quiz/quiz.html',
        'src/games/quiz/quiz-script.js'
    );
    const optionsContainer = elements.get('answer-options');
    const firstInput = optionsContainer.querySelectorAll('input')[0];
    firstInput.checked = true;
    vm.runInContext('checkAnswer()', context);
    assert.match(elements.get('status').textContent, /Il manque/);
    assert.equal(vm.runInContext('score', context), 0);

    levels.forEach((level, index) => {
        assert.equal(level.options.length, 5, `Niveau ${index + 1} : cinq propositions attendues`);
        optionsContainer.querySelectorAll('input').forEach((input, optionIndex) => {
            input.checked = level.correct.includes(optionIndex);
        });
        vm.runInContext('checkAnswer()', context);
        assert.match(elements.get('status').textContent, /^Exact/, `Niveau ${index + 1} refusé`);
        if (index < levels.length - 1) vm.runInContext('nextLevel()', context);
    });

    assert.equal(vm.runInContext('score', context), 8);
    assert.equal(elements.get('final-score').textContent, 'Score final : 8 / 8');
});

test('Trouve l’erreur refuse un mauvais choix puis valide les dix corrections', () => {
    const { context, elements, levels } = loadGame(
        'src/games/find-error/find-error.html',
        'src/games/find-error/find-error-script.js'
    );

    vm.runInContext('checkAnswer(1)', context);
    assert.match(elements.get('status').textContent, /Essaie encore/);
    assert.equal(vm.runInContext('score', context), 0);

    levels.forEach((level, index) => {
        vm.runInContext(`checkAnswer(${level.correct})`, context);
        assert.match(elements.get('status').textContent, /^Bien vu/, `Correction ${index + 1} refusée`);
        if (index < levels.length - 1) vm.runInContext('nextLevel()', context);
    });

    assert.equal(vm.runInContext('score', context), 10);
    assert.equal(elements.get('final-score').textContent, 'Score final : 10 / 10');
});

test('l’accueil garde l’ordre demandé et ne lie pas les jeux désactivés', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    const cards = [...html.matchAll(/<article class="game-card[^\"]*"[^>]*>([\s\S]*?)<\/article>/g)];
    const titles = cards.map(([, content]) => content.match(/<h2>([^<]+)<\/h2>/)?.[1]);

    assert.deepEqual(titles, [
        'HTML ou CSS ?',
        'Comprendre le code',
        'Trouve l’erreur',
        'Jeu Balises HTML',
        'Jeu Propriétés CSS',
        'Jeu Sélecteurs CSS',
        'Jeu Carré (Media Queries)',
        'Jeu Grille CSS',
        'Jeu Bootstrap'
    ]);

    const disabledCards = cards.filter(([markup]) => markup.includes('game-card--disabled'));
    assert.equal(disabledCards.length, 3);
    disabledCards.forEach(([, content]) => {
        assert.doesNotMatch(content, /<a\b/);
        assert.match(content, /aria-disabled="true"/);
    });
});
