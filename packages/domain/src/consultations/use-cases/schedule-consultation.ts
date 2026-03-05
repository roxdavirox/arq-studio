import { ok, err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { Consultation, ProjectId, ClientId, ArchitectId } from '@arq/types'
import type { ConsultationRepository } from '../../_ports/consultation.repository'
import type { ProjectRepository } from '../../_ports/project.repository'
import type { NotificationProvider } from '../../_ports/notification.provider'

interface Deps {
  consultationRepo: ConsultationRepository
  projectRepo: ProjectRepository
  notifications: NotificationProvider
}

interface ScheduleInput {
  projectId: ProjectId
  architectId: ArchitectId
  clientId: ClientId
  scheduledAt: Date
}

type ScheduleError = 'PROJECT_NOT_FOUND' | 'PAST_DATE' | 'DB_ERROR'

export const makeScheduleConsultation =
  ({ consultationRepo, projectRepo, notifications }: Deps) =>
  async (input: ScheduleInput): Promise<Result<Consultation, ScheduleError>> => {
    if (input.scheduledAt <= new Date()) return err('PAST_DATE')

    const projectResult = await projectRepo.findById(input.projectId)
    if (projectResult.isErr()) return err('PROJECT_NOT_FOUND')

    const createResult = await consultationRepo.create({
      projectId: input.projectId,
      architectId: input.architectId,
      clientId: input.clientId,
      scheduledAt: input.scheduledAt,
      startedAt: null,
      endedAt: null,
      status: 'scheduled',
      roomUrl: null,
      notes: null,
    })

    if (createResult.isErr()) return err('DB_ERROR')

    // Fire-and-forget notification (non-critical)
    notifications
      .sendEmail(
        projectResult.value.clientId,
        'Consulta agendada',
        `Sua consulta foi agendada para ${input.scheduledAt.toLocaleString('pt-BR')}`,
      )
      .catch(() => void 0)

    return ok(createResult.value)
  }
