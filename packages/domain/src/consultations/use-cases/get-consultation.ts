import type { Result } from '@roxdavirox/fp-core/result'
import type { Consultation, ConsultationId } from '@arq/types'
import type { ConsultationRepository } from '../../_ports/consultation.repository'

interface Deps {
  consultationRepo: ConsultationRepository
}

export const makeGetConsultation =
  ({ consultationRepo }: Deps) =>
  (id: ConsultationId): Promise<Result<Consultation, 'NOT_FOUND' | 'DB_ERROR'>> =>
    consultationRepo.findById(id)
