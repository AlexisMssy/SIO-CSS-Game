const STARTER_CODE = '#cargo-lane {\n  display: flex;\n  \n}';

const missions = [
    {
        title: 'Dernier quai à l’est',
        description: 'Une caisse attend au départ. Envoie-la au quai marqué à droite, au milieu du convoyeur.',
        destination: 'QUAI E / CENTRE',
        hint: 'La caisse suit l’axe principal. Place le groupe à la fin de cet axe, puis centre-le sur l’autre axe.',
        parcelCount: 1,
        targetClass: 'target-zone--east',
        targetLabel: 'QUAI E',
        expected: ['display: flex', 'justify-content: flex-end', 'align-items: center'],
        targets: [{ items: ['parcel-a'], target: 'target-zone', group: true }],
        rules: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }
    },
    {
        title: 'Paire prioritaire',
        description: 'Deux colis doivent arriver ensemble sur la zone centrale. Garde un intervalle régulier entre eux.',
        destination: 'ZONE CENTRALE',
        hint: 'Le centre concerne le groupe complet, pas chaque colis séparément. Une valeur de gap garde leur intervalle constant.',
        parcelCount: 2,
        targetClass: 'target-zone--center-pair',
        targetLabel: 'PAIRE / 12 PX',
        expected: ['display: flex', 'justify-content: center', 'align-items: center', 'gap: 12px'],
        targets: [{ items: ['parcel-a', 'parcel-b'], target: 'target-zone', group: true }],
        rules: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }
    },
    {
        title: 'Trois portes ouvertes',
        description: 'Répartis trois colis entre les portes gauche, centrale et droite du terminal.',
        destination: 'PORTES A / B / C',
        hint: 'Le premier colis doit toucher le début de la ligne, le dernier sa fin, et l’espace entre les deux reste égal.',
        parcelCount: 3,
        targetClass: 'target-zone--spread',
        targetLabel: 'AIGUILLAGE / A-B-C',
        targetMarkup: '<span class="dock-slot dock-slot--first"></span><span class="dock-slot dock-slot--middle"></span><span class="dock-slot dock-slot--last"></span>',
        expected: ['display: flex', 'justify-content: space-between', 'align-items: center'],
        targets: [
            { items: ['parcel-a'], target: 'dock-slot--first' },
            { items: ['parcel-b'], target: 'dock-slot--middle' },
            { items: ['parcel-c'], target: 'dock-slot--last' }
        ],
        rules: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
    },
    {
        title: 'Rampe basse',
        description: 'Dirige une caisse vers le quai en bas à gauche, sans quitter le début de la ligne.',
        destination: 'QUAI S / BAS',
        hint: 'Le quai est au début de l’axe principal et à la fin de l’axe secondaire.',
        parcelCount: 1,
        targetClass: 'target-zone--south-west',
        targetLabel: 'QUAI S',
        expected: ['display: flex', 'justify-content: flex-start', 'align-items: flex-end'],
        targets: [{ items: ['parcel-a'], target: 'target-zone', group: true }],
        rules: { display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end' }
    },
    {
        title: 'Empilage express',
        description: 'Empile deux colis dans la zone en bas à droite. Le premier doit rester au-dessus du second.',
        destination: 'QUAI S / PILE',
        hint: 'Change l’axe principal en colonne. La fin de cet axe est en bas ; l’alignement secondaire place la pile à droite.',
        parcelCount: 2,
        targetClass: 'target-zone--south-east-stack',
        targetLabel: 'PILE / 10 PX',
        targetMarkup: '<span class="dock-slot dock-slot--first"></span><span class="dock-slot dock-slot--last"></span>',
        expected: ['display: flex', 'flex-direction: column', 'justify-content: flex-end', 'align-items: flex-end', 'gap: 10px'],
        targets: [
            { items: ['parcel-a'], target: 'dock-slot--first' },
            { items: ['parcel-b'], target: 'dock-slot--last' }
        ],
        rules: { display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', gap: '10px' }
    },
    {
        title: 'Départ groupé',
        description: 'Fais partir deux colis du coin nord-ouest, côte à côte.',
        destination: 'ENTRÉE / PAIRE',
        hint: 'Sur une ligne, le début de l’axe principal est à gauche et le début de l’axe secondaire est en haut.',
        parcelCount: 2,
        targetClass: 'target-zone--north-west-pair',
        targetLabel: 'ENTRÉE / 12 PX',
        expected: ['display: flex', 'flex-direction: row', 'justify-content: flex-start', 'align-items: flex-start', 'gap: 12px'],
        targets: [{ items: ['parcel-a', 'parcel-b'], target: 'target-zone', group: true }],
        rules: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '12px' }
    },
    {
        title: 'Deux voies opposées',
        description: 'Place un colis à chaque extrémité de la ligne, sur la rampe du bas.',
        destination: 'RAMPE / GAUCHE + DROITE',
        hint: 'Les éléments restent sur une ligne ; répartis-les jusqu’aux deux extrémités et aligne-les sur l’axe secondaire.',
        parcelCount: 2,
        targetClass: 'target-zone--edge-bottom',
        targetLabel: 'VOIES / A-B',
        targetMarkup: '<span class="dock-slot dock-slot--bottom-left"></span><span class="dock-slot dock-slot--bottom-right"></span>',
        expected: ['display: flex', 'justify-content: space-between', 'align-items: flex-end'],
        targets: [
            { items: ['parcel-a'], target: 'dock-slot--bottom-left' },
            { items: ['parcel-b'], target: 'dock-slot--bottom-right' }
        ],
        rules: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }
    },
    {
        title: 'Colis en hauteur',
        description: 'Amène une caisse au centre exact du terminal en faisant monter l’axe principal.',
        destination: 'CENTRE / HAUTEUR',
        hint: 'En colonne, justify-content agit de haut en bas et align-items de gauche à droite.',
        parcelCount: 1,
        targetClass: 'target-zone--center',
        targetLabel: 'CENTRE / COLONNE',
        expected: ['display: flex', 'flex-direction: column', 'justify-content: center', 'align-items: center'],
        targets: [{ items: ['parcel-a'], target: 'target-zone', group: true }],
        rules: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }
    },
    {
        title: 'Pile du matin',
        description: 'Empile trois colis en haut à droite avec un espace régulier.',
        destination: 'QUAI N / PILE',
        hint: 'La colonne commence en haut ; aligne la pile vers la droite et règle l’espace entre chaque colis.',
        parcelCount: 3,
        targetClass: 'target-zone--north-east-stack',
        targetLabel: 'PILE / 8 PX',
        targetMarkup: '<span class="dock-slot dock-slot--stack-first"></span><span class="dock-slot dock-slot--stack-middle"></span><span class="dock-slot dock-slot--stack-last"></span>',
        expected: ['display: flex', 'flex-direction: column', 'justify-content: flex-start', 'align-items: flex-end', 'gap: 8px'],
        targets: [
            { items: ['parcel-a'], target: 'dock-slot--stack-first' },
            { items: ['parcel-b'], target: 'dock-slot--stack-middle' },
            { items: ['parcel-c'], target: 'dock-slot--stack-last' }
        ],
        rules: { display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '8px' }
    },
    {
        title: 'Contrôle central',
        description: 'Regroupe trois colis au milieu de la ligne, au bord supérieur du convoyeur.',
        destination: 'CENTRE / LIGNE HAUTE',
        hint: 'Centre le groupe sur l’axe principal, puis place-le au début de l’axe secondaire.',
        parcelCount: 3,
        targetClass: 'target-zone--north-center-trio',
        targetLabel: 'CONTRÔLE / A-B-C',
        expected: ['display: flex', 'justify-content: center', 'align-items: flex-start', 'gap: 10px'],
        targets: [{ items: ['parcel-a', 'parcel-b', 'parcel-c'], target: 'target-zone', group: true }],
        rules: { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '10px' }
    }
];

