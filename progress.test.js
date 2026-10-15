// Fuseau fixé : le scénario « Vacances » traverse le passage à l'heure d'hiver (25 octobre 2026).
process.env.TZ = 'Europe/Paris';

const { test } = require('node:test');
const assert = require('node:assert/strict');

// Le module est chargé sans faire échouer tout le fichier s'il n'existe pas encore :
// chaque test échoue alors séparément (fonction absente).
let progress = {};
try {
    progress = require('./src/utils/progress.js');
} catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
}

const CATALOGUE = {
    games: [
        { id: 'identify', chapter: 'fondamentaux', levels: [{ id: 'balise' }, { id: 'propriete' }, { id: 'bonus', advanced: true }] },
        { id: 'quiz', chapter: 'fondamentaux', levels: [{ id: 'lecture' }] },
        { id: 'flex', chapter: 'flexbox', levels: [{ id: 'flex-direction' }, { id: 'flex-wrap' }, { id: 'order', advanced: true }] },
        { id: 'grid', chapter: 'grid', levels: [{ id: 'colonnes' }, { id: 'zones', advanced: true }] },
        { id: 'entrainement', chapter: 'autre', levels: Array.from({ length: 40 }, (_, i) => ({ id: `n${i}` })) }
    ]
};

function game(id) {
    return CATALOGUE.games.find(item => item.id === id);
}

// Date locale du mois d'octobre 2026 (mois optionnel), en milieu de journée par défaut.
function at(dayOfMonth, month = 10, hour = 14, minute = 0) {
    return new Date(2026, month - 1, dayOfMonth, hour, minute);
}

function succeed(state, gameId, levelId, date) {
    return progress.recordLevelSuccess(state, { gameId, levelId }, CATALOGUE, date);
}

let trainingCounter = 0;
// Série de `length` jours consécutifs se terminant à `lastDate`, chaque jour une première réussite.
function withStreak(length, lastDate, state = progress.createState()) {
    for (let offset = length - 1; offset >= 0; offset--) {
        const date = new Date(lastDate);
        date.setDate(date.getDate() - offset);
        state = succeed(state, 'entrainement', `n${trainingCounter++ % 40}`, date);
    }
    return state;
}

function fakeStorage(initial = {}) {
    const data = new Map(Object.entries(initial));
    return {
        data,
        getItem: key => (data.has(key) ? data.get(key) : null),
        setItem: (key, value) => data.set(key, String(value)),
        removeItem: key => data.delete(key)
    };
}

function achievementIds(state) {
    return progress.achievementLog(state).map(entry => entry.id);
}

// ---------- Scénarios du §5.1 ----------

test('§5.1 Normal : série de 3 jusqu’au jeudi 15, réussite le vendredi 16 → série 4', () => {
    let state = withStreak(3, at(15));
    assert.equal(progress.displayedStreak(state, at(15)), 3);
    state = succeed(state, 'flex', 'flex-direction', at(16));
    assert.equal(progress.displayedStreak(state, at(16)), 4);
});

test('§5.1 Même jour : série de 4 avec réussite le vendredi 16, autre niveau le même jour → série 4', () => {
    let state = withStreak(4, at(16, 10, 9));
    assert.equal(progress.displayedStreak(state, at(16)), 4);
    state = succeed(state, 'flex', 'flex-direction', at(16, 10, 17));
    assert.equal(progress.displayedStreak(state, at(16, 10, 17)), 4);
});

test('§5.1 Week-end : série de 4 au vendredi 16, rien samedi ni dimanche, réussite lundi 19 → série 1', () => {
    let state = withStreak(4, at(16));
    state = succeed(state, 'flex', 'flex-direction', at(19));
    assert.equal(progress.displayedStreak(state, at(19)), 1);
});

test('§5.1 Vacances : série de 10 au vendredi 16, réussite lundi 2 novembre → série 1, record 10', () => {
    let state = withStreak(10, at(16));
    state = succeed(state, 'flex', 'flex-direction', at(2, 11));
    assert.equal(progress.displayedStreak(state, at(2, 11)), 1);
    assert.equal(state.bestStreak, 10);
});

