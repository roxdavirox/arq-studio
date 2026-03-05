import type { Result } from '@roxdavirox/fp-core/result'
import type { Consultation, ConsultationId, ProjectId } from '@arq/types'

export interface ConsultationRepository {
  findById(id: ConsultationId): Promise<Result<Consultation, 'NOT_FOUND' | 'DB_ERROR'>>
  findByProject(projectId: ProjectId): Promise<Result<Consultation[], 'DB_ERROR'>>
  create(data: Omit<Consultation, 'id'>): Promise<Result<Consultation, 'DB_ERROR'>>
  update(id: ConsultationId, data: Partial<Consultation>): Promise<Result<Consultation, 'NOT_FOUND' | 'DB_ERROR'>>
}
