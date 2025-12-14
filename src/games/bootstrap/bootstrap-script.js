// Bootstrap game — niveaux d'exercices
const targetContainer = document.getElementById('bootstrap-target');

// Structure HTML de base pour chaque niveau
const levelTemplates = {
    button: '<button id="target-element">Cliquez-moi</button>',
    container: '<div id="target-element">Contenu</div>',
    text: '<p id="target-element">Texte à styliser</p>',
    card: '<div id="target-element"><div class="card-body">Carte Bootstrap</div></div>',
    grid: '<div id="target-element"><div>Colonne 1</div><div>Colonne 2</div></div>',
    alert: '<div id="target-element">Message</div>',
    badge: '<span id="target-element">Badge</span>',
    flex: '<div id="target-element"><div>Item 1</div><div>Item 2</div></div>'
};

const levels = [
    {
        text: 'Niveau 1 : Le bouton doit avoir le style d\'un bouton Bootstrap.',
        template: 'button',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('btn');
        },
        expected: ['btn']
    },
    {
        text: 'Niveau 2 : Le bouton doit être bleu.',
        template: 'button',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('btn-primary');
        },
        expected: ['btn-primary']
    },
    {
        text: 'Niveau 3 : Le bouton doit être vert.',
        template: 'button',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('btn-success');
        },
        expected: ['btn-success']
    },
    {
        text: 'Niveau 4 : Le texte doit être centré horizontalement.',
        template: 'text',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('text-center');
        },
        expected: ['text-center']
    },
    {
        text: 'Niveau 5 : Le texte doit être de couleur bleue.',
        template: 'text',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('text-primary');
        },
        expected: ['text-primary']
    },
    {
        text: 'Niveau 6 : La div doit être une alerte informative de couleur bleue.',
        template: 'alert',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('alert') && el.classList.contains('alert-info');
        },
        expected: ['alert', 'alert-info']
    },
    {
        text: 'Niveau 7 : Le span doit être un badge avec un fond bleu.',
        template: 'badge',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('badge') && el.classList.contains('bg-primary');
        },
        expected: ['badge', 'bg-primary']
    },
    {
        text: 'Niveau 8 : La div doit avoir l\'apparence d\'une carte avec bordure et ombre légère.',
        template: 'card',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('card');
        },
        expected: ['card']
    },
    {
        text: 'Niveau 9 : Les éléments enfants doivent être disposés en flexbox (côte à côte).',
        template: 'flex',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('d-flex');
        },
        expected: ['d-flex']
    },
    {
        text: 'Niveau 10 : Les éléments enfants doivent être centrés horizontalement dans le conteneur flexbox.',
        template: 'flex',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('d-flex') && el.classList.contains('justify-content-center');
        },
        expected: ['d-flex', 'justify-content-center']
    },
    {
        text: 'Niveau 11 : La div parent doit être configurée pour utiliser le système de grille Bootstrap.',
        template: 'grid',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('row');
        },
        expected: ['row']
    },
    {
        text: 'Niveau 12 : Les deux divs enfants doivent occuper chacun 50% de la largeur (colonnes égales).',
        template: 'grid',
        validate: () => {
            const el = document.getElementById('target-element');
            if (!el || !el.classList.contains('row')) return false;
            const cols = el.querySelectorAll(':scope > div');
            return cols.length === 2 && 
                   cols[0].classList.contains('col') && 
                   cols[1].classList.contains('col');
        },
        expected: ['row', 'col']
    },
    {
        text: 'Niveau 13 : Sur les écrans moyens et plus grands (≥768px), les deux divs doivent occuper chacun 50% de la largeur.',
        template: 'grid',
        validate: () => {
            const el = document.getElementById('target-element');
            if (!el || !el.classList.contains('row')) return false;
            const cols = el.querySelectorAll(':scope > div');
            return cols.length === 2 && 
                   cols[0].classList.contains('col-md-6') && 
                   cols[1].classList.contains('col-md-6');
        },
        expected: ['row', 'col-md-6']
    },
    {
        text: 'Niveau 14 : Le bouton doit avoir une bordure bleue et un fond transparent.',
        template: 'button',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('btn') && el.classList.contains('btn-outline-primary');
        },
        expected: ['btn', 'btn-outline-primary']
    },
    {
        text: 'Niveau 15 : La div doit être une alerte de succès de couleur verte.',
        template: 'alert',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('alert') && el.classList.contains('alert-success');
        },
        expected: ['alert', 'alert-success']
    },
    {
        text: 'Niveau 16 : Le bouton doit avoir une marge en bas de taille moyenne.',
        template: 'button',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('mb-3');
        },
        expected: ['mb-3']
    },
    {
        text: 'Niveau 17 : Le texte doit avoir un padding (espacement interne) de taille moyenne sur tous les côtés.',
        template: 'text',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('p-3');
        },
        expected: ['p-3']
    },
    {
        text: 'Niveau 18 : La carte doit avoir une ombre portée visible.',
        template: 'card',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('card') && el.classList.contains('shadow');
        },
        expected: ['shadow']
    },
    {
        text: 'Niveau 19 : Les coins du bouton doivent être arrondis.',
        template: 'button',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('rounded');
        },
        expected: ['rounded']
    },
    {
        text: 'Niveau 20 : Le bouton doit être désactivé (non cliquable).',
        template: 'button',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && (el.hasAttribute('disabled') || el.classList.contains('disabled'));
        },
        expected: ['disabled']
    },
    {
        text: 'Niveau 21 : Le texte doit être en lettres majuscules.',
        template: 'text',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('text-uppercase');
        },
        expected: ['text-uppercase']
    },
    {
        text: 'Niveau 22 : Le texte doit être en gras.',
        template: 'text',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('fw-bold');
        },
        expected: ['fw-bold']
    },
    {
        text: 'Niveau 23 : Le texte doit être caché sur mobile mais visible sur les écrans moyens et plus grands (≥768px).',
        template: 'text',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('d-none') && el.classList.contains('d-md-block');
        },
        expected: ['d-none', 'd-md-block']
    },
    {
        text: 'Niveau 24 : Le parent doit avoir "row" et la première div enfant doit avoir "col-lg-3" pour occuper 25% sur grands écrans (≥992px). Format: class="row col-lg-3" (row pour le parent, col-lg-3 pour l\'enfant).',
        template: 'grid',
        validate: () => {
            const el = document.getElementById('target-element');
            if (!el || !el.classList.contains('row')) return false;
            const cols = el.querySelectorAll(':scope > div');
            return cols.length >= 1 && cols[0].classList.contains('col-lg-3');
        },
        expected: ['row', 'col-lg-3']
    },
    {
        text: 'Niveau 25 : Les éléments enfants doivent être centrés verticalement dans le conteneur flexbox.',
        template: 'flex',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('d-flex') && el.classList.contains('align-items-center');
        },
        expected: ['d-flex', 'align-items-center']
    },
    {
        text: 'Niveau 26 : Il doit y avoir un espacement uniforme entre les éléments enfants du conteneur flexbox.',
        template: 'flex',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('d-flex') && el.classList.contains('gap-3');
        },
        expected: ['d-flex', 'gap-3']
    },
    {
        text: 'Niveau 27 : Le texte doit avoir une bordure bleue visible.',
        template: 'text',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('border') && el.classList.contains('border-primary');
        },
        expected: ['border', 'border-primary']
    },
    {
        text: 'Niveau 28 : La div doit avoir un fond de couleur claire (gris très clair).',
        template: 'container',
        validate: () => {
            const el = document.getElementById('target-element');
            return el && el.classList.contains('bg-warning');
        },
        expected: ['bg-warning']
    }
];

