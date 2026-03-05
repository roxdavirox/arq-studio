import type { Result } from '@roxdavirox/fp-core/result'
import type { VideoRoom, ConsultationId } from '@arq/types'

export interface VideoProvider {
  createRoom(consultationId: ConsultationId): Promise<Result<VideoRoom, 'PROVIDER_ERROR'>>
  getToken(roomId: string, userId: string, role: 'architect' | 'client'): Promise<Result<string, 'PROVIDER_ERROR'>>
  endRoom(roomId: string): Promise<Result<void, 'PROVIDER_ERROR'>>
}
