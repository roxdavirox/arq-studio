import type { Result } from '@roxdavirox/fp-core/result'
import type { Client, ClientId } from '@arq/types'
import type { ClientRepository } from '../../_ports/client.repository'

interface Deps {
  clientRepo: ClientRepository
}

export const makeGetClient =
  ({ clientRepo }: Deps) =>
  (id: ClientId): Promise<Result<Client, 'NOT_FOUND' | 'DB_ERROR'>> =>
    clientRepo.findById(id)