test('§5.1 Rejouer : seulement flex-wrap (déjà réussi) et deux grilles le vendredi → série 0 le samedi, +2 XP', () => {
    let state = succeed(progress.createState(), 'flex', 'flex-wrap', at(14));
    state = succeed(state, 'quiz', 'lecture', at(15));
    assert.equal(progress.displayedStreak(state, at(15)), 2);
    const xpBefore = state.xp;

    state = succeed(state, 'flex', 'flex-wrap', at(16, 10, 10));
    state = progress.recordInfiniteSuccess(state, at(16, 10, 11));
    state = progress.recordInfiniteSuccess(state, at(16, 10, 12));

    assert.equal(progress.displayedStreak(state, at(16, 10, 20)), 2, 'le vendredi, la série du jeudi tient encore');
    assert.equal(progress.displayedStreak(state, at(17)), 0);
    assert.equal(state.xp, xpBefore + 2);
});

test('§5.1 Affichage sans jouer : série de 4 au vendredi 16, ouverture le dimanche 18 → série affichée 0', () => {
    const state = withStreak(4, at(16));
    assert.equal(progress.displayedStreak(state, at(18)), 0);
});

// ---------- §4 : XP ----------

test('XP : +1 à la première réussite, rien en rejouant', () => {
    let state = progress.createState();
    assert.equal(state.xp, 0);
    state = succeed(state, 'flex', 'flex-direction', at(16));
    assert.equal(state.xp, 1);
    state = succeed(state, 'flex', 'flex-direction', at(16));
    state = succeed(state, 'flex', 'flex-direction', at(20));
    assert.equal(state.xp, 1);
});

test('XP : un approfondissement rapporte aussi +1', () => {
    const state = succeed(progress.createState(), 'flex', 'order', at(16));
    assert.equal(state.xp, 1);
});

test('XP : un même id dans deux jeux différents compte deux fois (id unique dans son jeu)', () => {
    const catalogue = {
        games: [
            { id: 'a', chapter: 'autre', levels: [{ id: 'intro' }] },
            { id: 'b', chapter: 'autre', levels: [{ id: 'intro' }] }
        ]
    };
    let state = progress.recordLevelSuccess(progress.createState(), { gameId: 'a', levelId: 'intro' }, catalogue, at(16));
    state = progress.recordLevelSuccess(state, { gameId: 'b', levelId: 'intro' }, catalogue, at(16));
    assert.equal(state.xp, 2);
});

test('XP : un niveau absent du catalogue est refusé (erreur d’identifiant)', () => {
    const state = typeof progress.createState === 'function' ? progress.createState() : {};
    assert.throws(() => succeed(state, 'flex', 'inconnu', at(16)), /flex.*inconnu/);
});

test('Grid infini : +1 XP par grille, plafonné à 5 XP par jour (date locale)', () => {
    let state = progress.createState();
    for (let i = 0; i < 7; i++) state = progress.recordInfiniteSuccess(state, at(16, 10, 10 + i));
    assert.equal(state.xp, 5);
    state = progress.recordInfiniteSuccess(state, at(16, 10, 23, 59));
    assert.equal(state.xp, 5, 'toujours le 16 à 23 h 59');
    state = progress.recordInfiniteSuccess(state, at(17, 10, 0, 1));
    assert.equal(state.xp, 6, 'nouveau jour à 0 h 01');
});

test('Grid infini : ne compte ni pour la série, ni pour « init », ni comme dernier jeu joué', () => {
    let state = progress.recordInfiniteSuccess(progress.createState(), at(16));
    assert.equal(progress.displayedStreak(state, at(16)), 0);
    assert.deepEqual(achievementIds(state), []);
    assert.equal(state.lastGame, null);
});

// ---------- §4 : série ----------

