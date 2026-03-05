#!/bin/bash
# branch-create.sh — cria branch para uma issue e estima o tamanho
# Uso: bash scripts/branch-create.sh <ISSUE_NUMBER>

set -e

ISSUE_N="$1"
REPO="roxdavirox/arq-studio"
GREEN="\033[0;32m"; CYAN="\033[0;36m"; NC="\033[0m"

if [ -z "$ISSUE_N" ]; then
  echo "Uso: bash scripts/branch-create.sh <ISSUE_NUMBER>"
  exit 1
fi

# Obter título da issue
TITLE=$(gh issue view "$ISSUE_N" -R "$REPO" --json title --jq '.title')
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//' | cut -c1-40)

BRANCH="feat/issue-${ISSUE_N}-${SLUG}"

echo -e "${CYAN}Criando branch: $BRANCH${NC}"
git checkout develop 2>/dev/null || git checkout main
git pull
git checkout -b "$BRANCH"

echo -e "${GREEN}Branch '$BRANCH' criada a partir de develop.${NC}"
echo ""
echo "Próximos passos:"
echo "  1. Implementar (máx 30min)"
echo "  2. bash scripts/pr-create.sh $ISSUE_N"
