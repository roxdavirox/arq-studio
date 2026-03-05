import type { Result } from '@roxdavirox/fp-core/result'
import type { Project, ProjectId, ClientId } from '@arq/types'

export interface ProjectRepository {
  findById(id: ProjectId): Promise<Result<Project, 'NOT_FOUND' | 'DB_ERROR'>>
  findByClient(clientId: ClientId): Promise<Result<Project[], 'DB_ERROR'>>
  create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<Project, 'DB_ERROR'>>
  update(id: ProjectId, data: Partial<Project>): Promise<Result<Project, 'NOT_FOUND' | 'DB_ERROR'>>
  delete(id: ProjectId): Promise<Result<void, 'NOT_FOUND' | 'DB_ERROR'>>
}
