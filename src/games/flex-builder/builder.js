const missions = [
    { title: 'La ligne de départ', description: 'Range trois pièces sur une ligne, au début de l’axe principal et au centre de l’axe secondaire.', count: 3, config: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '0px' } },
    { title: 'La composition centrale', description: 'Place trois pièces au centre avec un espace régulier de 12 px.', count: 3, config: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '12px' } },
    { title: 'Les quatre repères', description: 'Répartis quatre pièces sur toute la ligne, avec leurs centres alignés.', count: 4, config: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '0px' } },
    { title: 'La rangée supérieure', description: 'Centre quatre pièces sur l’axe principal et aligne-les au début de l’axe secondaire.', count: 4, config: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: '16px' } },
    { title: 'La colonne médiane', description: 'Empile trois pièces au centre, avec 8 px entre chacune.', count: 3, config: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '8px' } },
    { title: 'La colonne basse', description: 'Place trois pièces au bout des deux axes, avec un espace de 12 px.', count: 3, config: { flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', gap: '12px' } },
    { title: 'Le duo côté sortie', description: 'Range deux pièces à la fin de la ligne et au bord inférieur.', count: 2, config: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', gap: '0px' } },
    { title: 'La colonne répartie', description: 'Répartis quatre pièces du haut au bas de la colonne, au centre de l’axe secondaire.', count: 4, config: { flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gap: '0px' } }
];

const targetTrack = document.getElementById('target-track');
const liveTrack = document.getElementById('live-track');
const missionList = document.getElementById('mission-list');
const feedback = document.getElementById('builder-feedback');
const nextMission = document.getElementById('next-mission');
const cssOutput = document.getElementById('css-output');
const liveState = document.getElementById('live-state');
const completed = new Set();
const state = { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '16px' };
let currentMission = 0;

function addPieces(track, count) {
    track.replaceChildren();
    for (let index = 0; index < count; index++) {
        const piece = document.createElement('div');
        piece.className = 'layout-piece';
        piece.textContent = String.fromCharCode(65 + index);
        track.appendChild(piece);
    }
}

function applyConfig(track, config) {
    track.style.display = 'flex';
    Object.entries(config).forEach(([property, value]) => {
        track.style[property] = value;
    });
}

function updateCssOutput() {
    cssOutput.textContent = `#conteneur {\n  display: flex;\n  flex-direction: ${state.flexDirection};\n  justify-content: ${state.justifyContent};\n  align-items: ${state.alignItems};\n  gap: ${state.gap};\n}`;
}

function updateControls() {
    document.querySelectorAll('.control-group').forEach(group => {
        const property = group.dataset.property;
        group.querySelectorAll('button').forEach(button => {
            button.setAttribute('aria-pressed', String(state[property] === button.dataset.value));
        });
    });
    updateAxisLabels();
    updateCssOutput();
}

function updateAxisLabels() {
    const row = state.flexDirection === 'row';
    document.getElementById('main-axis-label').textContent = `Axe principal · ${row ? 'horizontal' : 'vertical'}`;
    document.getElementById('cross-axis-label').textContent = `Axe secondaire · ${row ? 'vertical' : 'horizontal'}`;
    document.getElementById('axis-explanation').textContent = row
        ? 'En ligne, l’axe principal est horizontal et l’axe secondaire vertical.'
        : 'En colonne, l’axe principal est vertical et l’axe secondaire horizontal.';
}

function updateMissionList() {
    missionList.replaceChildren();
    missions.forEach((mission, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = String(index + 1).padStart(2, '0');
        button.setAttribute('aria-label', `Défi ${index + 1} : ${mission.title}`);
        if (index === currentMission) button.setAttribute('aria-current', 'step');
        if (completed.has(index)) button.classList.add('is-complete');
        button.addEventListener('click', () => selectMission(index));
        missionList.appendChild(button);
    });
    document.getElementById('builder-score').textContent = `${completed.size} / ${missions.length}`;
}

function updateMission() {
    const mission = missions[currentMission];
    document.getElementById('mission-index').textContent = `DÉFI ${String(currentMission + 1).padStart(2, '0')} / ${String(missions.length).padStart(2, '0')}`;
    document.getElementById('mission-title').textContent = mission.title;
    document.getElementById('mission-description').textContent = mission.description;
    addPieces(targetTrack, mission.count);
    addPieces(liveTrack, mission.count);
    applyConfig(targetTrack, mission.config);
    Object.assign(state, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '16px' });
    applyConfig(liveTrack, state);
    liveState.textContent = 'EN ATTENTE';
    feedback.textContent = '';
    nextMission.hidden = true;
    updateControls();
    updateMissionList();
}

function selectMission(index) {
    currentMission = index;
    updateMission();
}

function layoutsMatch() {
    const expected = missions[currentMission].config;
    const sameControls = Object.entries(expected).every(([property, value]) => state[property] === value);
    if (!sameControls) return false;
    const targetPieces = Array.from(targetTrack.children);
    const livePieces = Array.from(liveTrack.children);
    const targetOrigin = targetTrack.getBoundingClientRect();
    const liveOrigin = liveTrack.getBoundingClientRect();
    return targetPieces.every((piece, index) => {
        const target = piece.getBoundingClientRect();
        const live = livePieces[index].getBoundingClientRect();
        return Math.abs((target.x - targetOrigin.x) - (live.x - liveOrigin.x)) < 1 &&
            Math.abs((target.y - targetOrigin.y) - (live.y - liveOrigin.y)) < 1 &&
            Math.abs(target.width - live.width) < 1 &&
            Math.abs(target.height - live.height) < 1;
    });
}

document.querySelectorAll('.control-group button').forEach(button => {
    button.addEventListener('click', () => {
        const property = button.closest('.control-group').dataset.property;
        state[property] = button.dataset.value;
        updateControls();
        liveState.textContent = 'À COMPARER';
        feedback.textContent = '';
    });
});

document.getElementById('check-layout').addEventListener('click', () => {
    applyConfig(liveTrack, state);
    liveState.textContent = 'COMPOSITION SOUMISE';
    if (!layoutsMatch()) {
        feedback.textContent = 'La composition ne correspond pas encore au plan.';
        feedback.style.color = '#a73e2e';
        return;
    }
    completed.add(currentMission);
    liveState.textContent = 'PLAN REPRODUIT';
    feedback.textContent = 'Plan reproduit. Les règles CSS sont affichées ci-dessous.';
    feedback.style.color = '#146b55';
    nextMission.hidden = currentMission === missions.length - 1;
    if (completed.size === missions.length) feedback.textContent = 'Studio terminé : les huit plans sont reproduits.';
    updateMissionList();
});

nextMission.addEventListener('click', () => {
    if (currentMission < missions.length - 1) selectMission(currentMission + 1);
});

updateMission();