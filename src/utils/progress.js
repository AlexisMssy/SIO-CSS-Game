// Progression commune à tous les jeux : XP, série de jours, succès, activité.
// Logique pure : chaque fonction reçoit l'état et renvoie un nouvel état ; la date est injectable.
// Les identifiants de jeux et de niveaux viennent de l'appelant (catalogue).
// Règles : specs/refonte.md, §4 et Décisions du §6.

const SioProgress = (() => {
    const STORAGE_KEY = 'sio-progress-v1';
    const VERSION = 1;
    const INFINITE_DAILY_XP_CAP = 5;
    const ACTIVITY_DAYS = 28;

    // Anciennes clés par position, effacées à la première visite (migration).
    const LEGACY_PREFIXES = ['identify-code', 'code-quiz', 'find-error', 'html-tags', 'styles', 'selectors', 'flexbox', 'grid-atelier'];
    const LEGACY_KEYS = LEGACY_PREFIXES.flatMap(prefix => ['done', 'progress', 'codes'].map(suffix => `${prefix}_${suffix}`));

    // Intensités de la grille d'activité.
    const ACTIVE = 1;
    const STREAK_DAY = 2;

    // Ordre du tableau = ordre d'affichage du « prochain succès ».
    const ACHIEVEMENTS = [
        { id: 'init', message: 'init: premier niveau réussi', condition: '1 niveau réussi, tous jeux confondus',
            check: ctx => Object.values(ctx.state.done).some(levels => levels.length > 0) },
        { id: 'first-advanced', message: 'feat: premier approfondissement', condition: '1 niveau advanced réussi',
            check: ctx => ctx.catalogue.games.some(game => game.levels.some(level => level.advanced && isDone(ctx.state, game.id, level.id))) },
        { id: 'first-game', message: 'feat: premier jeu terminé', condition: '1 jeu au statut PASS',
            check: ctx => ctx.catalogue.games.some(game => gameStatus(ctx.state, game) === 'PASS') },
        { id: 'chapter-fondamentaux', message: 'release: chapitre Fondamentaux', condition: 'tous les jeux Fondamentaux en PASS',
            check: ctx => chapterPassed(ctx, 'fondamentaux') },
        { id: 'chapter-flexbox', message: 'release: chapitre Flexbox', condition: 'tous les jeux Flexbox en PASS',
            check: ctx => chapterPassed(ctx, 'flexbox') },
        { id: 'chapter-grid', message: 'release: chapitre Grid', condition: 'tous les jeux Grid à niveaux en PASS (Grid infini exclu)',
            check: ctx => chapterPassed(ctx, 'grid') },
        { id: 'streak-3', message: 'streak: 3 jours', condition: 'série ≥ 3', check: ctx => ctx.state.streak >= 3 },
        { id: 'streak-7', message: 'streak: 7 jours', condition: 'série ≥ 7', check: ctx => ctx.state.streak >= 7 }
    ];

    function createState() {
        return {
            version: VERSION,
            done: {},       // niveaux réussis par jeu (effacés par « Recommencer »)
            everDone: {},   // niveaux déjà réussis au moins une fois (jamais effacés)
            xp: 0,
            streak: 0,
            bestStreak: 0,
            lastStreakDay: null,
            achievements: [], // { id, date }, dans l'ordre d'obtention
            activity: {},     // { 'AAAA-MM-JJ': ACTIVE | STREAK_DAY }
            infinite: { day: null, xp: 0 },
            lastGame: null
        };
    }

    function clone(state) {
        return JSON.parse(JSON.stringify(state));
    }

    // Date locale du navigateur au format AAAA-MM-JJ.
    function toDay(date) {
        const pad = value => String(value).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    // Écart en jours de calendrier (insensible aux changements d'heure).
    function daysBetween(fromDay, toDayValue) {
        const [y1, m1, d1] = fromDay.split('-').map(Number);
        const [y2, m2, d2] = toDayValue.split('-').map(Number);
        return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
    }

    function isDone(state, gameId, levelId) {
        return (state.done[gameId] || []).includes(levelId);
    }

    function gameStatus(state, game) {
        const courseLevels = game.levels.filter(level => !level.advanced);
        const doneCount = game.levels.filter(level => isDone(state, game.id, level.id)).length;
        if (doneCount === 0) return 'TODO';
        return courseLevels.every(level => isDone(state, game.id, level.id)) ? 'PASS' : 'RUNS';
    }

    function chapterPassed(ctx, chapter) {
        const games = ctx.catalogue.games.filter(game => game.chapter === chapter);
        return games.length > 0 && games.every(game => gameStatus(ctx.state, game) === 'PASS');
    }

    function markActivity(state, day, intensity) {
        state.activity[day] = Math.max(state.activity[day] || 0, intensity);
    }

    function unlockAchievements(state, catalogue, day) {
        const ctx = { state, catalogue };
        for (const achievement of ACHIEVEMENTS) {
            const owned = state.achievements.some(entry => entry.id === achievement.id);
            if (!owned && achievement.check(ctx)) state.achievements.push({ id: achievement.id, date: day });
        }
    }

    function recordLevelSuccess(previous, { gameId, levelId }, catalogue, now = new Date()) {
        const game = catalogue.games.find(item => item.id === gameId);
        if (!game || !game.levels.some(level => level.id === levelId)) {
            throw new Error(`Niveau inconnu dans le catalogue : ${gameId} / ${levelId}`);
        }
        const state = clone(previous);
        const day = toDay(now);
        // XP : seulement la toute première réussite. Série : toute réussite d'un niveau
        // non marqué réussi, y compris après « Recommencer » (décision de l'enseignant).
        const firstSuccess = !(state.everDone[gameId] || []).includes(levelId);
        const newSuccess = !isDone(state, gameId, levelId);

        if (newSuccess) state.done[gameId] = [...(state.done[gameId] || []), levelId];
        state.lastGame = gameId;

        if (firstSuccess) {
            state.everDone[gameId] = [...(state.everDone[gameId] || []), levelId];
            state.xp += 1;
        }
        if (newSuccess) {
            if (state.lastStreakDay !== day) {
                const continues = state.lastStreakDay !== null && daysBetween(state.lastStreakDay, day) === 1;
                state.streak = continues ? state.streak + 1 : 1;
                state.lastStreakDay = day;
                state.bestStreak = Math.max(state.bestStreak, state.streak);
            }
            markActivity(state, day, STREAK_DAY);
        } else {
            markActivity(state, day, ACTIVE);
        }

        unlockAchievements(state, catalogue, day);
        return state;
    }

    // Grid infini : +1 XP par grille, plafonné par jour ; ne compte pas pour la série.
    function recordInfiniteSuccess(previous, now = new Date()) {
        const state = clone(previous);
        const day = toDay(now);
        if (state.infinite.day !== day) state.infinite = { day, xp: 0 };
        if (state.infinite.xp < INFINITE_DAILY_XP_CAP) {
            state.infinite.xp += 1;
            state.xp += 1;
        }
        markActivity(state, day, ACTIVE);
        return state;
    }

    // Série affichée : 0 dès qu'un jour complet s'est écoulé sans réussite.
    function displayedStreak(state, now = new Date()) {
        if (state.lastStreakDay === null) return 0;
        return daysBetween(state.lastStreakDay, toDay(now)) <= 1 ? state.streak : 0;
    }

    // Succès obtenus, du plus récent au plus ancien.
    function achievementLog(state) {
        return state.achievements.slice().reverse().map(entry => ({
            id: entry.id,
            message: ACHIEVEMENTS.find(achievement => achievement.id === entry.id).message,
            date: entry.date
        }));
    }

    // Premier succès non obtenu dans l'ordre du tableau, ou null.
    function nextAchievement(state) {
        const next = ACHIEVEMENTS.find(achievement => !state.achievements.some(entry => entry.id === achievement.id));
        return next ? { id: next.id, condition: next.condition } : null;
    }

    // Les `days` derniers jours, du plus ancien à aujourd'hui : intensité 0, 1 (activité) ou 2 (série).
    function activity(state, now = new Date(), days = ACTIVITY_DAYS) {
        const result = [];
        for (let offset = days - 1; offset >= 0; offset--) {
            const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
            const day = toDay(date);
            result.push({ day, intensity: state.activity[day] || 0 });
        }
        return result;
    }

    // « Recommencer » : efface les niveaux réussis de ce jeu ; XP, série, record et succès restent.
    function resetGame(previous, gameId) {
        const state = clone(previous);
        delete state.done[gameId];
        return state;
    }

    function loadProgress(storage = localStorage) {
        let raw;
        try {
            raw = storage.getItem(STORAGE_KEY);
        } catch {
            return createState();
        }
        if (raw === null) {
            // Première visite avec la clé commune : les anciennes progressions par position sont remises à zéro.
            const state = createState();
            try {
                LEGACY_KEYS.forEach(key => storage.removeItem(key));
            } catch {
                // stockage inaccessible : rien à migrer
            }
            saveProgress(state, storage);
            return state;
        }
        try {
            const state = JSON.parse(raw);
            return state && state.version === VERSION ? state : createState();
        } catch {
            return createState();
        }
    }

    function saveProgress(state, storage = localStorage) {
        try {
            storage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // stockage plein ou bloqué : la partie continue sans sauvegarde
        }
    }

    return {
        STORAGE_KEY,
        INFINITE_DAILY_XP_CAP,
        createState,
        recordLevelSuccess,
        recordInfiniteSuccess,
        displayedStreak,
        gameStatus,
        achievementLog,
        nextAchievement,
        activity,
        resetGame,
        loadProgress,
        saveProgress
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SioProgress;
}
