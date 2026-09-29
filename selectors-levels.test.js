const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('src/games/selectors/selectors.html', 'utf8');
const script = fs.readFileSync('src/games/selectors/selectors-script.js', 'utf8');

function createGame() {
    const elements = new Map();
    const previewElements = [];
    const previewStart = html.indexOf('<section id="selector-preview"');
    const previewEnd = html.indexOf('</section>', previewStart);
    const previewHtml = html.slice(previewStart, previewEnd);

    function createElement(tag, attributes) {
        const id = attributes.match(/\bid="([^"]+)"/)?.[1];
        const classes = new Set((attributes.match(/\bclass="([^"]+)"/)?.[1] || '').split(/\s+/).filter(Boolean));
        return {
            id,
            tagName: tag.toUpperCase(),
            classes,
            classList: {
                add: name => classes.add(name),
                remove: name => classes.delete(name),
                contains: name => classes.has(name)
            },
            style: {},
            addEventListener() {},
            appendChild() {},
            querySelectorAll(selector) {
                return previewElements.filter(element => matches(element, selector));
            }
        };
    }

    function addElements(source, collection = null) {
        for (const [, tag, attributes] of source.matchAll(/<([a-z][a-z0-9]*)\b([^>]*)>/gi)) {
            const element = createElement(tag, attributes);
            if (element.id) elements.set(element.id, element);
            if (collection) collection.push(element);
        }
    }

    function matches(element, selector) {
        if (selector.startsWith('.')) return element.classes.has(selector.slice(1));
        if (selector.startsWith('#')) return element.id === selector.slice(1);
        return element.tagName.toLowerCase() === selector.toLowerCase();
    }

    addElements(html);
    addElements(previewHtml, previewElements);

    const storage = new Map();
    const context = vm.createContext({
        document: {
            getElementById: id => elements.get(id) || null,
            createElement: tag => createElement(tag, '')
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

test('les huit niveaux Sélecteurs acceptent leur réponse correcte', () => {
    const { context, elements, levels } = createGame();

    levels.forEach((level, index) => {
        const targets = level.targets.map(id => elements.get(id));
        assert.ok(targets.every(Boolean), `Niveau ${index + 1} : cible absente`);

        let answer;
        if (level.kind === 'tag') {
            answer = level.tag || targets[0].tagName.toLowerCase();
        } else if (level.kind === 'id') {
            answer = `#${targets[0].id}`;
        } else {
            const commonClass = [...targets[0].classes].find(name => targets.every(target => target.classes.has(name)));
            assert.ok(commonClass, `Niveau ${index + 1} : aucune classe commune aux cibles`);
            answer = `.${commonClass}`;
        }

        vm.runInContext(`selectLevel(${index})`, context);
        elements.get('selector-input').value = answer;
        vm.runInContext('testSelector()', context);
        assert.match(elements.get('status').textContent, /^Bravo/, `Niveau ${index + 1} refusé avec ${answer}`);
    });
});