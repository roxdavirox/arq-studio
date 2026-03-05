import type { Result } from '@roxdavirox/fp-core/result'
import type { Project, ClientId } from '@arq/types'
import type { ProjectRepository } from '../_ports/project.repository'

interface Deps {
  projectRepo: ProjectRepository
}

export const makeListClientProjects =
  ({ projectRepo }: Deps) =>
  async (clientId: ClientId): Promise<Result<Project[], 'DB_ERROR'>> =>
    projectRepo.findByClient(clientId)
