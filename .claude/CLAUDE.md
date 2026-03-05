# arq-studio — Claude Code Instructions

## Projeto

Plataforma de consultoria arquitetônica com vídeo em tempo real para cliente.
Mobile-first PWA com portal do cliente, gerenciamento de projetos e consultas em vídeo.

## Stack

- **Frontend:** React 19 + Vite + TypeScript strict (apps/web)
- **Backend:** AWS Serverless Framework + Lambda (apps/api)
- **Video:** Daily.co realtime WebRTC
- **DB:** DynamoDB (PAY_PER_REQUEST)
- **Storage:** S3 presigned URLs
- **Emails:** AWS SES
- **FP:** @roxdavirox/fp-core (Result/Option pattern)
- **Monorepo:** Turborepo + pnpm workspaces
- **Node:** 22 (nvm)

## Arquitetura

```
packages/
  types/    → Branded types, entities, contracts
  domain/   → Clean arch: use cases + ports (sem infra)
  ui/       → Design system: tokens OKLCH + componentes React
apps/
  web/      → React SPA mobile-first
  api/      → Lambda handlers + infra adapters (DynamoDB/S3/Daily.co)
```

## Agents disponíveis

- **michelangelo** → UI/UX, React components, design tokens, mobile, video UI
- **rx-arquiteto** → Clean arch, domain, use cases, fp-core, Lambda, DynamoDB
- **rx-orchestrator** → Sprint planning, task breakdown, board
- **rx-qa** → Testes, coverage, mocks

## Board (GitHub Projects)

Mesmo padrão do mago-office:
- Labels: priority:*, size:*, feature, bug, chore, design, video, mobile, api, domain
- Status: Backlog → Todo → In Progress → In Review → Done
- Scripts em scripts/: arch-board.sh, branch-create.sh, pr-create.sh, pr-review.sh

## Regras fp-core (OBRIGATÓRIO)

```ts
// SEMPRE usar Result — NUNCA throw em use cases
import { ok, err } from '@roxdavirox/fp-core/result'
const result = await someUseCase(input)
if (result.isErr()) return errorResponse(result.error, 500)
return response(200, result.value)
```

## Regras mobile (OBRIGATÓRIO)

- Touch targets: min 44px height
- `WebkitTapHighlightColor: 'transparent'`
- `env(safe-area-inset-*)` em fixos
- `dvh` em vez de `vh`
- Fluid typography: `clamp()`
- Testar em 375px de largura

## Regras Git

- NUNCA commitar sem autorização explícita
- Branch base: sempre `develop`
- PR sempre para `develop`
- Mensagens em português: `feat(video): implementar controles de áudio`
- NUNCA commitar .env, secrets, credenciais AWS

## Comandos

```bash
# Desenvolvimento
source ~/.nvm/nvm.sh && nvm use 22
cd ~/lab/arch
pnpm dev          # turbo dev (web + api)

# Board
bash scripts/arch-board.sh status
bash scripts/branch-create.sh <N>
bash scripts/pr-create.sh <N>

# Deploy
pnpm build && cd apps/api && npx serverless deploy
```