// Helper pour vérifier les classes attendues
function checkExpectedForLevel(levelIndex) {
    const lvl = levels[levelIndex];
    const code = (codeInput && codeInput.value) ? codeInput.value.toLowerCase() : '';
    if (!lvl.expected || !lvl.expected.length) return { ok: true, missing: [] };
    const missing = lvl.expected.filter(s => !code.includes(s.toLowerCase()));
    return { ok: missing.length === 0, missing };
}

// Fonction pour mettre à jour le HTML selon le niveau
function updateLevelHTML() {
    if (!targetContainer) return;
    
    const currentLvl = levels[currentLevel];
    if (!currentLvl) return;
    
    const template = levelTemplates[currentLvl.template];
    if (!template) return;
    
    targetContainer.innerHTML = template;
}

// ---------------------
// VARIABLES & INIT
// ---------------------
let currentLevel = 0;
let score = 0;

const levelText = document.getElementById('level-text');
const codeInput = document.getElementById('code-input');
const statusDiv = document.getElementById('status');
const nextBtn = document.getElementById('next-level');
const levelCounter = document.getElementById('level-counter');
const levelList = document.getElementById('level-list');
const scoreDisplay = document.getElementById('score-display');

// Sauvegarde/restaure la progression
function saveProgress() {
    try {
        localStorage.setItem('bootstrap_progress', JSON.stringify({
            currentLevel,
            score
        }));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde de la progression:', e);
    }
}

