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

    assert.equal(levels.length, 26);
    assert.equal(vm.runInContext('score', context), 26);
    assert.equal(elements.get('final-score').textContent, 'Score final : 26 / 26');
    assert.ok(levels.some(level => level.code.includes('DNS')));
    assert.ok(levels.some(level => level.code.includes('404')));
    assert.ok(levels.some(level => level.code.includes('git status')));
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
        'Flexbox',
        'CSS Grid',
        'Jeu Carré (Media Queries)',
        'Jeu Bootstrap'
    ]);

    const disabledCards = cards.filter(([markup]) => markup.includes('game-card--disabled'));
    assert.equal(disabledCards.length, 2);
    disabledCards.forEach(([, content]) => {
        assert.doesNotMatch(content, /<a\b/);
        assert.match(content, /aria-disabled="true"/);
    });

    ['flex-builder/builder.html', 'flex-dispatch/dispatch.html', 'grid-debugger/debugger.html', 'grid-infinite/infinite.html'].forEach(path => {
        assert.match(html, new RegExp(path.replaceAll('/', '\\/')));
    });
});

test('toutes les pages utilisent la navigation partagée', () => {
    const utilities = fs.readFileSync('src/utils/utils.js', 'utf8');
    const pages = [
        'index.html',
        'src/games/identify/identify.html',
        'src/games/quiz/quiz.html',
        'src/games/find-error/find-error.html',
        'src/games/html/html.html',
        'src/games/styles/styles.html',
        'src/games/selectors/selectors.html',
        'src/games/square/square.html',
        'src/games/flex/flex.html',
        'src/games/flex-builder/builder.html',
        'src/games/flex-dispatch/dispatch.html',
        'src/games/grid/grid.html',
        'src/games/grid-debugger/debugger.html',
        'src/games/grid-infinite/infinite.html',
        'src/games/bootstrap/bootstrap.html'
    ];

    pages.forEach(path => {
        const html = fs.readFileSync(path, 'utf8');
        assert.match(html, /<nav class="main-nav" aria-label="Navigation principale"><\/nav>/, path);
        assert.match(html, /utils\.js/, path);
    });
    ['foundations', 'flexbox', 'grid', 'unavailable'].forEach(group => {
        assert.ok(utilities.includes(`data-nav-group="${group}"`), `Groupe de navigation absent : ${group}`);
    });
    [
        '/src/games/flex/flex.html',
        '/src/games/flex-builder/builder.html',
        '/src/games/flex-dispatch/dispatch.html',
        '/src/games/grid/grid.html',
        '/src/games/grid-debugger/debugger.html',
        '/src/games/grid-infinite/infinite.html'
    ].forEach(path => assert.ok(utilities.includes(`href="${path}"`), `Lien absent : ${path}`));
});

test('les jeux actifs ont au moins vingt niveaux', () => {
    const games = [
        ['src/games/identify/identify.html', 'src/games/identify/identify-script.js'],
        ['src/games/quiz/quiz.html', 'src/games/quiz/quiz-script.js'],
        ['src/games/find-error/find-error.html', 'src/games/find-error/find-error-script.js'],
        ['src/games/html/html.html', 'src/games/html/html-script.js'],
        ['src/games/styles/styles.html', 'src/games/styles/styles-script.js'],
        ['src/games/selectors/selectors.html', 'src/games/selectors/selectors-script.js'],
        ['src/games/flex/flex.html', 'src/games/flex/flex.js'],
        ['src/games/grid/grid.html', 'src/games/grid/grid-atelier.js']
    ];
    const levelCounts = games.map(([htmlPath, scriptPath]) => loadGame(htmlPath, scriptPath).levels.length);

    assert.deepEqual(levelCounts, [20, 26, 20, 31, 35, 24, 20, 30]);
});

test('les niveaux avancés sont signalés dans les consignes des jeux', () => {
    const games = [
        ['src/games/identify/identify.html', 'src/games/identify/identify-script.js'],
        ['src/games/quiz/quiz.html', 'src/games/quiz/quiz-script.js'],
        ['src/games/find-error/find-error.html', 'src/games/find-error/find-error-script.js'],
        ['src/games/html/html.html', 'src/games/html/html-script.js'],
        ['src/games/styles/styles.html', 'src/games/styles/styles-script.js'],
        ['src/games/flex/flex.html', 'src/games/flex/flex.js'],
        ['src/games/grid/grid.html', 'src/games/grid/grid-atelier.js']
    ];

    games.forEach(([htmlPath, scriptPath]) => {
        const { context, elements, levels } = loadGame(htmlPath, scriptPath);
        const advancedIndex = levels.findIndex(level => level.advanced);
        assert.ok(advancedIndex >= 0, `${scriptPath} doit signaler un approfondissement`);
        vm.runInContext(`currentLevel = ${advancedIndex}; updateLevel();`, context);
        assert.match(elements.get('level-text').textContent, /^Approfondissement —/, scriptPath);
        const levelList = elements.get('level-list');
        if (levelList) {
            assert.ok(levelList.children.some(child => child.textContent === `Niveau ${advancedIndex + 1} *`), scriptPath);
        }
    });
});

