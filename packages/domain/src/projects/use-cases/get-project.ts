import { ok, err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { Project, ProjectId, ClientId } from '@arq/types'
import type { ProjectRepository } from '../_ports/project.repository'

interface Deps {
  projectRepo: ProjectRepository
}

type GetProjectError = 'NOT_FOUND' | 'DB_ERROR' | 'UNAUTHORIZED'

export const makeGetProject =
  ({ projectRepo }: Deps) =>
  async (id: ProjectId, requesterId: ClientId | string): Promise<Result<Project, GetProjectError>> => {
    const result = await projectRepo.findById(id)

    if (result.isErr()) {
      return result.error === 'NOT_FOUND' ? err('NOT_FOUND') : err('DB_ERROR')
    }

    const project = result.value

    // Authorization: only project's client or architect can access
    const isAuthorized = project.clientId === requesterId || project.architectId === requesterId
    if (!isAuthorized) return err('UNAUTHORIZED')

    return ok(project)
  }