const cargoLane = document.getElementById('cargo-lane');
const codeInput = document.getElementById('dispatch-code');
const feedback = document.getElementById('dispatch-feedback');
const missionList = document.getElementById('mission-list');
const nextMission = document.getElementById('next-mission');
const completed = new Set();
let currentMission = 0;

function getBounds(element) {
    const bounds = element.getBoundingClientRect();
    return { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom, width: bounds.width, height: bounds.height };
}

function groupBounds(ids) {
    const boxes = ids.map(id => getBounds(document.getElementById(id)));
    return {
        left: Math.min(...boxes.map(box => box.left)),
        right: Math.max(...boxes.map(box => box.right)),
        top: Math.min(...boxes.map(box => box.top)),
        bottom: Math.max(...boxes.map(box => box.bottom))
    };
}

function boundsMatch(actual, expected, tolerance = 12) {
    return ['left', 'right', 'top', 'bottom'].every(edge => Math.abs(actual[edge] - expected[edge]) <= tolerance);
}

function updateMissionList() {
    missionList.innerHTML = '';
    missions.forEach((mission, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = String(index + 1).padStart(2, '0');
        button.setAttribute('aria-label', `Mission ${index + 1} : ${mission.title}`);
        if (index === currentMission) button.setAttribute('aria-current', 'step');
        if (completed.has(index)) button.classList.add('is-complete');
        button.addEventListener('click', () => selectMission(index));
        missionList.appendChild(button);
    });
    document.getElementById('dispatch-score').textContent = `${completed.size} / ${missions.length}`;
}

