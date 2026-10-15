# Spec — Refonte visuelle et progression (maquette B + C)

Statut : brouillon. Maquette de référence : canevas « Refonte SIO CSS Game », artboards « B + C — Accueil » et « B + C — Page de jeu ».

## 1. Contexte, objectifs, non-objectifs

**Contexte.** Étudiants de BTS SIO 1re année, débutants. Le site est statique (aucun serveur) ; voir `CLAUDE.md`.

**Objectif.** Motiver les étudiants à revenir et à progresser : parcours visible, XP, série de jours, succès. Familiariser avec les outils de développeur (repères façon GitHub : grille d'activité, `git log`, `PASS`/`RUNS`/`TODO`).

**Non-objectifs.**
- Pas de classement ni de comparaison entre étudiants.
- Pas de « niveau joueur » : on affiche l'XP brute.
- Pas de serveur, de compte ni de synchronisation entre appareils.
- Pas de thème sombre global (seuls les blocs « code » et « terminal » sont sombres).
- Pas de modification des règles ni du contenu pédagogique des jeux.

## 2. Fondations visuelles

| Token | Valeur | Usage |
|---|---|---|
| `--ground` | `#fff8ec` | fond de page |
| `--surface` | `#ffffff` | cartes, en-tête |
| `--ink` | `#1f1a3d` | texte, bordures, fonds sombres |
| `--ink-soft` | `#4a4466` | texte secondaire |
| `--accent` | `#ff6b4a` | action principale, niveau en cours |
| `--accent-deep` | `#c2410c` | ombre du bouton principal, liens |
| `--success` | `#138a8a` | terminé, `PASS` |
| `--success-deep` | `#0f5f5f` | ombre et texte « succès » |
| `--highlight` | `#ffd23f` | objectif, progression |
| `--muted` | `#ece5d6` | à venir, pistes vides |
| `--advanced` | `#6b4ea0` | approfondissement (bordure en pointillés) |
| `--terminal` | `#15191f` | fond du terminal |
| `--terminal-ok` | `#4fd1c5` | `PASS` dans le terminal |

- Polices : « Bricolage Grotesque » (interface), « JetBrains Mono » (code, noms de fichiers, statuts, `git log`).
- Bordures : 3px `--ink` sur les cartes ; rayon 24px (cartes), 999px (boutons, pastilles).
- Ombre « relief » : `0 6px 0 var(--ink)` sur les cartes principales, `0 5px 0 var(--accent-deep)` sur le bouton principal.
- Cibles tactiles ≥ 44px.

## 3. Composants et pages

À détailler (avec leurs états : vide / en cours / terminé) :
- En-tête + navigation (pastilles série et XP)
- Bandeau « Reprendre » (voir Décisions, §6)
- Carte du parcours par chapitre (nœuds terminé / en cours / à venir, statut `PASS`/`RUNS`/`TODO`)
- Panneau « Ton activité » (grille des 4 dernières semaines)
- Panneau « Tes succès » (`git log`)
- Page de jeu : en-tête du jeu, bloc code, terminal de validation, liste des niveaux « Vu en cours » / « Approfondissement »

## 4. Règles de jeu et données

**Identifiants de niveau.** Chaque niveau porte un `id` stable, unique dans son jeu, indépendant de sa position (ex. `flex-wrap`). Toute progression est enregistrée par `id`, jamais par position.

**XP.**
- +1 XP à la **première** réussite d'un niveau. Rejouer un niveau déjà réussi ne rapporte rien.
- Approfondissement : même valeur (+1).
- Grid infini : +1 XP par grille réussie, **plafonné à 5 XP par jour** (date locale).

**Série de jours.**
- Tous les jours comptent (week-end et vacances compris), selon la date locale du navigateur. Décision assumée : un jour sans réussite casse la série, quel qu'il soit.
- Un jour compte s'il contient **au moins une réussite d'un niveau non marqué réussi** : première réussite, ou niveau effacé par « Recommencer » puis réussi à nouveau (ce dernier cas ne rapporte pas d'XP). Rejouer un niveau marqué réussi et les grilles de Grid infini ne comptent pas. Plusieurs réussites le même jour ne comptent qu'une fois.
- La série augmente de 1 si la réussite a lieu le lendemain du dernier jour réussi.
- Si au moins un jour complet s'est écoulé sans réussite, la série affichée vaut 0, même avant la prochaine partie ; la prochaine réussite la remet à 1.
- On conserve aussi le record (meilleure série).

**Succès.** Affichés comme des commits (`git log`), du plus récent au plus ancien, avec la date d'obtention. Un succès s'obtient une seule fois et ne se perd jamais.

| Message affiché | Condition |
|---|---|
| `init: premier niveau réussi` | 1 niveau réussi, tous jeux confondus |
| `feat: premier approfondissement` | 1 niveau `advanced` réussi |
| `feat: premier jeu terminé` | 1 jeu au statut `PASS` |
| `release: chapitre Fondamentaux` | tous les jeux Fondamentaux en `PASS` |
| `release: chapitre Flexbox` | tous les jeux Flexbox en `PASS` |
| `release: chapitre Grid` | tous les jeux Grid à niveaux en `PASS` (Grid infini exclu) |
| `streak: 3 jours` | série ≥ 3 |
| `streak: 7 jours` | série ≥ 7 |

Le prochain succès non obtenu s'affiche grisé (`???????`) avec sa condition.

**Statut d'un jeu.**
- `TODO` : aucun niveau réussi.
- `RUNS` : au moins un niveau réussi, mais pas tous les niveaux du cours.
- `PASS` : tous les niveaux **du cours** réussis (les approfondissements sont un bonus).

**Stockage.** Une clé `localStorage` unique et versionnée pour la progression commune : niveaux réussis (par `id`), XP, série, record, succès, activité par jour, dernier jeu joué. Le code tapé et le niveau affiché restent dans les clés propres à chaque jeu. Lors du passage aux identifiants stables, les anciennes progressions par position sont **remises à zéro** (décision de l'enseignant).

**Limite connue.** `localStorage` est propre à chaque navigateur : la progression n'est pas partagée entre le lycée et la maison, et elle est perdue si le navigateur efface ses données.

## 5. Critères d'acceptation

À compléter, sur trois niveaux :
1. Tests Node (logique de la section 4). Scénarios de la série :
   - **Normal** — Étant donné une série de 3 et une dernière réussite le jeudi 15 octobre, quand l'élève réussit un niveau le vendredi 16 octobre, alors la série vaut 4.
   - **Même jour** — Étant donné une série de 4 avec une réussite le vendredi 16 octobre, quand l'élève réussit un autre niveau le même jour, alors la série vaut toujours 4.
   - **Week-end** — Étant donné une série de 4 et une dernière réussite le vendredi 16 octobre, quand l'élève ne joue ni samedi 17 ni dimanche 18 puis réussit un niveau le lundi 19 octobre, alors la série vaut 1.
   - **Vacances** — Étant donné une série de 10 et une dernière réussite le vendredi 16 octobre, quand l'élève réussit un niveau le lundi 2 novembre, alors la série vaut 1 et le record vaut 10.
   - **Rejouer** — Étant donné une série de 2, une dernière réussite le jeudi 15 octobre et le niveau `flex-wrap` déjà réussi, quand le vendredi 16 octobre l'élève réussit seulement `flex-wrap` et deux grilles de Grid infini, alors la série vaut 0 le samedi 17 octobre et l'XP a augmenté de 2 (Grid infini uniquement).
   - **Affichage sans jouer** — Étant donné une série de 4 et une dernière réussite le vendredi 16 octobre, quand l'élève ouvre le site le dimanche 18 octobre sans rien réussir, alors la série affichée vaut 0.
2. Mesures en navigateur (débordement à 375 / 768 / 1280px, cibles ≥ 44px, contraste).
3. Checklist de relecture humaine sur captures d'écran.

## 6. Découpage et décisions ouvertes

**Découpage (ordre).** Fondations (tokens, en-tête et navigation, module de progression) en séquence ; puis pages de jeu en parallèle.

**Outillage de test.** Playwright est ajouté en dépendance de développement (premier `package.json`), uniquement pour les mesures en navigateur. Il n'est jamais chargé par les pages. Le paquet déployé ne doit contenir ni `node_modules/` ni les fichiers de test (à vérifier sur le site en ligne, pas seulement dans la configuration).

**Décisions (réponses aux questions du plan macro).**
- Déploiement : l'agent prépare, l'enseignant autorise chaque push sur `main`. Les fichiers de test sont retirés du paquet déployé dès F0.
- Mesures Playwright : exécutées en CI et bloquantes. Contraste minimal WCAG AA (4,5:1 ; 3:1 pour le texte ≥ 24px).
- Polices : hébergées dans le dépôt (aucune requête vers Google Fonts).
- Bouton « Recommencer » d'un jeu : efface les niveaux réussis de ce jeu seulement ; XP, série, record et succès sont conservés.
- Migration : les anciennes clés par position (niveaux réussis, code tapé, niveau affiché) sont effacées. Les clés de Carré Media Queries et Bootstrap sont conservées : ces jeux seront réutilisés.
- XP après « Recommencer » : un niveau effacé puis réussi à nouveau ne rapporte pas d'XP (jamais deux fois), mais compte pour la série.
- Grille « Ton activité » : un jour est actif dès qu'il contient une réussite (rejeux et Grid infini compris), avec deux intensités : jour qui compte pour la série / simple activité.
- Prochain succès affiché : le premier non obtenu dans l'ordre du tableau.
- Bandeau « Reprendre » : propose le premier niveau non réussi du dernier jeu joué ; sans aucune partie, propose de commencer par « HTML ou CSS ? ».

**Décisions ouvertes (à trancher avant F3 ou avant les pages).** Nommage des identifiants ; statut des missions de Builder, Dispatch et Debugger ; place des jeux indisponibles dans le parcours quand ils reviendront ; chapitres affichés ; scores existants des jeux ; statut de Grid infini sur le parcours ; états détaillés des composants (§3) ; checklist §5.3.
