import { err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { Project, ProjectId, ProjectStatus } from '@arq/types'
import type { ProjectRepository } from '../_ports/project.repository'

interface Deps {
  projectRepo: ProjectRepository
}

const VALID_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  briefing: ['design'],
  design: ['approval', 'briefing'],
  approval: ['execution', 'design'],
  execution: ['delivered'],
  delivered: [],
}

export const makeUpdateProjectStatus =
  ({ projectRepo }: Deps) =>
  async (
    id: ProjectId,
    newStatus: ProjectStatus,
  ): Promise<Result<Project, 'NOT_FOUND' | 'DB_ERROR' | 'INVALID_TRANSITION'>> => {
    const current = await projectRepo.findById(id)
    if (current.isErr()) return current

    const allowed = VALID_TRANSITIONS[current.value.status]
    if (!allowed.includes(newStatus)) return err('INVALID_TRANSITION')

    return projectRepo.update(id, { status: newStatus })
  }
