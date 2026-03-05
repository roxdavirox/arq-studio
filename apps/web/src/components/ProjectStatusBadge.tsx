import { Badge } from '@arq/ui'
import type { ProjectStatus } from '@arq/types'

const STATUS_LABELS: Record<ProjectStatus, string> = {
  briefing: 'Briefing',
  design: 'Design',
  approval: 'Aprovação',
  execution: 'Execução',
  delivered: 'Entregue',
}

const STATUS_VARIANTS: Record<ProjectStatus, 'default' | 'info' | 'warning' | 'success'> = {
  briefing: 'default',
  design: 'info',
  approval: 'warning',
  execution: 'warning',
  delivered: 'success',
}

export const ProjectStatusBadge = ({ status }: { status: ProjectStatus }) => (
  <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
)
