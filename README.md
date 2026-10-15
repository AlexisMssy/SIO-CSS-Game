## SIO CSS Game

Ce dépôt contient des jeux pédagogiques pour reconnaître, lire et écrire du HTML et du CSS.

### Organisation
- `src/` : code des jeux (HTML + JS + CSS mutualisés). C’est la seule source de vérité chargée dans les pages.
- `src/games/identify/` : reconnaître si un extrait est du HTML ou du CSS.
- `src/games/quiz/` : comprendre un extrait avec des questions à réponses multiples.
- `src/games/find-error/` : repérer et corriger des erreurs HTML/CSS.
- `src/games/html/` : jeu d’entraînement aux balises HTML et à la structure sémantique.
- `src/games/styles/` : jeu d’entraînement aux propriétés CSS de base.
- `src/games/selectors/` : sélecteurs de balise, classe, identifiant, descendants, enfants directs, groupes et combinaisons.
- `src/games/flex/` : atelier Flexbox en 20 défis, des axes aux propriétés de croissance des éléments.
- `src/games/flex-builder/` : mode de composition visuelle Flexbox en huit défis.
- `src/games/flex-dispatch/` : prototype visuel de tri de colis avec dix missions Flexbox évaluées sur leur position réelle.
- `src/games/grid/` : atelier CSS Grid en 30 défis, des colonnes aux zones nommées.
- `src/games/grid-debugger/` : huit missions de débogage CSS Grid centrées sur les lignes, colonnes et espacements.
- `src/games/grid-infinite/` : défis Grid sans fin, avec génération cyclique de pistes, placements et zones nommées.
- `src/games/square/` et `src/games/bootstrap/` : anciens jeux, actuellement désactivés dans l’interface.
- `public/` : assets statiques placés à la racine lors du déploiement (`favicon.ico`, `robots.txt`, `sitemap.xml`, etc.).
- `docs/` : corrigés et fichiers pédagogiques. Ils ne doivent **pas** être mis en ligne.

### Progression pédagogique B1
Les jeux actifs suivent les supports des séances 4 à 10 : fonctionnement du Web, HTML/CSS et Git, structure sémantique et box model, sélecteurs, cascade, unités, `display`, positionnement, Flexbox et CSS Grid. Les exercices qui dépassent les objectifs obligatoires portent une étoile et le libellé « Approfondissement »; ce repère distingue le contenu hors programme sans modifier le fonctionnement des jeux. Les jeux Carré Media Queries et Bootstrap restent inchangés.

### Déploiement
Un push sur `main` lance `.github/workflows/deploy.yml` : tests, lint, construction du paquet, mesures en navigateur, puis déploiement sur Azure.

Le paquet est construit par **liste d'autorisation** (`node build.js`) dans `dist/`, seul dossier mis en ligne : `index.html`, la page de vérification Google, `src/` et le contenu de `public/` placé à la racine (`/robots.txt`, `/favicon.ico`, `/sitemap.xml`). Tout le reste (tests, `specs/`, `docs/`, `node_modules/`, configuration) reste hors ligne. Le déploiement supprime en ligne tout fichier absent de `dist/`.

Après un déploiement, vérifier que `/robots.txt` répond 200 et que `/test.js` répond 404.

### Notes
- `npm ci` installe l'outillage de développement (Playwright, pour les mesures en navigateur ; jamais chargé par les pages).
- `node build.js` puis `npx serve dist` reproduit le site en ligne.
- Tests et mesures : voir `CLAUDE.md`.
