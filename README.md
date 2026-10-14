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
1. Copier tout le dépôt (ou configurer Azure Static Web Apps) de manière à exposer le contenu de `public/` à la racine du site (`/favicon.ico`, `/robots.txt`, etc.). Dans le workflow GitHub (`.github/workflows/deploy.yml`), l'étape `cp -R public/. .` s'en charge avant le déploiement.
2. S’assurer que `docs/` est exclu de la pipeline (ignore Azure deploy ou étape de copie dédiée).
3. Servir également `src/` tel quel pour que les chemins relatifs (`src/games/...`) restent accessibles.

#### Exemple Azure (GitHub Actions ou pipeline YAML)
- Ajouter une étape `cp -R public/. $DEPLOY_DIR` juste après l’étape de build pour recopier les fichiers racine attendus.
- Définir une variable d’environnement `DEPLOY_EXCLUDE=docs` ou utiliser le fichier `.azureignore` fourni pour empêcher la copie de `docs/`.
- Vérifier après déploiement que `https://votre-domaine/robots.txt` (ainsi que `/favicon.ico` et `/sitemap.xml`) servent bien les fichiers copiés depuis `public/`.

### Notes
- Un simple `npx serve` à la racine du projet reproduit la structure de production (penser à servir également `public/`).
- Lancer les tests avec `node test.js` et `node --test html-levels.test.js selectors-levels.test.js coding-games.test.js`.
