import { useNavigate } from 'react-router-dom'
import { Video, Calendar } from 'lucide-react'
import { Card, Stack, Badge, Button, colors, fontSizes } from '@arq/ui'
import type { Consultation } from '@arq/types'

export const ConsultationCard = ({ consultation }: { consultation: Consultation }) => {
  const navigate = useNavigate()
  const isActive = consultation.status === 'active'
  const isScheduled = consultation.status === 'scheduled'
  const date = new Date(consultation.scheduledAt)

  return (
    <Card>
      <Stack gap={3}>
        <Stack direction="row" gap={2} align="flex-start" justify="space-between">
          <Stack direction="row" gap={2} align="center">
            <div
              aria-hidden="true"
              style={{
                width: 40,
                height: 40,
                borderRadius: '0.75rem',
                background: isActive ? 'oklch(95% 0.07 145)' : colors.stone[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isActive ? 'oklch(38% 0.12 145)' : colors.stone[400],
              }}
            >
              <Video size={20} />
            </div>
            <Stack gap={0.5}>
              <span style={{ fontSize: fontSizes.base, fontWeight: 600, color: colors.stone[900] }}>
                Consulta com arquiteto
              </span>
              <Stack direction="row" gap={1} align="center">
                <Calendar size={13} color={colors.stone[400]} />
                <span style={{ fontSize: fontSizes.xs, color: colors.stone[500] }}>
                  {date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </Stack>
            </Stack>
          </Stack>
          <ConsultationStatusBadge status={consultation.status} />
        </Stack>

        {(isActive || isScheduled) && (
          <Button
            variant={isActive ? 'primary' : 'secondary'}
            size="sm"
            fullWidth
            onClick={() => navigate(`/consultations/${consultation.id}`)}
          >
            {isActive ? 'Entrar agora' : 'Ver detalhes'}
          </Button>
        )}
      </Stack>
    </Card>
  )
}

const ConsultationStatusBadge = ({ status }: { status: Consultation['status'] }) => {
  const map = {
    scheduled: { label: 'Agendada', variant: 'info' as const },
    active: { label: 'Ao vivo', variant: 'success' as const },
    ended: { label: 'Encerrada', variant: 'default' as const },
    cancelled: { label: 'Cancelada', variant: 'error' as const },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}
