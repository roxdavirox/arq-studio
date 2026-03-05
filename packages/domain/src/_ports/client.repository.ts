import type { Result } from '@roxdavirox/fp-core/result'
import type { Client, ClientId } from '@arq/types'

export interface ClientRepository {
  findById(id: ClientId): Promise<Result<Client, 'NOT_FOUND' | 'DB_ERROR'>>
  findByEmail(email: string): Promise<Result<Client, 'NOT_FOUND' | 'DB_ERROR'>>
  create(data: Omit<Client, 'id' | 'createdAt'>): Promise<Result<Client, 'DB_ERROR'>>
  update(id: ClientId, data: Partial<Client>): Promise<Result<Client, 'NOT_FOUND' | 'DB_ERROR'>>
}