test('Série : le lendemain du dernier jour réussi, sans rejouer, la série est encore affichée', () => {
    const state = withStreak(4, at(16));
    assert.equal(progress.displayedStreak(state, at(17, 10, 23, 59)), 4);
});

test('Série : jours consécutifs même à quelques minutes d’écart autour de minuit', () => {
    let state = succeed(progress.createState(), 'flex', 'flex-direction', at(16, 10, 23, 58));
    state = succeed(state, 'flex', 'flex-wrap', at(17, 10, 0, 2));
    assert.equal(progress.displayedStreak(state, at(17)), 2);
});

test('Série : sans aucune réussite, elle vaut 0 et le record 0', () => {
    const state = progress.createState();
    assert.equal(progress.displayedStreak(state, at(16)), 0);
    assert.equal(state.bestStreak, 0);
});

test('Série : le record suit la meilleure série et ne baisse jamais', () => {
    let state = withStreak(3, at(10));
    assert.equal(state.bestStreak, 3);
    state = withStreak(2, at(20), state);
    assert.equal(state.bestStreak, 3);
    state = withStreak(5, at(26), state); // du 22 au 26 : le 21 sans réussite casse la série
    assert.equal(state.bestStreak, 5);
});

// ---------- §4 : statuts ----------

test('Statut : TODO sans aucun niveau réussi', () => {
    assert.equal(progress.gameStatus(progress.createState(), game('identify')), 'TODO');
});

test('Statut : RUNS avec une partie des niveaux du cours', () => {
    const state = succeed(progress.createState(), 'identify', 'balise', at(16));
    assert.equal(progress.gameStatus(state, game('identify')), 'RUNS');
});

test('Statut : RUNS avec seulement un approfondissement réussi', () => {
    const state = succeed(progress.createState(), 'identify', 'bonus', at(16));
    assert.equal(progress.gameStatus(state, game('identify')), 'RUNS');
});

test('Statut : PASS avec tous les niveaux du cours, approfondissements non requis', () => {
    let state = succeed(progress.createState(), 'identify', 'balise', at(16));
    state = succeed(state, 'identify', 'propriete', at(16));
    assert.equal(progress.gameStatus(state, game('identify')), 'PASS');
});

test('Statut : les réussites d’un autre jeu ne comptent pas', () => {
    const state = succeed(progress.createState(), 'quiz', 'lecture', at(16));
    assert.equal(progress.gameStatus(state, game('quiz')), 'PASS');
    assert.equal(progress.gameStatus(state, game('identify')), 'TODO');
});

// ---------- §4 : succès ----------

test('Succès : init et premier approfondissement, datés du jour d’obtention', () => {
    let state = succeed(progress.createState(), 'flex', 'flex-direction', at(14));
    assert.deepEqual(progress.achievementLog(state), [
        { id: 'init', message: 'init: premier niveau réussi', date: '2026-10-14' }
    ]);
    state = succeed(state, 'flex', 'order', at(16));
    assert.deepEqual(progress.achievementLog(state)[0], {
        id: 'first-advanced', message: 'feat: premier approfondissement', date: '2026-10-16'
    });
});

test('Succès : premier jeu terminé quand un jeu passe en PASS', () => {
    let state = succeed(progress.createState(), 'identify', 'balise', at(16));
    assert.ok(!achievementIds(state).includes('first-game'));
    state = succeed(state, 'identify', 'propriete', at(16));
    assert.ok(achievementIds(state).includes('first-game'));
});

test('Succès : chapitre Fondamentaux quand tous ses jeux sont en PASS', () => {
    let state = succeed(progress.createState(), 'identify', 'balise', at(16));
    state = succeed(state, 'identify', 'propriete', at(16));
    assert.ok(!achievementIds(state).includes('chapter-fondamentaux'));
    state = succeed(state, 'quiz', 'lecture', at(17));
    const entry = progress.achievementLog(state).find(item => item.id === 'chapter-fondamentaux');
    assert.deepEqual(entry, { id: 'chapter-fondamentaux', message: 'release: chapitre Fondamentaux', date: '2026-10-17' });
});

