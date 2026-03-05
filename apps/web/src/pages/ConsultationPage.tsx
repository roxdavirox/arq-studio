import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Spinner, colors, fontSizes, Container, Stack, Button } from '@arq/ui'
import { VideoRoom } from '@/components/VideoRoom'
import { ConsultationInfo } from '@/components/ConsultationInfo'
import { fetchConsultation } from '@/api/client'
import { useCurrentClient } from '@/hooks/useCurrentClient'

export const ConsultationPage = () => {
  const { consultationId } = useParams<{ consultationId: string }>()
  const { client } = useCurrentClient()
  const { data: consultation, isLoading } = useQuery({
    queryKey: ['consultation', consultationId],
    queryFn: () => fetchConsultation(consultationId!),
    enabled: !!consultationId,
  })

  if (isLoading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', paddingBlock: '4rem' }}>
        <Spinner size={32} />
      </Container>
    )
  }

  if (!consultation) {
    return (
      <Container style={{ paddingBlock: '2rem' }}>
        <span style={{ color: colors.stone[500] }}>Consulta não encontrada.</span>
      </Container>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      {/* Video area — full screen on mobile */}
      {consultation.status === 'active' && consultation.roomUrl ? (
        <VideoRoom
          roomUrl={consultation.roomUrl}
          clientId={client?.id ?? ''}
          clientName={client?.name ?? 'Cliente'}
        />
      ) : (
        <Container style={{ paddingBlock: '2rem' }}>
          <Stack gap={4}>
            <ConsultationInfo consultation={consultation} />
            {consultation.status === 'scheduled' && (
              <Button variant="primary" fullWidth>
                Entrar na consulta
              </Button>
            )}
            {consultation.status === 'ended' && (
              <span style={{ fontSize: fontSizes.sm, color: colors.stone[500] }}>
                Esta consulta já foi encerrada.
              </span>
            )}
          </Stack>
        </Container>
      )}
    </div>
  )
}
