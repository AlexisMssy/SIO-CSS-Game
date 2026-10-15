#!/bin/bash
# PostToolUse (Edit|Write) : ESLint sur le fichier .js qui vient d'être modifié.
# Bloquant (exit 2) : une erreur de lint n'est jamais voulue.
file=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')
case "$file" in
    *.js) ;;
    *) exit 0 ;;
esac
[ -f "$file" ] || exit 0

if ! output=$(npx -y eslint@8 --no-eslintrc --config "$CLAUDE_PROJECT_DIR/.eslintrc.json" "$file" 2>&1); then
    echo "ESLint a trouvé des erreurs dans $file — corrige-les avant de continuer :" >&2
    echo "$output" >&2
    exit 2
fi
exit 0
