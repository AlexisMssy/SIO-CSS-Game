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

## Vérifier avant de dire « fini »
- Tests : `node test.js && node --test html-levels.test.js selectors-levels.test.js coding-games.test.js progress.test.js`
- Lint (bloquant en CI) :
  - `npx -y htmlhint@1 "**/*.html"`
  - `npx -y eslint@8 "**/*.js" --ignore-path .gitignore`
  - Stylelint : `npx -y -p stylelint@16 -p stylelint-config-standard@36 stylelint "**/*.css" --ignore-path .gitignore --config-basedir "$(dirname "$(dirname "$(find ~/.npm/_npx -maxdepth 3 -type d -name stylelint-config-standard | head -1)")")"` (sans `--config-basedir`, la config n'est pas trouvée). Piège fréquent : `0px` est refusé, écrire `0`.
- Déploiement réussi = le run **« Deploy Static Website to Azure Web App »** du commit poussé est vert (pas le run GitHub Pages).
- Changement visuel : le dire clairement s'il n'a pas été vu dans un navigateur.
