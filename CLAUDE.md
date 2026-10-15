# SIO CSS Game

Jeux pédagogiques HTML/CSS pour des étudiants de **BTS SIO 1re année** qui découvrent le code. Site statique (HTML/CSS/JS vanilla, aucun build, aucun serveur).

## Public et pédagogie
- Les joueurs sont débutants : consignes et messages d'erreur courts, en français, sans jargon non vu en cours.
- Chaque jeu suit le programme B1 (séances 4 à 10), listé dans `programme.md` : à lire avant de créer ou classer un niveau. Toute notion absente de ce fichier porte `advanced: true` et s'affiche « Approfondissement » ; en cas de doute, demander à l'enseignant plutôt que deviner. Les niveaux du cours viennent toujours avant les approfondissements, numérotés à la suite.
- Les jeux sont indépendants : un jeu = un dossier dans `src/games/`, sa page, son script, sa progression `localStorage` avec son propre préfixe. Seuls `src/utils/utils.js` (navigation partagée) et `src/style/` sont communs.

## Règles non négociables
- **Ne jamais publier les réponses** : aucun corrigé dans le dépôt (`docs/` et les fichiers `*correction*` sont ignorés par git ; tout fichier commité est mis en ligne). Ne pas afficher de réponse dans l'interface, le README ou les messages de commit.
- **Chaque bonne réponse doit être testée réellement** : tout niveau ajouté ou modifié doit avoir un test qui joue la réponse attendue et vérifie qu'elle est acceptée. Une réponse « évidente » qui ne passe pas la validation est le bug le plus fréquent du projet.
- Un push sur `main` déploie en production (Azure) : ne pas pousser sans accord explicite.
- **Déploiement par liste d'autorisation** : seul `dist/` est mis en ligne, construit par `build.js` à partir de `index.html`, `google8d2576bc6e0adcad.html`, `src/` et du contenu de `public/` (à la racine). Tout autre fichier reste hors ligne ; `build.test.js` vérifie la liste exacte. Ne rien ajouter à cette liste sans accord de l'enseignant, et ne jamais placer de test, de corrigé ou d'outil dans `src/` (tout ce qui s'y trouve est publié). Le déploiement (`clean: true`) efface en ligne tout fichier absent de `dist/`.
- Playwright (`package.json`) sert uniquement aux mesures : jamais chargé par une page.

## Vérifier avant de dire « fini »
- Installation (une fois) : `npm ci && npx playwright install chromium`
- Tests : `node test.js && node --test html-levels.test.js selectors-levels.test.js coding-games.test.js progress.test.js build.test.js measure.test.js`
- Mesures navigateur (§5.2 : débordement à 375 / 768 / 1280px, cibles ≥ 44px, contraste AA) : `node measure.js` mesure toutes les pages de `dist/` ; seules les pages listées dans `measure-blocking.txt` font échouer (et bloquent le déploiement). `node measure.js src/games/flex/flex.html` mesure une page et échoue au moindre problème. Une tâche qui termine une page l'ajoute à `measure-blocking.txt`.
- Lint (bloquant en CI) :
  - `npx -y htmlhint@1 "**/*.html" --ignore "dist/**,node_modules/**,reports/**,playwright-report/**,test-results/**"` (sans `--ignore`, les pages de `dist/` sont lues en double)
  - `npx -y eslint@8 "**/*.js" --ignore-path .gitignore`
  - Stylelint : `npx -y -p stylelint@16 -p stylelint-config-standard@36 stylelint "**/*.css" --ignore-path .gitignore --config-basedir "$(dirname "$(dirname "$(find ~/.npm/_npx -maxdepth 3 -type d -name stylelint-config-standard | head -1)")")"` (sans `--config-basedir`, la config n'est pas trouvée). Piège fréquent : `0px` est refusé, écrire `0`.
- Déploiement réussi = le run **« Deploy Static Website to Azure Web App »** du commit poussé est vert (pas le run GitHub Pages).
- Après déploiement, vérifier en ligne : `/`, `/robots.txt` et une page de jeu répondent 200 ; `/test.js`, `/CLAUDE.md`, `/specs/refonte.md`, `/.claude/settings.json` répondent 404.
- Changement visuel : le dire clairement s'il n'a pas été vu dans un navigateur.
