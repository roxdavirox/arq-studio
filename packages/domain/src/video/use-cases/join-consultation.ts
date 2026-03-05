import { ok, err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { VideoRoom, ConsultationId } from '@arq/types'
import type { ConsultationRepository } from '../../_ports/consultation.repository'
import type { VideoProvider } from '../../_ports/video.provider'

interface Deps {
  consultationRepo: ConsultationRepository
  videoProvider: VideoProvider
}

type JoinError = 'NOT_FOUND' | 'NOT_ACTIVE' | 'PROVIDER_ERROR'

export const makeJoinConsultation =
  ({ consultationRepo, videoProvider }: Deps) =>
  async (
    consultationId: ConsultationId,
    userId: string,
    role: 'architect' | 'client',
  ): Promise<Result<VideoRoom & { token: string }, JoinError>> => {
    const result = await consultationRepo.findById(consultationId)
    if (result.isErr()) return err('NOT_FOUND')

    const consultation = result.value
    if (consultation.status !== 'active') return err('NOT_ACTIVE')

    const roomId = consultation.roomUrl ?? consultationId
    const tokenResult = await videoProvider.getToken(roomId, userId, role)
    if (tokenResult.isErr()) return err('PROVIDER_ERROR')

    return ok({
      id: roomId,
      url: consultation.roomUrl ?? '',
      token: tokenResult.value,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2h
    })
  }