test('Succès : chapitre Flexbox', () => {
    let state = succeed(progress.createState(), 'flex', 'flex-direction', at(16));
    state = succeed(state, 'flex', 'flex-wrap', at(16));
    assert.ok(achievementIds(state).includes('chapter-flexbox'));
    assert.equal(progress.achievementLog(state).find(item => item.id === 'chapter-flexbox').message, 'release: chapitre Flexbox');
});

test('Succès : chapitre Grid sans aucune grille de Grid infini', () => {
    const state = succeed(progress.createState(), 'grid', 'colonnes', at(16));
    assert.ok(achievementIds(state).includes('chapter-grid'));
    assert.equal(progress.achievementLog(state).find(item => item.id === 'chapter-grid').message, 'release: chapitre Grid');
});

test('Succès : streak 3 et streak 7 jours', () => {
    let state = withStreak(2, at(10));
    assert.ok(!achievementIds(state).includes('streak-3'));
    state = withStreak(3, at(12), progress.createState());
    assert.ok(achievementIds(state).includes('streak-3'));
    assert.ok(!achievementIds(state).includes('streak-7'));
    state = withStreak(7, at(20));
    const log = progress.achievementLog(state);
    assert.deepEqual(log.find(item => item.id === 'streak-3'), { id: 'streak-3', message: 'streak: 3 jours', date: '2026-10-16' });
    assert.deepEqual(log.find(item => item.id === 'streak-7'), { id: 'streak-7', message: 'streak: 7 jours', date: '2026-10-20' });
});

test('Succès : obtenu une seule fois, même si la condition se remplit à nouveau', () => {
    let state = withStreak(3, at(10));
    state = withStreak(3, at(20), state);
    state = succeed(state, 'flex', 'order', at(21));
    state = succeed(state, 'grid', 'zones', at(22));
    const ids = achievementIds(state);
    assert.equal(ids.filter(id => id === 'streak-3').length, 1);
    assert.equal(ids.filter(id => id === 'first-advanced').length, 1);
    assert.equal(ids.filter(id => id === 'init').length, 1);
    assert.equal(progress.achievementLog(state).find(item => item.id === 'streak-3').date, '2026-10-10');
});

test('Succès : affichés du plus récent au plus ancien (le dernier obtenu en premier le même jour)', () => {
    let state = succeed(progress.createState(), 'grid', 'colonnes', at(14));
    state = succeed(state, 'flex', 'order', at(16));
    assert.deepEqual(achievementIds(state), ['first-advanced', 'chapter-grid', 'first-game', 'init']);
});

test('Succès : jamais perdus, même après Recommencer', () => {
    let state = succeed(progress.createState(), 'quiz', 'lecture', at(16));
    const before = progress.achievementLog(state);
    state = progress.resetGame(state, 'quiz');
    assert.deepEqual(progress.achievementLog(state), before);
});

// ---------- Décisions : prochain succès ----------

test('Prochain succès : le premier non obtenu dans l’ordre du tableau, avec sa condition', () => {
    let state = progress.createState();
    assert.deepEqual(progress.nextAchievement(state), { id: 'init', condition: '1 niveau réussi, tous jeux confondus' });
    state = succeed(state, 'grid', 'colonnes', at(16));
    // init, premier jeu et chapitre Grid obtenus ; le premier manquant du tableau est l'approfondissement.
    assert.deepEqual(progress.nextAchievement(state), { id: 'first-advanced', condition: '1 niveau advanced réussi' });
});

test('Prochain succès : aucun quand tous sont obtenus', () => {
    let state = withStreak(7, at(10));
    for (const item of CATALOGUE.games) {
        for (const level of item.levels) state = succeed(state, item.id, level.id, at(11));
    }
    assert.equal(progress.nextAchievement(state), null);
});

// ---------- Décisions : activité ----------

