import { ok, err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { Project, ClientId, ArchitectId } from '@arq/types'
import type { ProjectRepository } from '../_ports/project.repository'
import type { ClientRepository } from '../_ports/client.repository'

interface Deps {
  projectRepo: ProjectRepository
  clientRepo: ClientRepository
}

interface CreateProjectInput {
  name: string
  description: string
  clientId: ClientId
  architectId: ArchitectId
}

type CreateProjectError = 'CLIENT_NOT_FOUND' | 'DB_ERROR' | 'INVALID_INPUT'

export const makeCreateProject =
  ({ projectRepo, clientRepo }: Deps) =>
  async (input: CreateProjectInput): Promise<Result<Project, CreateProjectError>> => {
    if (!input.name.trim()) return err('INVALID_INPUT')

    const clientResult = await clientRepo.findById(input.clientId)
    if (clientResult.isErr()) return err('CLIENT_NOT_FOUND')

    const createResult = await projectRepo.create({
      name: input.name.trim(),
      description: input.description.trim(),
      clientId: input.clientId,
      architectId: input.architectId,
      status: 'briefing',
    })

    if (createResult.isErr()) return err('DB_ERROR')

    return ok(createResult.value)
  }
