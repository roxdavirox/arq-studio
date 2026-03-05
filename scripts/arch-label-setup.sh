#!/bin/bash
# arch-label-setup.sh — cria labels no repositório arq-studio
set -e

REPO="roxdavirox/arq-studio"
GREEN="\033[0;32m"; NC="\033[0m"

create_label() {
  local name="$1" color="$2" description="$3"
  gh label create "$name" --color "$color" --description "$description" -R "$REPO" 2>/dev/null \
    || gh label edit "$name" --color "$color" --description "$description" -R "$REPO" 2>/dev/null \
    || true
}

echo "Criando labels..."

# Priority
create_label "priority:urgent" "D93F0B" "Urgente — parar tudo"
create_label "priority:high"   "E4E669" "Alta prioridade"
create_label "priority:medium" "0075CA" "Média prioridade"
create_label "priority:low"    "CFE2F3" "Baixa prioridade"

# Size
create_label "size:xs" "C2E0C6" "< 10min — 1 arquivo trivial"
create_label "size:s"  "7BC67E" "~15min — pequena adição"
create_label "size:m"  "F9D0C4" "~30min — feature completa (máx)"
create_label "size:l"  "F29513" "> 30min — QUEBRAR antes"
create_label "size:xl" "D93F0B" "Nunca aceitar — sempre quebrar"

# Type
create_label "feature" "0E8A16" "Nova funcionalidade"
create_label "bug"     "D73A4A" "Correção de bug"
create_label "chore"   "E4E669" "Técnico / manutenção"
create_label "test"    "BFD4F2" "Testes"
create_label "docs"    "0075CA" "Documentação"
create_label "ci"      "CFE2F3" "CI/CD"
create_label "design"  "F9D0C4" "UI/UX / design system"

# Domain
create_label "video"        "5319E7" "Real-time video"
create_label "mobile"       "1D76DB" "Mobile-first"
create_label "api"          "C5DEF5" "AWS Lambda / API"
create_label "domain"       "E4E669" "Clean architecture / domain"
create_label "infra"        "CFE2F3" "Infrastructure / DynamoDB / S3"

echo -e "${GREEN}Labels criadas com sucesso!${NC}"
