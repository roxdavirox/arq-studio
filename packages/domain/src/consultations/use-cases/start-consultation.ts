import { ok, err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { Consultation, ConsultationId } from '@arq/types'
import type { ConsultationRepository } from '../../_ports/consultation.repository'
import type { VideoProvider } from '../../_ports/video.provider'

interface Deps {
  consultationRepo: ConsultationRepository
  videoProvider: VideoProvider
}

type StartError = 'NOT_FOUND' | 'ALREADY_ACTIVE' | 'PROVIDER_ERROR' | 'DB_ERROR'

export const makeStartConsultation =
  ({ consultationRepo, videoProvider }: Deps) =>
  async (id: ConsultationId): Promise<Result<Consultation, StartError>> => {
    const result = await consultationRepo.findById(id)
    if (result.isErr()) return err('NOT_FOUND')

    const consultation = result.value
    if (consultation.status === 'active') return err('ALREADY_ACTIVE')

    const roomResult = await videoProvider.createRoom(id)
    if (roomResult.isErr()) return err('PROVIDER_ERROR')

    const updateResult = await consultationRepo.update(id, {
      status: 'active',
      startedAt: new Date(),
      roomUrl: roomResult.value.url,
    })

    if (updateResult.isErr()) return err('DB_ERROR')

    return ok(updateResult.value)
  }
