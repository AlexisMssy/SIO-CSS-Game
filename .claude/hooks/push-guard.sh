#!/bin/bash
# PreToolUse (Bash) : bloque uniquement les commandes qui contiennent réellement « git push »,
# y compris enchaînées (&&, ;, |) ou avec des options (git -C dossier push).
command=$(jq -r '.tool_input.command // empty')
if printf '%s' "$command" | grep -Eq '(^|[;&|(`[:space:]])git([[:space:]]+-[^[:space:]]+([[:space:]]+[^-[:space:]][^[:space:]]*)?)*[[:space:]]+push([[:space:]]|$)'; then
    echo "Push bloqué : un push sur main déploie en production. Demande l'accord explicite de l'enseignant et laisse-le pousser lui-même." >&2
    exit 2
fi
exit 0
