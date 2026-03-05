import { err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { ConsultationId } from '@arq/types'
import type { ConsultationRepository } from '../../_ports/consultation.repository'
import type { VideoProvider } from '../../_ports/video.provider'

interface Deps {
  consultationRepo: ConsultationRepository
  videoProvider: VideoProvider
}

export const makeGetVideoToken =
  ({ consultationRepo, videoProvider }: Deps) =>
  async (
    consultationId: ConsultationId,
    userId: string,
    role: 'architect' | 'client',
  ): Promise<Result<string, 'NOT_FOUND' | 'NOT_ACTIVE' | 'PROVIDER_ERROR'>> => {
    const result = await consultationRepo.findById(consultationId)
    if (result.isErr()) return err('NOT_FOUND')

    if (result.value.status !== 'active') return err('NOT_ACTIVE')

    return videoProvider.getToken(result.value.roomUrl ?? consultationId, userId, role)
  }