test('Activité : 28 jours, du plus ancien à aujourd’hui, vides au départ', () => {
    const days = progress.activity(progress.createState(), at(16));
    assert.equal(days.length, 28);
    assert.equal(days[0].day, '2026-09-19');
    assert.equal(days[27].day, '2026-10-16');
    assert.ok(days.every(entry => entry.intensity === 0));
});

test('Activité : 2 pour un jour qui compte pour la série, 1 pour un rejeu ou Grid infini seuls', () => {
    let state = succeed(progress.createState(), 'flex', 'flex-direction', at(13));
    state = succeed(state, 'flex', 'flex-direction', at(14));
    state = progress.recordInfiniteSuccess(state, at(15));
    for (let i = 0; i < 6; i++) state = progress.recordInfiniteSuccess(state, at(16)); // au-delà du plafond aussi
    const byDay = Object.fromEntries(progress.activity(state, at(17)).map(entry => [entry.day, entry.intensity]));
    assert.equal(byDay['2026-10-12'], 0);
    assert.equal(byDay['2026-10-13'], 2);
    assert.equal(byDay['2026-10-14'], 1);
    assert.equal(byDay['2026-10-15'], 1);
    assert.equal(byDay['2026-10-16'], 1);
    assert.equal(byDay['2026-10-17'], 0);
});

test('Activité : un jour d’abord simple activité passe à 2 après une première réussite', () => {
    let state = progress.recordInfiniteSuccess(progress.createState(), at(16, 10, 9));
    state = succeed(state, 'flex', 'flex-wrap', at(16, 10, 15));
    state = progress.recordInfiniteSuccess(state, at(16, 10, 16));
    assert.equal(progress.activity(state, at(16)).at(-1).intensity, 2);
});

// ---------- Dernier jeu joué ----------

test('Dernier jeu joué : mis à jour à chaque réussite, rejeux compris', () => {
    let state = progress.createState();
    assert.equal(state.lastGame, null);
    state = succeed(state, 'flex', 'flex-wrap', at(16));
    state = succeed(state, 'quiz', 'lecture', at(16));
    assert.equal(state.lastGame, 'quiz');
    state = succeed(state, 'flex', 'flex-wrap', at(16));
    assert.equal(state.lastGame, 'flex');
    state = progress.recordInfiniteSuccess(state, at(16));
    assert.equal(state.lastGame, 'flex');
});

// ---------- Décisions : bouton Recommencer ----------

test('Recommencer : efface les niveaux réussis de ce jeu seulement', () => {
    let state = succeed(progress.createState(), 'flex', 'flex-direction', at(16));
    state = succeed(state, 'flex', 'flex-wrap', at(16));
    state = succeed(state, 'quiz', 'lecture', at(16));
    state = progress.resetGame(state, 'flex');
    assert.equal(progress.gameStatus(state, game('flex')), 'TODO');
    assert.equal(progress.gameStatus(state, game('quiz')), 'PASS');
});

test('Recommencer : XP, série, record et succès conservés', () => {
    let state = withStreak(4, at(16));
    state = succeed(state, 'flex', 'flex-wrap', at(16));
    const { xp, bestStreak } = state;
    const log = progress.achievementLog(state);
    state = progress.resetGame(state, 'flex');
    state = progress.resetGame(state, 'entrainement');
    assert.equal(state.xp, xp);
    assert.equal(state.bestStreak, bestStreak);
    assert.equal(progress.displayedStreak(state, at(16)), 4);
    assert.deepEqual(progress.achievementLog(state), log);
});

test('Recommencer : réussir à nouveau un niveau effacé compte pour la série, sans XP', () => {
    let state = succeed(progress.createState(), 'flex', 'flex-wrap', at(15));
    state = progress.resetGame(state, 'flex');
    const xp = state.xp;
    state = succeed(state, 'flex', 'flex-wrap', at(16));
    assert.equal(state.xp, xp);
    assert.equal(progress.displayedStreak(state, at(16)), 2);
    assert.equal(progress.gameStatus(state, game('flex')), 'RUNS', 'le niveau est de nouveau marqué réussi');
    assert.equal(progress.activity(state, at(16)).at(-1).intensity, 2);
});