test('l’atelier Flexbox sépare les bases des approfondissements et normalise le CSS', () => {
    const { context, elements, levels } = loadGame(
        'src/games/flex/flex.html',
        'src/games/flex/flex.js'
    );

    assert.equal(levels.length, 20);
    assert.ok(levels.slice(0, 7).every(level => !level.advanced));
    assert.ok(levels.slice(7).every(level => level.advanced));
    assert.ok(levels.every(level => level.expected.length > 0 && typeof level.validate === 'function'));
    elements.get('code-input').value = '#FLEX-CONTAINER {\n  DISPLAY : FLEX;\n}';
    assert.equal(vm.runInContext('checkExpected(levels[0])', context), true);
});

test('Dispatch Flex propose dix missions sans propriétés hors cours', () => {
    const script = fs.readFileSync('src/games/flex-dispatch/dispatch.js', 'utf8');
    const missionBlock = script.match(/const missions = \[([\s\S]*?)\n\];/)?.[1];

    assert.ok(missionBlock);
    assert.equal([...missionBlock.matchAll(/^\s+title:/gm)].length, 10);
    assert.doesNotMatch(missionBlock, /\b(?:flex-wrap|order|flex-grow|flex-shrink|flex-basis|align-content)\b/);
});

test('Flexbox Builder propose huit plans avec les commandes du cours', () => {
    const script = fs.readFileSync('src/games/flex-builder/builder.js', 'utf8');
    const missionBlock = script.match(/const missions = \[([\s\S]*?)\n\];/)?.[1];

    assert.ok(missionBlock);
    assert.equal([...missionBlock.matchAll(/title:/g)].length, 8);
    assert.doesNotMatch(missionBlock, /flexWrap|order|flexGrow|flexShrink|flexBasis|alignContent/);
});

