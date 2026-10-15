# Plan macro — refonte

Produit en plan mode à partir de `specs/refonte.md`, relu et validé par l'enseignant. Les réponses aux questions bloquantes sont dans la section 6 de la spec (« Décisions »).

Règle des tâches parallèles : après les fondations, seules les fondations touchent `global.css`, `utils.js` et les fichiers partagés ; chaque page n'écrit que dans son dossier et son propre fichier de test.

## Fondations

### F0 — Outillage et paquet déployé
- Objectif : premier `package.json` (Playwright en dépendance de développement), script de mesures. Le déploiement passe d'une liste d'exclusion à une **liste d'autorisation** : la CI construit un dossier qui ne contient que `index.html`, `google8d2576bc6e0adcad.html`, `src/` et le contenu de `public/` à la racine, et ne déploie que ce dossier. Exclure `node_modules/` et les rapports de HTMLHint.
- Fichiers : `package.json`, `.gitignore`, `.github/workflows/deploy.yml`, configuration du lint, `CLAUDE.md` (et `.azureignore`, devenu inutile).
- Dépendances : aucune. Parallèle : oui, avec F1 et F2.
- Fin : le niveau 2 du §5 s'exécute (375 / 768 / 1280px, cibles ≥ 44px, contraste) ; lint et tests verts ; un test vérifie que le dossier construit contient exactement la liste autorisée ; après un push autorisé, en ligne, les pages répondent 200 (`/`, `/robots.txt`, une page de jeu) et `/test.js`, `/CLAUDE.md`, `/specs/refonte.md`, `/.claude/settings.json` répondent 404.

### F1 — Tokens et fondations visuelles
- Objectif : tokens du §2 dans `:root`, polices hébergées dans le dépôt, bordures, rayons, ombres, cibles ≥ 44px ; blocs code et terminal sombres.
- Fichiers : `src/style/global.css`, `<head>` des pages, fichiers de police.
- Dépendances : aucune. Parallèle : oui, avec F0 et F2.
- Fin : Stylelint vert ; contraste mesuré pour chaque couple texte/fond.

### F2 — Module de progression (logique pure)
- Objectif : XP (première réussite, approfondissement +1, Grid infini plafonné à 5/jour), série et record, statuts `TODO`/`RUNS`/`PASS`, succès datés, prochain succès, activité par jour (deux intensités), dernier jeu joué, bouton « Recommencer », clé unique versionnée, migration des anciennes clés. Date injectable.
- Fichiers : `src/utils/progress.js`, `progress.test.js`, commande de test dans `CLAUDE.md` et `deploy.yml`.
- Dépendances : aucune (les identifiants `gameId` / `levelId` sont des chaînes fournies par l'appelant). Parallèle : oui, avec F0 et F1.
- Fin : les scénarios du §5.1 passent, ainsi que les règles du §4 (plafond, statuts, succès, migration).

### F3 — Identifiants stables et catalogue
- Objectif : un `id` sur chaque niveau ou mission ; catalogue jeux → chapitres → niveaux (avec `advanced`), utilisable par l'accueil sans charger les scripts des jeux.
- Fichiers : `src/games/*/*.js`, `src/utils/catalogue.js`, tests (unicité des `id`, cohérence catalogue / jeux).
- Dépendances : décisions ouvertes « nommage des identifiants » et « missions ». Parallèle : non.
- Fin : toutes les réponses attendues restent acceptées ; `id` uniques par jeu.

### F4 — En-tête et navigation
- Objectif : navigation avec pastilles série et XP, états vide / en cours / terminé.
- Fichiers : `src/utils/utils.js`, `src/style/global.css`. Dépendances : F1, F2, F3. Parallèle : non.
- Fin : §5.2 aux trois largeurs ; « Affichage sans jouer » visible (pastille à 0).

### F5 — Gabarit de page de jeu
- Objectif : en-tête du jeu, bloc code, terminal de validation, liste des niveaux « Vu en cours » / « Approfondissement ».
- Fichiers : `global.css`, utilitaire JS partagé éventuel. Dépendances : F1, F2, F3.
- Parallèle : avec F4 si `global.css` est partagé par sections, sinon après F4. Fin : §5.2 sur une page témoin.

## Pages (en parallèle)

### P0 — Accueil
Bandeau « Reprendre », carte du parcours, « Ton activité », « Tes succès ». Fichiers : `index.html`, `src/style/home.css`, script d'accueil. Dépendances : F2, F3, F4. Fin : §5.2 puis §5.3, états vérifiés avec des progressions injectées.

### P1 à P11 — Un jeu par tâche
identify, quiz, find-error, html, styles, selectors, flex, flex-builder, flex-dispatch, grid, grid-debugger. Adopter le gabarit, enregistrer les réussites par `id`, supprimer les anciennes clés. Fichiers : le dossier du jeu et son test. Dépendances : F2, F3, F5. Fin : chaque réponse attendue acceptée ; +1 XP puis 0 en rejouant ; §5.2. Les six Fondamentaux peuvent être confiés ensemble pour rester homogènes.

### P12 — Grid infini
+1 XP par grille, plafond 5/jour, aucune contribution à la série. Dépendances : F2, F5. Fin : scénario « Rejouer », test du plafond, §5.2.

## Clôture

### R — Recette et déploiement
Passe §5.2 complète, checklist §5.3 sur captures, mise à jour de `CLAUDE.md` (clé commune, commandes de test), push avec accord. Fin : run « Deploy Static Website to Azure Web App » vert ; ni tests ni `node_modules` en ligne.
