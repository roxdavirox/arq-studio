import { ok, err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { VideoRoom, ConsultationId } from '@arq/types'
import type { VideoProvider } from '@arq/domain'

const DAILY_API = 'https://api.daily.co/v1'

export class DailyVideoProvider implements VideoProvider {
  private readonly apiKey = process.env.DAILY_API_KEY!

  async createRoom(consultationId: ConsultationId): Promise<Result<VideoRoom, 'PROVIDER_ERROR'>> {
    try {
      const res = await fetch(`${DAILY_API}/rooms`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `consultation-${consultationId}`,
          privacy: 'private',
          properties: { exp: Math.floor(Date.now() / 1000) + 7200 }, // 2h
        }),
      })
      if (!res.ok) return err('PROVIDER_ERROR')
      const data = await res.json()
      return ok({ id: data.name, url: data.url, token: '', expiresAt: new Date(data.config.exp * 1000) })
    } catch {
      return err('PROVIDER_ERROR')
    }
  }

  async getToken(roomId: string, userId: string, role: 'architect' | 'client'): Promise<Result<string, 'PROVIDER_ERROR'>> {
    try {
      const res = await fetch(`${DAILY_API}/meeting-tokens`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            room_name: roomId,
            user_id: userId,
            is_owner: role === 'architect',
            exp: Math.floor(Date.now() / 1000) + 7200,
          },
        }),
      })
      if (!res.ok) return err('PROVIDER_ERROR')
      const data = await res.json()
      return ok(data.token)
    } catch {
      return err('PROVIDER_ERROR')
    }
  }

  async endRoom(roomId: string): Promise<Result<void, 'PROVIDER_ERROR'>> {
    try {
      await fetch(`${DAILY_API}/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.apiKey}` },
      })
      return ok(undefined)
    } catch {
      return err('PROVIDER_ERROR')
    }
  }
}
