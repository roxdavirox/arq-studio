#!/bin/bash
# pr-create.sh — cria PR linkando à issue
# Uso: bash scripts/pr-create.sh <ISSUE_NUMBER>

set -e

ISSUE_N="$1"
REPO="roxdavirox/arq-studio"

if [ -z "$ISSUE_N" ]; then
  echo "Uso: bash scripts/pr-create.sh <ISSUE_NUMBER>"
  exit 1
fi

TITLE=$(gh issue view "$ISSUE_N" -R "$REPO" --json title --jq '.title')
BRANCH=$(git branch --show-current)

gh pr create \
  --repo "$REPO" \
  --title "$TITLE" \
  --base develop \
  --head "$BRANCH" \
  --body "$(cat <<EOF
Closes #$ISSUE_N

## Mudanças
-

## Checklist
- [ ] Typecheck passa
- [ ] Testes passam
- [ ] Mobile testado (375px)
- [ ] fp-core Result pattern usado corretamente
- [ ] WCAG 2.2 AA (contraste, keyboard nav, ARIA)
EOF
)"

echo "PR criada para issue #$ISSUE_N"
