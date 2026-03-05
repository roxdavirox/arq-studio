import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Container, Stack, Card, Badge, Spinner, colors, fontSizes, spacing, Button } from '@arq/ui'
import { ProjectStatusBadge } from '@/components/ProjectStatusBadge'
import { fetchProject, fetchProjectConsultations, fetchProjectFiles } from '@/api/client'
import { ConsultationCard } from '@/components/ConsultationCard'

export const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>()

  const project = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: !!projectId,
  })
  const consultations = useQuery({
    queryKey: ['project-consultations', projectId],
    queryFn: () => fetchProjectConsultations(projectId!),
    enabled: !!projectId,
  })
  const files = useQuery({
    queryKey: ['project-files', projectId],
    queryFn: () => fetchProjectFiles(projectId!),
    enabled: !!projectId,
  })

  if (project.isLoading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', paddingBlock: '4rem' }}>
        <Spinner size={32} />
      </Container>
    )
  }

  if (!project.data) return null

  const p = project.data

  return (
    <Container style={{ paddingBlock: spacing[6] }}>
      <Stack gap={6}>
        {/* Header */}
        <Stack gap={2}>
          <Stack direction="row" gap={2} align="center" justify="space-between">
            <h1 style={{ fontSize: fontSizes.xl, fontWeight: 700, color: colors.stone[900], margin: 0 }}>
              {p.name}
            </h1>
            <ProjectStatusBadge status={p.status} />
          </Stack>
          <p style={{ fontSize: fontSizes.sm, color: colors.stone[500], margin: 0 }}>
            {p.description}
          </p>
        </Stack>

        {/* Progress steps */}
        <ProjectProgress status={p.status} />

        {/* Consultations */}
        <section>
          <h2 style={{ fontSize: fontSizes.md, fontWeight: 600, color: colors.stone[700], marginBottom: spacing[3] }}>
            Consultas
          </h2>
          {consultations.isLoading && <Spinner />}
          <Stack gap={3}>
            {consultations.data?.map(c => <ConsultationCard key={c.id} consultation={c} />)}
          </Stack>
          <Button variant="secondary" fullWidth style={{ marginTop: spacing[3] }}>
            Agendar consulta
          </Button>
        </section>

        {/* Files */}
        <section>
          <h2 style={{ fontSize: fontSizes.md, fontWeight: 600, color: colors.stone[700], marginBottom: spacing[3] }}>
            Arquivos do projeto
          </h2>
          {files.isLoading && <Spinner />}
          <Stack gap={2}>
            {files.data?.map(f => (
              <Card key={f.id}>
                <Stack direction="row" gap={3} align="center" justify="space-between">
                  <span style={{ fontSize: fontSizes.sm, color: colors.stone[800] }}>{f.name}</span>
                  <Badge>{f.mimeType.split('/')[1].toUpperCase()}</Badge>
                </Stack>
              </Card>
            ))}
          </Stack>
        </section>
      </Stack>
    </Container>
  )
}

const STEPS = ['Briefing', 'Design', 'Aprovação', 'Execução', 'Entregue']
const STATUS_IDX: Record<string, number> = {
  briefing: 0, design: 1, approval: 2, execution: 3, delivered: 4,
}

const ProjectProgress = ({ status }: { status: string }) => {
  const current = STATUS_IDX[status] ?? 0
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {STEPS.map((step, i) => (
        <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem', alignItems: 'center' }}>
          <div
            style={{
              height: '0.25rem',
              width: '100%',
              borderRadius: '9999px',
              background: i <= current ? colors.terracotta[500] : colors.stone[200],
              transition: 'background 0.3s',
            }}
          />
          <span style={{ fontSize: '0.65rem', color: i === current ? colors.terracotta[600] : colors.stone[400], fontWeight: i === current ? 600 : 400 }}>
            {step}
          </span>
        </div>
      ))}
    </div>
  )
}