function updateMission() {
    const mission = missions[currentMission];
    document.getElementById('mission-index').textContent = `MISSION ${String(currentMission + 1).padStart(2, '0')} / ${String(missions.length).padStart(2, '0')}`;
    document.getElementById('mission-title').textContent = mission.title;
    document.getElementById('mission-description').textContent = mission.description;
    document.getElementById('mission-destination').textContent = mission.destination;
    document.getElementById('mission-hint').textContent = mission.hint;
    document.getElementById('yard-destination').textContent = mission.destination.split(' / ')[0];
    const target = document.getElementById('target-zone');
    target.className = `target-zone ${mission.targetClass}`;
    target.dataset.label = mission.targetLabel;
    target.innerHTML = mission.targetMarkup || '';
    Array.from(cargoLane.children).forEach((parcel, index) => {
        parcel.hidden = index >= mission.parcelCount;
        parcel.classList.remove('is-arrived');
    });
    codeInput.value = STARTER_CODE;
    feedback.textContent = '';
    feedback.style.color = '';
    nextMission.hidden = true;
    document.getElementById('yard-status').textContent = 'EN ATTENTE';
    updateMissionList();
}

function selectMission(index) {
    currentMission = index;
    updateMission();
}

function hasExpectedRules(mission) {
    const normalize = value => value.replace(/\s+/g, '').toLowerCase();
    const code = normalize(codeInput.value);
    return mission.expected.every(rule => code.includes(normalize(rule)));
}

function positionsMatch(mission) {
    return mission.targets.every(target => {
        const actual = target.group ? groupBounds(target.items) : getBounds(document.getElementById(target.items[0]));
        const expected = getBounds(document.querySelector(`.${target.target}`));
        return boundsMatch(actual, expected);
    });
}

function checkMission() {
    const style = getOrCreateStyleElement('flex-dispatch-user-style');
    style.textContent = codeInput.value;
    const mission = missions[currentMission];
    requestAnimationFrame(() => requestAnimationFrame(() => {
        const applied = getComputedStyle(cargoLane);
        const rulesMatch = Object.entries(mission.rules).every(([property, value]) => applied[property] === value);
        if (!hasExpectedRules(mission)) {
            feedback.textContent = 'Il manque une ou plusieurs règles demandées dans la feuille de style.';
            feedback.style.color = '#a73e2e';
            document.getElementById('yard-status').textContent = 'RÉGLAGES À COMPLÉTER';
            return;
        }
        if (!rulesMatch || !positionsMatch(mission)) {
            feedback.textContent = 'Les colis ne sont pas encore dans les zones cibles. Ajuste les règles puis relance.';
            feedback.style.color = '#a73e2e';
            document.getElementById('yard-status').textContent = 'HORS ZONE';
            return;
        }

        completed.add(currentMission);
        mission.targets.forEach(target => target.items.forEach(id => document.getElementById(id).classList.add('is-arrived')));
        feedback.textContent = 'Aiguillage validé. Tous les colis sont à quai.';
        feedback.style.color = '#146b55';
        document.getElementById('yard-status').textContent = 'QUAI VALIDÉ';
        nextMission.hidden = currentMission === missions.length - 1;
        if (completed.size === missions.length) {
            feedback.textContent = `Terminal terminé. ${completed.size} missions validées sur ${missions.length}.`;
        }
        updateMissionList();
    }));
}

document.getElementById('dispatch-btn').addEventListener('click', checkMission);
nextMission.addEventListener('click', () => {
    if (currentMission < missions.length - 1) selectMission(currentMission + 1);
});

updateMission();