test('Flexbox Builder applique le plateau uniquement à la comparaison et nomme les axes', () => {
    const script = fs.readFileSync('src/games/flex-builder/builder.js', 'utf8');
    const controlsUpdate = script.match(/function updateControls\(\) \{([\s\S]*?)\n\}/)?.[1];
    const comparison = script.split("document.getElementById('check-layout').addEventListener('click', () => {")[1]?.split('\n});')[0];

    assert.ok(controlsUpdate);
    assert.ok(comparison);
    assert.doesNotMatch(controlsUpdate, /applyConfig\(liveTrack/);
    assert.match(comparison, /applyConfig\(liveTrack, state\)/);
    assert.match(script, /Axe principal · \$\{row \? 'horizontal' : 'vertical'\}/);
    assert.match(script, /Axe secondaire · \$\{row \? 'vertical' : 'horizontal'\}/);
});

test('Grid Debugger propose huit corrections avec les propriétés du cours', () => {
    const script = fs.readFileSync('src/games/grid-debugger/debugger.js', 'utf8');
    const missionBlock = script.match(/const missions = \[([\s\S]*?)\n\];/)?.[1];

    assert.ok(missionBlock);
    assert.equal([...missionBlock.matchAll(/title:/g)].length, 8);
    assert.doesNotMatch(missionBlock, /grid-template-areas|grid-auto|auto-fit|minmax/);
    assert.match(missionBlock, /display: grid/);
    assert.match(missionBlock, /grid-column: \d+ \/ \d+/);
    assert.match(missionBlock, /grid-row: \d+ \/ \d+/);
    assert.match(missionBlock, /gap: (?:8|12)px/);
    assert.match(script, /function checkMission\(\)/);
    assert.match(script, /layoutMatches\(mission\)/);
});

test('Grid infini couvre les trois familles et borne les pistes à cinq', () => {
    const script = fs.readFileSync('src/games/grid-infinite/infinite.js', 'utf8');
    const html = fs.readFileSync('src/games/grid-infinite/infinite.html', 'utf8');
    const css = fs.readFileSync('src/games/grid-infinite/infinite.css', 'utf8');

    assert.match(script, /const cycleTypes = \['tracks', 'placements', 'areas'\]/);
    assert.match(script, /function nextCycleType\(\)/);
    assert.match(script, /cyclesCompleted === 0 \? \[\.\.\.cycleTypes\] : shuffle\(cycleTypes\)/);
    assert.match(script, /randomInt\(2, 5\)/);
    assert.match(script, /gridTemplateAreas/);
    assert.match(script, /gridColumn/);
    assert.match(script, /gridRow/);
    assert.match(script, /function renderLineMarkers\(\)/);
    assert.match(script, /marker\.offsetWidth/);
    assert.match(script, /areaName\.textContent = piece\.area/);
    assert.doesNotMatch(script, /grid-auto|auto-fit|minmax|flex-wrap|align-content/);
    assert.match(script, /localStorage\.setItem\(GRID_BEST_KEY/);
    assert.match(script, /score\+\+/);
    assert.match(html, /id="target-line-markers"/);
    assert.match(html, /id="challenge-instruction"/);
    assert.match(html, /class="grid-preview-subtitle"/);
    assert.match(css, /box-shadow: inset 0 0 0 1px/);
});

test('les défis Grid de placement par lignes restent dans le programme S10', () => {
    const { levels } = loadGame(
        'src/games/grid/grid.html',
        'src/games/grid/grid-atelier.js'
    );

    assert.match(levels[5].expected[0], /grid-column: 1 \/ 3/);
    assert.match(levels[6].expected[0], /grid-row: 1 \/ 3/);
    assert.ok(levels.slice(5, 13).every(level => !level.advanced));
    assert.equal(levels[13].advanced, true);
    assert.match(levels[8].expected[0], /#puzzle-a/);
    assert.match(levels[11].expected[0], /#puzzle-d/);
});

test('l’atelier Grid vérifie les déclarations sans dépendre des espaces', () => {
    const { context, elements, levels } = loadGame(
        'src/games/grid/grid.html',
        'src/games/grid/grid-atelier.js'
    );

    assert.equal(levels.length, 30);
    assert.ok(levels.every(level => level.expected.length > 0 && typeof level.validate === 'function'));
    elements.get('code-input').value = '#grid {\n  DISPLAY : GRID;\n}';
    assert.equal(vm.runInContext('checkExpected(levels[0])', context), true);
});

test('chaque jeu présente les niveaux du cours avant les approfondissements', () => {
    const games = [
        ['src/games/identify/identify.html', 'src/games/identify/identify-script.js'],
        ['src/games/find-error/find-error.html', 'src/games/find-error/find-error-script.js'],
        ['src/games/quiz/quiz.html', 'src/games/quiz/quiz-script.js'],
        ['src/games/html/html.html', 'src/games/html/html-script.js'],
        ['src/games/styles/styles.html', 'src/games/styles/styles-script.js'],
        ['src/games/flex/flex.html', 'src/games/flex/flex.js'],
        ['src/games/grid/grid.html', 'src/games/grid/grid-atelier.js']
    ];

    games.forEach(([htmlPath, scriptPath]) => {
        const { levels } = loadGame(htmlPath, scriptPath);
        const firstAdvanced = levels.findIndex(level => level.advanced);
        assert.ok(levels.slice(firstAdvanced).every(level => level.advanced), scriptPath);
        levels.forEach((level, index) => {
            if (level.text?.startsWith('Niveau')) assert.match(level.text, new RegExp(`^Niveau ${index + 1} :`), scriptPath);
        });
    });
});

test('les niveaux Grid hors programme portent un marqueur visible', () => {
    const { context, elements, levels } = loadGame(
        'src/games/grid/grid.html',
        'src/games/grid/grid-atelier.js'
    );
    const advancedIndex = levels.findIndex(level => level.advanced);

    assert.ok(advancedIndex >= 0);
    vm.runInContext(`currentLevel = ${advancedIndex}; updateLevel();`, context);
    assert.match(elements.get('level-text').textContent, /^Approfondissement —/);
    assert.ok(elements.get('level-list').children.some(child => child.textContent.includes('Approfondissement')));
    assert.ok(elements.get('level-list').children.some(child => child.textContent === `Niveau ${advancedIndex + 1} *`));
});

test('les défis CSS contextuels utilisent des cibles adaptées à la propriété', () => {
    const html = fs.readFileSync('src/games/styles/styles.html', 'utf8');
    const css = fs.readFileSync('src/style/global.css', 'utf8');
    const { context, elements, levels } = loadGame(
        'src/games/styles/styles.html',
        'src/games/styles/styles-script.js'
    );
    const targets = [
        ['z-index', 'css-layer-target', 'DIV'],
        ['flex', 'css-flex-target', 'DIV'],
        ['grid-template-columns', 'css-target', 'DIV'],
        ['vertical-align', 'css-inline-target', 'SPAN'],
        ['list-style', 'css-list-target', 'UL'],
        ['border-collapse', 'css-table-target', 'TABLE']
    ];

    targets.forEach(([property, id, tag]) => {
        const index = levels.findIndex(level => level.property === property);
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
