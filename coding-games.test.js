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
        const classes = new Set();
        let htmlContent = '';
        const element = {
            tagName: tagName.toUpperCase(),
            children,
            style: {},
            classList: {
                add: name => classes.add(name),
                remove: name => classes.delete(name),
                contains: name => classes.has(name)
            },
            removeAttribute(name) {
                if (name === 'style') this.style = {};
            },
            appendChild(child) {
                children.push(child);
                return child;
            },
            addEventListener(eventName, listener) {
                this.listeners ||= {};
                this.listeners[eventName] = listener;
            },
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
    const deterministicMath = Object.create(Math);
    deterministicMath.random = () => 0.25;
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
        Math: deterministicMath,
        console
    });
    vm.runInContext(script, context);
    return { context, elements, levels: vm.runInContext('levels', context) };
}

test('le jeu HTML ou CSS accepte les vingt classifications attendues', () => {
    const { context, elements, levels } = loadGame(
        'src/games/identify/identify.html',
        'src/games/identify/identify-script.js'
    );

    levels.forEach((level, index) => {
        vm.runInContext(`checkAnswer('${level.language}')`, context);
        assert.match(elements.get('status').textContent, /^Exact/, `Extrait ${index + 1} refusé`);
        if (index < levels.length - 1) vm.runInContext('nextLevel()', context);
    });

    assert.equal(levels.length, 20);
    assert.equal(vm.runInContext('score', context), 20);
    assert.equal(elements.get('final-score').textContent, 'Score final : 20 / 20');
});

test('le quiz exige toutes les bonnes réponses et propose cinq ou six choix mélangés', () => {
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
        const inputs = optionsContainer.querySelectorAll('input');
        assert.ok(level.options.length === 5 || level.options.length === 6, `Niveau ${index + 1} : cinq ou six propositions attendues`);
        inputs.forEach(input => {
            input.checked = level.correct.includes(Number(input.value));
        });
        assert.notDeepEqual(inputs.map(input => Number(input.value)), level.options.map((_, optionIndex) => optionIndex));
        vm.runInContext('checkAnswer()', context);
        assert.match(elements.get('status').textContent, /^Exact/, `Niveau ${index + 1} refusé`);
        if (index < levels.length - 1) vm.runInContext('nextLevel()', context);
    });

    assert.equal(levels.length, 20);
    assert.equal(vm.runInContext('score', context), 20);
    assert.equal(elements.get('final-score').textContent, 'Score final : 20 / 20');
});

test('Trouve l’erreur refuse un mauvais choix puis valide les vingt corrections mélangées', () => {
    const { context, elements, levels } = loadGame(
        'src/games/find-error/find-error.html',
        'src/games/find-error/find-error-script.js'
    );

    vm.runInContext('checkAnswer(1)', context);
    assert.match(elements.get('status').textContent, /Essaie encore/);
    assert.equal(vm.runInContext('score', context), 0);

    levels.forEach((level, index) => {
        const buttons = elements.get('fix-options').children;
        assert.notDeepEqual(buttons.map(button => button.textContent), level.options);
        const correctButton = buttons.find(button => button.textContent === level.options[level.correct]);
        assert.ok(correctButton, `Correction ${index + 1} absente des options affichées`);
        correctButton.listeners.click();
        assert.match(elements.get('status').textContent, /^Bien vu/, `Correction ${index + 1} refusée`);
        if (index < levels.length - 1) vm.runInContext('nextLevel()', context);
    });

    assert.equal(levels.length, 20);
    assert.equal(vm.runInContext('score', context), 20);
    assert.equal(elements.get('final-score').textContent, 'Score final : 20 / 20');
});

test('l’accueil garde l’ordre demandé et ne lie pas les jeux désactivés', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    const cards = [...html.matchAll(/<article class="game-card[^"]*"[^>]*>([\s\S]*?)<\/article>/g)];
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

test('les six jeux actifs ont au moins vingt niveaux', () => {
    const games = [
        ['src/games/identify/identify.html', 'src/games/identify/identify-script.js'],
        ['src/games/quiz/quiz.html', 'src/games/quiz/quiz-script.js'],
        ['src/games/find-error/find-error.html', 'src/games/find-error/find-error-script.js'],
        ['src/games/html/html.html', 'src/games/html/html-script.js'],
        ['src/games/styles/styles.html', 'src/games/styles/styles-script.js'],
        ['src/games/selectors/selectors.html', 'src/games/selectors/selectors-script.js']
    ];
    const levelCounts = games.map(([htmlPath, scriptPath]) => loadGame(htmlPath, scriptPath).levels.length);

    assert.deepEqual(levelCounts, [20, 20, 20, 31, 35, 20]);
});

test('les défis CSS contextuels utilisent des cibles adaptées à la propriété', () => {
    const html = fs.readFileSync('src/games/styles/styles.html', 'utf8');
    const css = fs.readFileSync('src/style/global.css', 'utf8');
    const { context, elements, levels } = loadGame(
        'src/games/styles/styles.html',
        'src/games/styles/styles-script.js'
    );
    const targets = [
        [18, 'css-layer-target', 'DIV'],
        [20, 'css-flex-target', 'DIV'],
        [21, 'css-target', 'DIV'],
        [27, 'css-inline-target', 'SPAN'],
        [29, 'css-list-target', 'UL'],
        [30, 'css-table-target', 'TABLE']
    ];

    targets.forEach(([index, id, tag]) => {
        assert.equal(levels[index].target || 'css-target', id);
        assert.ok(elements.has(id), `Niveau ${index + 1} : cible absente du HTML`);
        vm.runInContext(`selectLevel(${index})`, context);
        assert.equal(vm.runInContext('target.tagName', context), tag);
    });

    assert.match(html, /<ul\b[^>]*id="css-list-target"/);
    assert.match(html, /<table\b[^>]*id="css-table-target"/);
    assert.match(css, /#css-flex-stage\s*\{[^}]*display:\s*flex/s);
    assert.match(css, /#css-target\s*\{[^}]*display:\s*grid/s);
    assert.match(css, /\.css-layer-front\s*\{[^}]*position:\s*relative/s);
});