function loadProgress() {
    try {
        const data = JSON.parse(localStorage.getItem('bootstrap_progress'));
        if (data && typeof data.currentLevel === 'number' && typeof data.score === 'number') {
            return data;
        }
    } catch (e) {
        console.error('Erreur lors du chargement de la progression:', e);
    }
    return null;
}

// Restauration au chargement
const progress = loadProgress();
if (progress) {
    currentLevel = progress.currentLevel;
    // Le score doit correspondre au nombre de niveaux réussis
    const doneLevels = getDoneLevels();
    score = doneLevels.length;
} else {
    // Si pas de progression, calculer le score depuis les niveaux réussis
    const doneLevels = getDoneLevels();
    score = doneLevels.length;
}

// Liste des niveaux réussis
function getDoneLevels() {
    try {
        return JSON.parse(localStorage.getItem('bootstrap_done')) || [];
    } catch (e) {
        console.error('Erreur lors du chargement des niveaux réussis:', e);
        return [];
    }
}

function setDoneLevels(done) {
    try {
        localStorage.setItem('bootstrap_done', JSON.stringify(done));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde des niveaux réussis:', e);
    }
}

// Sauvegarde/restaure le code de chaque niveau
function saveLevelCode(levelIndex, code) {
    try {
        const codes = JSON.parse(localStorage.getItem('bootstrap_level_codes') || '{}');
        codes[levelIndex] = code;
        localStorage.setItem('bootstrap_level_codes', JSON.stringify(codes));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde du code:', e);
    }
}

function loadLevelCode(levelIndex) {
    try {
        const codes = JSON.parse(localStorage.getItem('bootstrap_level_codes') || '{}');
        return codes[levelIndex] || '';
    } catch (e) {
        console.error('Erreur lors du chargement du code:', e);
        return '';
    }
}

function updateLevelCounter() {
    if (!levelCounter) return;
    levelCounter.textContent = `Niveau ${currentLevel + 1} / ${levels.length}`;
    updateLevelList();
}

function updateScoreDisplay() {
    if (!scoreDisplay) return;
    scoreDisplay.textContent = `Points: ${score}`;
}