test('Recommencer : rejouer un niveau déjà réussi depuis le dernier Recommencer ne compte toujours pas', () => {
    let state = succeed(progress.createState(), 'flex', 'flex-wrap', at(15));
    state = progress.resetGame(state, 'flex');
    state = succeed(state, 'flex', 'flex-wrap', at(16));
    state = succeed(state, 'flex', 'flex-wrap', at(17));
    assert.equal(progress.displayedStreak(state, at(18)), 0);
    assert.equal(progress.activity(state, at(17)).at(-1).intensity, 1);
});

// ---------- §4 : stockage et migration ----------

const LEGACY_PREFIXES = ['identify-code', 'code-quiz', 'find-error', 'html-tags', 'styles', 'selectors', 'flexbox', 'grid-atelier'];
const LEGACY_KEYS = LEGACY_PREFIXES.flatMap(prefix => ['done', 'progress', 'codes'].map(suffix => `${prefix}_${suffix}`));

test('Stockage : une clé unique et versionnée', () => {
    assert.equal(progress.STORAGE_KEY, 'sio-progress-v1');
    const storage = fakeStorage();
    let state = succeed(progress.createState(), 'flex', 'flex-wrap', at(16));
    progress.saveProgress(state, storage);
    assert.deepEqual([...storage.data.keys()], ['sio-progress-v1']);
    assert.equal(JSON.parse(storage.getItem('sio-progress-v1')).version, 1);
    assert.deepEqual(progress.loadProgress(storage), state);
});

test('Stockage : contenu illisible ou d’une autre version → progression vide, sans erreur', () => {
    assert.deepEqual(progress.loadProgress(fakeStorage({ 'sio-progress-v1': '{pas du json' })), progress.createState());
    assert.deepEqual(progress.loadProgress(fakeStorage({ 'sio-progress-v1': '{"version":2,"xp":99}' })), progress.createState());
});

test('Stockage : localStorage inaccessible → progression vide, sans erreur', () => {
    const broken = { getItem() { throw new Error('bloqué'); }, setItem() { throw new Error('bloqué'); }, removeItem() { throw new Error('bloqué'); } };
    assert.deepEqual(progress.loadProgress(broken), progress.createState());
    assert.doesNotThrow(() => progress.saveProgress(progress.createState(), broken));
});

test('Migration : au premier chargement, les anciennes clés par position des 8 jeux sont effacées', () => {
    const initial = Object.fromEntries(LEGACY_KEYS.map(key => [key, '[0,1]']));
    Object.assign(initial, {
        'grid-infinite-best': '12',
        'grid-infinite-score': '3',
        mq_progress: '{}',
        mq_done_levels: '[0]',
        bootstrap_done: '[0]',
        autre: 'x'
    });
    const storage = fakeStorage(initial);
    const state = progress.loadProgress(storage);
    assert.deepEqual(state, progress.createState(), 'anciennes progressions remises à zéro');
    for (const key of LEGACY_KEYS) assert.equal(storage.getItem(key), null, key);
    for (const key of ['grid-infinite-best', 'grid-infinite-score', 'mq_progress', 'mq_done_levels', 'bootstrap_done', 'autre']) {
        assert.equal(storage.getItem(key), initial[key], key);
    }
    assert.notEqual(storage.getItem('sio-progress-v1'), null, 'la clé commune est créée');
});

test('Migration : une seule fois, les clés des jeux ne sont plus touchées ensuite', () => {
    const storage = fakeStorage({ flexbox_done: '[0]' });
    progress.loadProgress(storage);
    storage.setItem('flexbox_codes', '{"flex-wrap":"…"}');
    progress.loadProgress(storage);
    assert.equal(storage.getItem('flexbox_codes'), '{"flex-wrap":"…"}');
});
