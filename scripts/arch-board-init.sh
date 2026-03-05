#!/bin/bash
# arch-board-init.sh — cria o GitHub Project board para arq-studio
# e popula os IDs no arquivo .env.board
#
# Requer: gh CLI autenticado com scope 'project'
# Uso: bash scripts/arch-board-init.sh

set -e

REPO="roxdavirox/arq-studio"
OWNER="roxdavirox"
CYAN="\033[0;36m"; GREEN="\033[0;32m"; NC="\033[0m"

echo -e "${CYAN}Criando GitHub Project board para $REPO...${NC}"

# 1. Criar project
PROJECT_ID=$(gh api graphql -f query='
  mutation($ownerId: ID!, $title: String!) {
    createProjectV2(input: {ownerId: $ownerId, title: $title}) {
      projectV2 { id number }
    }
  }
' -f ownerId="$(gh api graphql -f query='query{viewer{id}}' --jq '.data.viewer.id')" \
  -f title="ArqStudio" \
  --jq '.data.createProjectV2.projectV2.id')

echo "PROJECT_ID=$PROJECT_ID"

# 2. Obter IDs dos campos existentes (Status)
FIELDS=$(gh api graphql -f query="
  query {
    node(id: \"$PROJECT_ID\") {
      ... on ProjectV2 {
        fields(first: 20) {
          nodes {
            ... on ProjectV2SingleSelectField { id name options { id name } }
          }
        }
      }
    }
  }
" --jq '.data.node.fields.nodes[] | select(.name != null)')

echo ""
echo -e "${CYAN}Campos do board:${NC}"
echo "$FIELDS" | jq -r '"  \(.name): \(.id)"'

# 3. Adicionar campos Priority e Size
STATUS_FIELD_ID=$(echo "$FIELDS" | jq -r 'select(.name == "Status") | .id')
echo ""
echo -e "${GREEN}Copie os IDs abaixo para .env.board e para o project-automation.yml:${NC}"
echo ""
echo "ARCH_PROJECT_ID=$PROJECT_ID"
echo "ARCH_PROJECT_NUMBER=1  # ajustar se necessário"
echo "ARCH_STATUS_FIELD_ID=$STATUS_FIELD_ID"
echo "ARCH_STATUS_TODO=$(echo "$FIELDS" | jq -r 'select(.name == "Status") | .options[] | select(.name == "Todo") | .id')"
echo "ARCH_STATUS_IN_PROGRESS=$(echo "$FIELDS" | jq -r 'select(.name == "Status") | .options[] | select(.name == "In Progress") | .id')"
echo "ARCH_STATUS_IN_REVIEW=$(echo "$FIELDS" | jq -r 'select(.name == "Status") | .options[] | select(.name == "In Review") | .id' || echo 'criar manualmente')"
echo "ARCH_STATUS_DONE=$(echo "$FIELDS" | jq -r 'select(.name == "Status") | .options[] | select(.name == "Done") | .id')"
echo ""
echo -e "${CYAN}Próximos passos:${NC}"
echo "1. Adicionar campos 'Priority' e 'Size' (single select) no board pela UI"
echo "2. Preencher os IDs no .env.board"
echo "3. Configurar vars do repositório no GitHub com os IDs"
echo "4. bash scripts/arch-label-setup.sh  # cria labels"
