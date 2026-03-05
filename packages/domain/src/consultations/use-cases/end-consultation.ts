import { ok, err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { Consultation, ConsultationId } from '@arq/types'
import type { ConsultationRepository } from '../../_ports/consultation.repository'
import type { VideoProvider } from '../../_ports/video.provider'

interface Deps {
  consultationRepo: ConsultationRepository
  videoProvider: VideoProvider
}

type EndError = 'NOT_FOUND' | 'NOT_ACTIVE' | 'DB_ERROR'

export const makeEndConsultation =
  ({ consultationRepo, videoProvider }: Deps) =>
  async (id: ConsultationId, notes?: string): Promise<Result<Consultation, EndError>> => {
    const result = await consultationRepo.findById(id)
    if (result.isErr()) return err('NOT_FOUND')

    const consultation = result.value
    if (consultation.status !== 'active') return err('NOT_ACTIVE')

    // Best-effort room cleanup
    if (consultation.roomUrl) {
      videoProvider.endRoom(consultation.roomUrl).catch(() => void 0)
    }

    const updateResult = await consultationRepo.update(id, {
      status: 'ended',
      endedAt: new Date(),
      notes: notes ?? null,
    })

    if (updateResult.isErr()) return err('DB_ERROR')

    return ok(updateResult.value)
  }