function updateLevelList() {
    if (!levelList) return;
    const doneLevels = getDoneLevels();
    levelList.innerHTML = '';
    
    levels.forEach((lvl, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'level-btn';
        btn.textContent = `Niveau ${i + 1}`;
        
        if (doneLevels.includes(i)) btn.classList.add('done');
        if (i === currentLevel) btn.classList.add('selected');
        
        btn.onclick = () => {
            // Sauvegarder le code du niveau actuel avant de changer
            if (codeInput) {
                saveLevelCode(currentLevel, codeInput.value.trim());
            }
            
            currentLevel = i;
            levelText.textContent = levels[currentLevel].text;
            
            // Restaurer le code sauvegardé pour ce niveau
            const savedCode = loadLevelCode(currentLevel);
            if (codeInput) {
                codeInput.value = savedCode;
            }
            
            statusDiv.innerHTML = '';
            nextBtn.style.display = 'none';
            updateLevelHTML();
            updateLevelCounter();
            saveProgress();
            
            // Appliquer le code sauvegardé si présent
            if (savedCode) {
                const classMatch = savedCode.match(/class\s*=\s*["']([^"']+)["']/i);
                if (classMatch) {
                    const classes = classMatch[1].split(/\s+/).filter(c => c);
                    const targetEl = document.getElementById('target-element');
                    if (targetEl) {
                        targetEl.className = '';
                        targetEl.removeAttribute('disabled');
                        classes.forEach(cls => {
                            if (!cls.startsWith('col')) {
                                if (cls === 'disabled') {
                                    targetEl.setAttribute('disabled', '');
                                    targetEl.classList.add('disabled');
                                } else {
                                    targetEl.classList.add(cls);
                                }
                            }
                        });
                        
                        // Gérer les classes col pour les grilles
                        if (levels[currentLevel].template === 'grid') {
                            const children = targetEl.querySelectorAll(':scope > div');
                            const colClasses = classes.filter(c => c.startsWith('col'));
                            if (colClasses.length > 0) {
                                if (colClasses.length === 1) {
                                    children.forEach((child) => {
                                        child.className = '';
                                        child.classList.add(colClasses[0]);
                                    });
                                } else {
                                    children.forEach((child, index) => {
                                        child.className = '';
                                        if (index === 0) {
                                            colClasses.forEach(cls => child.classList.add(cls));
                                        } else {
                                            child.classList.add(colClasses[0]);
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }
        };
        
        levelList.appendChild(btn);
    });
}

// Initialisation
if (levelText) levelText.textContent = levels[currentLevel].text;
updateLevelHTML();
updateLevelCounter();
updateScoreDisplay();

// Restaurer le code du niveau actuel au chargement
const savedCode = loadLevelCode(currentLevel);
if (codeInput && savedCode) {
    codeInput.value = savedCode;
    // Appliquer le code sauvegardé
    const classMatch = savedCode.match(/class\s*=\s*["']([^"']+)["']/i);
    if (classMatch) {
        const classes = classMatch[1].split(/\s+/).filter(c => c);
        // Vérifier aussi si disabled est présent comme attribut séparé
        let classesWithDisabled = [...classes];
        if (savedCode.includes('disabled') && !classes.includes('disabled')) {
            classesWithDisabled.push('disabled');
        }
        const targetEl = document.getElementById('target-element');
        if (targetEl) {
            targetEl.className = '';
            targetEl.removeAttribute('disabled');
            classesWithDisabled.forEach(cls => {
                if (!cls.startsWith('col')) {
                    if (cls === 'disabled') {
                        targetEl.setAttribute('disabled', '');
                        targetEl.classList.add('disabled');
                    } else {
                        targetEl.classList.add(cls);
                    }
                }
            });
            
            // Gérer les classes col pour les grilles
            if (levels[currentLevel].template === 'grid') {
                const children = targetEl.querySelectorAll(':scope > div');
                const colClasses = classes.filter(c => c.startsWith('col'));
                if (colClasses.length > 0) {
                    if (colClasses.length === 1) {
                        children.forEach((child) => {
                            child.className = '';
                            child.classList.add(colClasses[0]);
                        });
                    } else {
                        children.forEach((child, index) => {
                            child.className = '';
                            if (index === 0) {
                                colClasses.forEach(cls => child.classList.add(cls));
                            } else {
                                child.classList.add(colClasses[0]);
                            }
                        });
                    }
                }
            }
        }
    }
}

// ---------------------
// TEST DU NIVEAU
// ---------------------
const testBtn = document.getElementById('test-btn');
if (testBtn) {
    testBtn.onclick = () => {
        if (!codeInput || !targetContainer || !statusDiv || !nextBtn) {
            console.error('Éléments DOM manquants pour le test');
            return;
        }

        try {
            // Appliquer les classes depuis le textarea
            const userCode = codeInput.value.trim();
            
            // Sauvegarder le code du niveau actuel
            saveLevelCode(currentLevel, userCode);
            
            if (!userCode) {
                statusDiv.textContent = 'Veuillez entrer du code';
                statusDiv.style.color = 'orange';
                return;
            }

            const targetEl = document.getElementById('target-element');
            if (!targetEl) {
                statusDiv.textContent = 'Élément cible introuvable';
                statusDiv.style.color = 'red';
                return;
            }

            const currentLvl = levels[currentLevel];
            
            // Parser le code pour extraire les classes
            // Format obligatoire: class="..." ou class='...'
            const classMatch = userCode.match(/class\s*=\s*["']([^"']+)["']/i);
            
            if (!classMatch) {
                statusDiv.textContent = 'Format invalide. Utilisez: class="..." ou class=\'...\'';
                statusDiv.style.color = 'orange';
                return;
            }

            let classes = classMatch[1].split(/\s+/).filter(c => c);
            
            // Vérifier aussi si disabled est présent comme attribut séparé
            if (userCode.includes('disabled') && !classes.includes('disabled')) {
                classes.push('disabled');
            }

            if (classes.length === 0) {
                statusDiv.textContent = 'Aucune classe trouvée dans class="..."';
                statusDiv.style.color = 'orange';
                return;
            }

            // Réinitialiser et appliquer les classes au parent
            targetEl.className = '';
            // Réinitialiser l'attribut disabled
            targetEl.removeAttribute('disabled');
            
            classes.forEach(cls => {
                if (!cls.startsWith('col')) {
                    if (cls === 'disabled') {
                        // Pour disabled, on peut utiliser soit l'attribut soit la classe
                        targetEl.setAttribute('disabled', '');
                        targetEl.classList.add('disabled');
                    } else {
                        targetEl.classList.add(cls);
                    }
                }
            });

            // Pour les niveaux avec plusieurs éléments (grid, flex)
            if (currentLvl.template === 'grid') {
                const children = targetEl.querySelectorAll(':scope > div');
                // Chercher toutes les classes "col" dans les classes entrées
                const colClasses = classes.filter(c => c.startsWith('col'));
                
                if (colClasses.length > 0) {
                    // Si une seule classe col, l'appliquer à tous les enfants
                    // Si plusieurs classes col, les appliquer toutes au premier enfant (cas col-12 col-md-4)
                    if (colClasses.length === 1) {
                        // Une seule classe col : l'appliquer à tous les enfants
                        children.forEach((child) => {
                            child.className = '';
                            child.classList.add(colClasses[0]);
                        });
                    } else {
                        // Plusieurs classes col : toutes au premier enfant, puis répéter la première pour les autres
                        children.forEach((child, index) => {
                            child.className = '';
                            if (index === 0) {
                                // Premier enfant : toutes les classes col
                                colClasses.forEach(cls => child.classList.add(cls));
                            } else {
                                // Autres enfants : première classe col seulement
                                child.classList.add(colClasses[0]);
                            }
                        });
                    }
                } else {
                    // Pas de classes col : réinitialiser les enfants
                    children.forEach(child => child.className = '');
                }
            }

            // Attendre un peu pour que les styles soient appliqués
            setTimeout(() => {
                if (currentLevel >= levels.length || !levels[currentLevel]) {
                    console.error('Niveau invalide:', currentLevel);
                    return;
                }

                const effectOk = levels[currentLevel].validate();
                const expectedCheck = checkExpectedForLevel(currentLevel);

                if (effectOk && expectedCheck.ok) {
                    const doneLevels = getDoneLevels();
                    const alreadyDone = doneLevels.includes(currentLevel);
                    
                    if (!alreadyDone) {
                        doneLevels.push(currentLevel);
                        setDoneLevels(doneLevels);
                        // Le score doit correspondre au nombre de niveaux réussis
                        score = doneLevels.length;
                        saveProgress();
                    }

                    statusDiv.textContent = alreadyDone ? 'Déjà réussi' : 'Réussi';
                    statusDiv.style.color = 'green';
                    nextBtn.style.display = 'block';
                    updateLevelList();
                    updateScoreDisplay();
                } else if (effectOk && !expectedCheck.ok) {
                    const missingText = expectedCheck.missing.join(', ');
                    showToast('Effet OK mais classes manquantes: ' + missingText, 'error', 4500);
                    statusDiv.textContent = 'Incorrect — classes manquantes: ' + missingText;
                    statusDiv.style.color = 'orange';
                } else {
                    statusDiv.textContent = 'Incorrect';
                    statusDiv.style.color = 'red';
                }
            }, 100);

        } catch (err) {
            console.error('Erreur lors du test:', err);
            showToast('Erreur lors du test', 'error');
        }
    };
}

// ---------------------
// PASSER AU NIVEAU SUIVANT
// ---------------------
if (nextBtn) {
    nextBtn.onclick = () => {
        // Sauvegarder le code du niveau actuel avant de passer au suivant
        if (codeInput) {
            saveLevelCode(currentLevel, codeInput.value.trim());
        }
        
        currentLevel++;
        saveProgress();
        
        if (currentLevel >= levels.length) {
            const finalScore = document.getElementById('final-score');
            const gameEnd = document.getElementById('game-end');
            
            if (finalScore) finalScore.textContent = `Score : ${score} / ${levels.length}`;
            if (gameEnd) gameEnd.style.display = 'block';
            if (codeInput) codeInput.style.display = 'none';
            nextBtn.style.display = 'none';
            if (levelText) levelText.textContent = 'Jeu terminé';
            return;
        }
        
        if (levelText) levelText.textContent = levels[currentLevel].text;
        
        // Restaurer le code sauvegardé pour le nouveau niveau
        const savedCode = loadLevelCode(currentLevel);
        if (codeInput) {
            codeInput.value = savedCode;
        }
        
        if (statusDiv) statusDiv.innerHTML = '';
        nextBtn.style.display = 'none';
        updateLevelHTML();
        updateLevelCounter();
        
        // Appliquer le code sauvegardé si présent
        if (savedCode) {
            const classMatch = savedCode.match(/class\s*=\s*["']([^"']+)["']/i);
            if (classMatch) {
                const classes = classMatch[1].split(/\s+/).filter(c => c);
                    const targetEl = document.getElementById('target-element');
                    if (targetEl) {
                        targetEl.className = '';
                        targetEl.removeAttribute('disabled');
                        classes.forEach(cls => {
                            if (!cls.startsWith('col')) {
                                if (cls === 'disabled') {
                                    targetEl.setAttribute('disabled', '');
                                    targetEl.classList.add('disabled');
                                } else {
                                    targetEl.classList.add(cls);
                                }
                            }
                        });
                    
                    // Gérer les classes col pour les grilles
                    if (levels[currentLevel].template === 'grid') {
                        const children = targetEl.querySelectorAll(':scope > div');
                        const colClasses = classes.filter(c => c.startsWith('col'));
                        if (colClasses.length > 0) {
                            if (colClasses.length === 1) {
                                children.forEach((child) => {
                                    child.className = '';
                                    child.classList.add(colClasses[0]);
                                });
                            } else {
                                children.forEach((child, index) => {
                                    child.className = '';
                                    if (index === 0) {
                                        colClasses.forEach(cls => child.classList.add(cls));
                                    } else {
                                        child.classList.add(colClasses[0]);
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    };
}

// ---------------------
// RECHARGER HTML
// ---------------------
const reloadCssBtn = document.getElementById('reload-css-btn');
if (reloadCssBtn) {
    reloadCssBtn.onclick = () => {
        try {
            if (!codeInput) {
                showToast('Erreur : zone de code introuvable', 'error');
                return;
            }

            const targetEl = document.getElementById('target-element');
            if (!targetEl) {
                showToast('Élément cible introuvable', 'error');
                return;
            }

            const userCode = codeInput.value.trim();
            
            // Si le textarea est vide, réinitialiser toutes les classes
            if (!userCode) {
                targetEl.className = '';
                // Réinitialiser aussi les classes des enfants (pour les grilles)
                const children = targetEl.querySelectorAll(':scope > div');
                children.forEach(child => {
                    child.className = '';
                });
                showToast('Classes réinitialisées', 'info', 1500);
                return;
            }

            // Parser les classes (format obligatoire: class="..." ou class='...')
            const classMatch = userCode.match(/class\s*=\s*["']([^"']+)["']/i);
            
            if (!classMatch) {
                showToast('Format invalide. Utilisez: class="..." ou class=\'...\'', 'error');
                return;
            }

            const classes = classMatch[1].split(/\s+/).filter(c => c);

            if (classes.length === 0) {
                // Si aucune classe valide trouvée, réinitialiser
                targetEl.className = '';
                const children = targetEl.querySelectorAll(':scope > div');
                children.forEach(child => {
                    child.className = '';
                });
                showToast('Aucune classe trouvée dans class="..."', 'info', 1500);
                return;
            }

            // Appliquer les classes
            targetEl.className = '';
            // Réinitialiser l'attribut disabled
            targetEl.removeAttribute('disabled');
            
            classes.forEach(cls => {
                if (!cls.startsWith('col')) {
                    if (cls === 'disabled') {
                        // Pour disabled, on peut utiliser soit l'attribut soit la classe
                        targetEl.setAttribute('disabled', '');
                        targetEl.classList.add('disabled');
                    } else {
                        targetEl.classList.add(cls);
                    }
                }
            });

            // Gérer les classes col pour les grilles
            const children = targetEl.querySelectorAll(':scope > div');
            const colClasses = classes.filter(c => c.startsWith('col'));
            if (colClasses.length > 0 && children.length > 0) {
                if (colClasses.length === 1) {
                    // Une seule classe col : l'appliquer à tous les enfants
                    children.forEach((child) => {
                        child.className = '';
                        child.classList.add(colClasses[0]);
                    });
                } else {
                    // Plusieurs classes col : toutes au premier enfant, puis répéter la première pour les autres
                    children.forEach((child, index) => {
                        child.className = '';
                        if (index === 0) {
                            // Premier enfant : toutes les classes col
                            colClasses.forEach(cls => child.classList.add(cls));
                        } else {
                            // Autres enfants : première classe col seulement
                            child.classList.add(colClasses[0]);
                        }
                    });
                }
            } else if (children.length > 0) {
                // Pas de classes col : réinitialiser les enfants
                children.forEach(child => child.className = '');
            } else {
                // Si pas de classes col mais qu'il y a des enfants, réinitialiser leurs classes
                children.forEach(child => {
                    child.className = '';
                });
            }

            showToast('Classes appliquées', 'success', 1500);
        } catch (e) {
            showToast('Erreur : impossible d\'appliquer les classes', 'error', 2000);
            console.error(e);
        }
    };
}

// ---------------------
// REJOUER
// ---------------------
const restartBtn = document.getElementById('restart-btn');
if (restartBtn) {
    restartBtn.onclick = () => {
        try {
            localStorage.removeItem('bootstrap_progress');
            localStorage.removeItem('bootstrap_done');
        } catch (e) {
            console.error('Erreur lors de la réinitialisation:', e);
        }
        location.reload();
    };
}
