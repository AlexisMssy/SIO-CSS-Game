#!/bin/bash
# Stop : contrôle complet quand l'agent pense avoir fini.
# - Lint en échec → bloquant (exit 2) : l'agent doit corriger.
# - Tests en échec → seulement signalés : la phase rouge du TDD reste possible ; la CI bloque le déploiement.
input=$(cat)
cd "$CLAUDE_PROJECT_DIR" || exit 0

lint_errors=""
html=$(npx -y htmlhint@1 "**/*.html" --ignore "dist/**,node_modules/**,reports/**,playwright-report/**,test-results/**" 2>&1) || lint_errors+=$'\n[HTMLHint]\n'"$html"
js=$(npx -y eslint@8 "**/*.js" --ignore-path .gitignore 2>&1) || lint_errors+=$'\n[ESLint]\n'"$js"
basedir=$(dirname "$(dirname "$(find ~/.npm/_npx -maxdepth 3 -type d -name stylelint-config-standard 2>/dev/null | head -1)")")
css=$(npx -y -p stylelint@16 -p stylelint-config-standard@36 stylelint "**/*.css" --ignore-path .gitignore --config-basedir "$basedir" 2>&1) || lint_errors+=$'\n[Stylelint]\n'"$css"

if [ -n "$lint_errors" ]; then
    # Évite une boucle infinie : si l'agent a déjà été renvoyé une fois, on signale sans bloquer.
    if [ "$(echo "$input" | jq -r '.stop_hook_active // false')" = "true" ]; then
        jq -n --arg msg "Lint toujours en échec après une relance :$lint_errors" '{systemMessage: $msg}'
        exit 0
    fi
    echo "Le lint échoue : corrige ces erreurs avant de dire que c'est fini.$lint_errors" >&2
    exit 2
fi

tests=$(node test.js 2>&1 && node --test html-levels.test.js selectors-levels.test.js coding-games.test.js progress.test.js build.test.js measure.test.js 2>&1)
if [ $? -ne 0 ]; then
    summary=$(echo "$tests" | grep -E "^✖|ℹ (pass|fail)" | head -15)
    jq -n --arg msg "Lint OK. Tests en échec (non bloquant — normal en phase rouge du TDD, sinon à corriger) :
$summary" '{systemMessage: $msg}'
fi
exit 0
