import { useQuery } from '@tanstack/react-query'
import { Card, Stack, Badge, Avatar, Spinner, Container, colors, fontSizes, spacing } from '@arq/ui'
import type { Project } from '@arq/types'
import { ProjectStatusBadge } from '@/components/ProjectStatusBadge'
import { ConsultationCard } from '@/components/ConsultationCard'
import { fetchProjects, fetchUpcomingConsultations } from '@/api/client'
import { useCurrentClient } from '@/hooks/useCurrentClient'

export const DashboardPage = () => {
  const { client } = useCurrentClient()
  const projects = useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
  const consultations = useQuery({ queryKey: ['consultations', 'upcoming'], queryFn: fetchUpcomingConsultations })

  return (
    <Container style={{ paddingBlock: spacing[6] }}>
      <Stack gap={6}>
        {/* Greeting */}
        <Stack direction="row" gap={3} align="center">
          <Avatar name={client?.name ?? 'Cliente'} src={null} size={48} />
          <Stack gap={1}>
            <span style={{ fontSize: fontSizes.sm, color: colors.stone[500] }}>Bom dia,</span>
            <h1 style={{ fontSize: fontSizes.xl, fontWeight: 700, color: colors.stone[900], margin: 0 }}>
              {client?.name?.split(' ')[0] ?? 'Cliente'}
            </h1>
          </Stack>
        </Stack>

        {/* Active projects */}
        <section aria-labelledby="projects-heading">
          <h2
            id="projects-heading"
            style={{ fontSize: fontSizes.md, fontWeight: 600, color: colors.stone[700], marginBottom: spacing[3] }}
          >
            Seus projetos
          </h2>
          {projects.isLoading && <Spinner />}
          {projects.data?.length === 0 && (
            <Card>
              <span style={{ fontSize: fontSizes.sm, color: colors.stone[500] }}>
                Nenhum projeto ativo ainda.
              </span>
            </Card>
          )}
          <Stack gap={3}>
            {projects.data?.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Stack>
        </section>

        {/* Upcoming consultations */}
        <section aria-labelledby="consultations-heading">
          <h2
            id="consultations-heading"
            style={{ fontSize: fontSizes.md, fontWeight: 600, color: colors.stone[700], marginBottom: spacing[3] }}
          >
            Próximas consultas
          </h2>
          {consultations.isLoading && <Spinner />}
          {consultations.data?.length === 0 && (
            <Card>
              <span style={{ fontSize: fontSizes.sm, color: colors.stone[500] }}>
                Nenhuma consulta agendada.
              </span>
            </Card>
          )}
          <Stack gap={3}>
            {consultations.data?.map(c => (
              <ConsultationCard key={c.id} consultation={c} />
            ))}
          </Stack>
        </section>
      </Stack>
    </Container>
  )
}

const ProjectCard = ({ project }: { project: Project }) => (
  <Card interactive>
    <Stack gap={3}>
      <Stack direction="row" gap={2} align="center" justify="space-between">
        <span style={{ fontSize: fontSizes.base, fontWeight: 600, color: colors.stone[900] }}>
          {project.name}
        </span>
        <ProjectStatusBadge status={project.status} />
      </Stack>
      <span style={{ fontSize: fontSizes.sm, color: colors.stone[500] }}>
        {project.description}
      </span>
    </Stack>
  </Card>
)
