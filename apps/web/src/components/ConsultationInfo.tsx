import { Calendar, Clock } from 'lucide-react'
import { Card, Stack, colors, fontSizes } from '@arq/ui'
import type { Consultation } from '@arq/types'

export const ConsultationInfo = ({ consultation }: { consultation: Consultation }) => {
  const date = new Date(consultation.scheduledAt)
  return (
    <Card>
      <Stack gap={4}>
        <h2 style={{ margin: 0, fontSize: fontSizes.lg, fontWeight: 700, color: colors.stone[900] }}>
          Consulta agendada
        </h2>
        <Stack gap={2}>
          <Stack direction="row" gap={2} align="center">
            <Calendar size={18} color={colors.terracotta[500]} />
            <span style={{ fontSize: fontSizes.base, color: colors.stone[700] }}>
              {date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </Stack>
          <Stack direction="row" gap={2} align="center">
            <Clock size={18} color={colors.terracotta[500]} />
            <span style={{ fontSize: fontSizes.base, color: colors.stone[700] }}>
              {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </Stack>
        </Stack>
        {consultation.notes && (
          <p style={{ fontSize: fontSizes.sm, color: colors.stone[600], margin: 0 }}>
            {consultation.notes}
          </p>
        )}
      </Stack>
    </Card>
  )
}
