#!/bin/bash
# arch-board.sh — gerencia o GitHub Projects board do arq-studio
# Uso: bash scripts/arch-board.sh <comando>
#
# Comandos:
#   status          — tabela por coluna
#   backfill        — preencher Priority+Size faltando
#   sync            — adicionar issues/PRs faltando ao board
#   report          — relatório markdown
#   set <N> <campo> <valor>  — atualizar campo de um item
#
# Config: preencher após criar o board no GitHub

set -e

REPO="roxdavirox/arq-studio"
PROJECT_NUMBER="${ARCH_PROJECT_NUMBER:-1}"

# ── IDs do board (preencher após criar com arch-board-init.sh) ───────────────
PROJECT_ID="${ARCH_PROJECT_ID:-}"
STATUS_FIELD_ID="${ARCH_STATUS_FIELD_ID:-}"
STATUS_BACKLOG="${ARCH_STATUS_BACKLOG:-}"
STATUS_TODO="${ARCH_STATUS_TODO:-}"
STATUS_IN_PROGRESS="${ARCH_STATUS_IN_PROGRESS:-}"
STATUS_IN_REVIEW="${ARCH_STATUS_IN_REVIEW:-}"
STATUS_DONE="${ARCH_STATUS_DONE:-}"

PRIORITY_FIELD_ID="${ARCH_PRIORITY_FIELD_ID:-}"
PRIORITY_URGENT="${ARCH_PRIORITY_URGENT:-}"
PRIORITY_HIGH="${ARCH_PRIORITY_HIGH:-}"
PRIORITY_MEDIUM="${ARCH_PRIORITY_MEDIUM:-}"
PRIORITY_LOW="${ARCH_PRIORITY_LOW:-}"

SIZE_FIELD_ID="${ARCH_SIZE_FIELD_ID:-}"
SIZE_XS="${ARCH_SIZE_XS:-}"
SIZE_S="${ARCH_SIZE_S:-}"
SIZE_M="${ARCH_SIZE_M:-}"
SIZE_L="${ARCH_SIZE_L:-}"
SIZE_XL="${ARCH_SIZE_XL:-}"

# ── Cores ────────────────────────────────────────────────────────────────────
RED="\033[0;31m"; GREEN="\033[0;32m"; YELLOW="\033[1;33m"
BLUE="\033[0;34m"; CYAN="\033[0;36m"; NC="\033[0m"

cmd="${1:-help}"

# ── status ───────────────────────────────────────────────────────────────────
if [ "$cmd" = "status" ]; then
  echo -e "${CYAN}ArqStudio Board — Status${NC}"
  echo ""
  gh project item-list "$PROJECT_NUMBER" --owner roxdavirox --format json \
    | jq -r '.items[] | [.title, .status, .priority // "—", .size // "—"] | @tsv' \
    | column -t -s $'\t'
  exit 0
fi

# ── sync ─────────────────────────────────────────────────────────────────────
if [ "$cmd" = "sync" ]; then
  echo -e "${CYAN}Sincronizando issues/PRs com o board...${NC}"
  gh issue list -R "$REPO" --state open --json number,title,nodeId --limit 100 \
    | jq -r '.[] | .nodeId' \
    | while read -r node_id; do
        gh api graphql -f query='
          mutation($projectId: ID!, $contentId: ID!) {
            addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
              item { id }
            }
          }
        ' -f projectId="$PROJECT_ID" -f contentId="$node_id" 2>/dev/null || true
      done
  echo -e "${GREEN}Sync concluído.${NC}"
  exit 0
fi

# ── set ──────────────────────────────────────────────────────────────────────
if [ "$cmd" = "set" ]; then
  ISSUE_N="$2"
  FIELD="$3"
  VALUE="$4"

  if [ -z "$ISSUE_N" ] || [ -z "$FIELD" ] || [ -z "$VALUE" ]; then
    echo "Uso: bash scripts/arch-board.sh set <N> <priority|size|status> <valor>"
    exit 1
  fi

  ISSUE_ID=$(gh issue view "$ISSUE_N" -R "$REPO" --json nodeId --jq '.nodeId')
  ITEM_ID=$(gh api graphql -f query='
    query($nodeId: ID!) {
      node(id: $nodeId) {
        ... on Issue { projectItems(first: 1) { nodes { id } } }
      }
    }
  ' -f nodeId="$ISSUE_ID" --jq '.data.node.projectItems.nodes[0].id')

  case "$FIELD" in
    status)
      case "$VALUE" in
        backlog)     OPT="$STATUS_BACKLOG" ;;
        todo)        OPT="$STATUS_TODO" ;;
        "in progress") OPT="$STATUS_IN_PROGRESS" ;;
        "in review") OPT="$STATUS_IN_REVIEW" ;;
        done)        OPT="$STATUS_DONE" ;;
        *) echo "Status inválido: $VALUE"; exit 1 ;;
      esac
      FID="$STATUS_FIELD_ID"
      ;;
    priority)
      case "$VALUE" in
        urgent) OPT="$PRIORITY_URGENT" ;;
        high)   OPT="$PRIORITY_HIGH" ;;
        medium) OPT="$PRIORITY_MEDIUM" ;;
        low)    OPT="$PRIORITY_LOW" ;;
        *) echo "Priority inválida: $VALUE"; exit 1 ;;
      esac
      FID="$PRIORITY_FIELD_ID"
      ;;
    size)
      case "$VALUE" in
        xs) OPT="$SIZE_XS" ;;
        s)  OPT="$SIZE_S" ;;
        m)  OPT="$SIZE_M" ;;
        l)  OPT="$SIZE_L" ;;
        xl) OPT="$SIZE_XL" ;;
        *) echo "Size inválido: $VALUE"; exit 1 ;;
      esac
      FID="$SIZE_FIELD_ID"
      # Aplicar label size:* na issue também
      gh issue edit "$ISSUE_N" -R "$REPO" --add-label "size:$VALUE" 2>/dev/null || true
      ;;
  esac

  gh api graphql -f query='
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId, itemId: $itemId,
        fieldId: $fieldId, value: {singleSelectOptionId: $value}
      }) { projectV2Item { id } }
    }
  ' -f projectId="$PROJECT_ID" -f itemId="$ITEM_ID" \
    -f fieldId="$FID" -f value="$OPT"

  echo -e "${GREEN}Issue #$ISSUE_N → $FIELD: $VALUE${NC}"
  exit 0
fi

# ── report ───────────────────────────────────────────────────────────────────
if [ "$cmd" = "report" ]; then
  echo "# ArqStudio Board — $(date '+%Y-%m-%d')"
  echo ""
  for status in Backlog Todo "In Progress" "In Review" Done; do
    echo "## $status"
    gh project item-list "$PROJECT_NUMBER" --owner roxdavirox --format json \
      | jq -r --arg s "$status" '.items[] | select(.status == $s) | "- [ ] \(.title)"'
    echo ""
  done
  exit 0
fi

echo "Uso: bash scripts/arch-board.sh <status|sync|set|report>"
echo ""
echo "Comandos:"
echo "  status              — tabela do board"
echo "  sync                — adicionar issues faltando"
echo "  set N campo valor   — atualizar campo"
echo "  report              — relatório markdown"
