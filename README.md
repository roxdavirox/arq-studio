# Arq Studio

> Portal do cliente para consultoria arquitetônica com vídeo em tempo real — mobile-first PWA

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + Vite + TypeScript |
| Backend | AWS Lambda + API Gateway (Serverless Framework) |
| Video | Daily.co WebRTC |
| Banco | DynamoDB |
| Storage | S3 |
| Email | AWS SES |
| FP | @roxdavirox/fp-core (Result/Option) |
| Monorepo | Turborepo + pnpm workspaces |

## Arquitetura

```
arq-studio/
├── apps/
│   ├── web/          # React SPA mobile-first
│   └── api/          # AWS Lambda + Serverless Framework
├── packages/
│   ├── types/        # Branded types, entidades, contratos
│   ├── domain/       # Clean Architecture: use cases + ports
│   └── ui/           # Design system: tokens OKLCH + componentes
└── .github/
    └── workflows/    # CI, AI Review, Project Automation, Deploy
```

## Clean Architecture

```
packages/domain/
├── _ports/           # Interfaces (ProjectRepository, VideoProvider...)
├── projects/         # Use cases: getProject, createProject, listClientProjects, updateProjectStatus
├── consultations/    # Use cases: schedule, start, end, get
├── clients/          # Use cases: get, register
└── video/            # Use cases: join, getVideoToken
```

Todos os use cases retornam `Result<T, E>` — sem throws, sem nulls soltos.

## Começar

```bash
# Node 22
source ~/.nvm/nvm.sh && nvm use 22

# Instalar
pnpm install

# Desenvolvimento
pnpm dev

# Testes
pnpm test

# Build
pnpm build
```

## Board

```bash
bash scripts/arch-board.sh status
bash scripts/branch-create.sh <N>
bash scripts/pr-create.sh <N>
```

## Agents

| Agent | Domínio |
|-------|---------|
| `michelangelo` | UI/UX, React, design tokens, mobile, vídeo |
| `rx-arquiteto` | Clean arch, domain, Lambda, DynamoDB |
| `rx-orchestrator` | Sprint planning, board |
| `rx-qa` | Testes, coverage |

## GitHub Workflow

Seguindo o padrão `mago-office`:

- `ci.yml` — Typecheck → Lint → Test → Build
- `ai-review.yml` — AI review em PRs (self-hosted runner)
- `project-automation.yml` — Automação do GitHub Projects
- `deploy.yml` — Lambda (Serverless) + S3/CloudFront

## Design System (Michelangelo)

**Tokens OKLCH — paleta arquitetônica:**

- `colors.stone.*` — warm concrete (fundo, superfícies)
- `colors.terracotta.*` — acento principal
- Touch targets: 44px (confortável) / 56px (CTAs)
- Fluid typography: `clamp()`
- Bottom sheet com spring animation
- Safe areas para notch/home indicator
