#!/bin/bash
# scripts/pr-review.sh — AI Code Review via OpenCode CLI
# Uso: ./scripts/pr-review.sh <PR_NUMBER> [--post]

set -e

PR_NUMBER=""
POST_COMMENT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --post) POST_COMMENT="--post"; shift ;;
    *) PR_NUMBER="$1"; shift ;;
  esac
done

if [ -z "$PR_NUMBER" ]; then
  echo "Uso: ./scripts/pr-review.sh <PR_NUMBER> [--post]"
  exit 1
fi

MODEL="${OPENCODE_MODEL:-anthropic/claude-sonnet-4-20250514}"
OPENCODE="${OPENCODE_BIN:-/home/rx/.opencode/bin/opencode}"
REPO_DIR="${REPO_DIR:-$(git rev-parse --show-toplevel)}"

if [ ! -f "$OPENCODE" ]; then
  echo "Erro: opencode não encontrado. Instale em: https://opencode.ai"
  exit 1
fi

cd "$REPO_DIR"

PR_TITLE=$(gh pr view "$PR_NUMBER" --json title --jq '.title')
PR_BODY=$(gh pr view "$PR_NUMBER" --json body --jq '.body // ""' | head -c 2000)
PR_DIFF=$(gh pr diff "$PR_NUMBER" | head -c 40000)

echo "Analisando PR #$PR_NUMBER: $PR_TITLE"
echo "Modelo: $MODEL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PROMPT="Faça code review desta PR do projeto arq-studio.

**Stack:** React 19 + Vite + TypeScript strict + Turborepo + AWS Serverless Framework + fp-core (Result/Option pattern) + Clean Architecture + Daily.co (video realtime) + DynamoDB.

**Princípios do projeto:**
- Mobile-first: toque targets >= 44px, safe-area-inset, fluid typography com clamp()
- fp-core: Result pattern em TODOS os use cases (sem throws, sem nulls soltos)
- Clean Arch: handlers só orquestram, lógica no domain, infra via ports
- WCAG 2.2 AA: contraste 4.5:1, keyboard nav, aria
- Michelangelo: design tokens OKLCH, componentes sem CSS runtime

**PR #$PR_NUMBER: $PR_TITLE**

$PR_BODY

**Diff:**
\`\`\`diff
$PR_DIFF
\`\`\`

Avalie:
1. **Bugs** — erros que quebram funcionalidade
2. **fp-core** — uso correto de Result/Option (sem throws, isOk()/isErr())
3. **Clean Arch** — violações de camadas (infra no domain, etc.)
4. **Mobile UX** — touch targets, safe areas, responsividade
5. **Acessibilidade** — WCAG 2.2, ARIA, keyboard nav
6. **Performance** — renders desnecessários, bundle size, lazy loading
7. **Segurança** — injection, CORS, auth em Lambda handlers

Use: ✅ aprovado | ⚠️ atenção | ❌ bloqueante"

REVIEW=$("$OPENCODE" chat --model "$MODEL" --no-interactive "$PROMPT" 2>/dev/null)

if [ -n "$POST_COMMENT" ]; then
  # Deletar comentários anteriores do bot
  gh pr view "$PR_NUMBER" --json comments --jq '.comments[] | select(.author.login == "github-actions[bot]") | .databaseId' \
    | while read -r id; do
        gh api "repos/{owner}/{repo}/issues/comments/$id" -X DELETE 2>/dev/null || true
      done

  gh pr comment "$PR_NUMBER" --body "## AI Code Review — arq-studio

$REVIEW

---
*Modelo: $MODEL*"

  echo "Review postado na PR #$PR_NUMBER"
else
  echo "$REVIEW"
fi
