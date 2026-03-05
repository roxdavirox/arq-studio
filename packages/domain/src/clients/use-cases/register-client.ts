import { ok, err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { Client } from '@arq/types'
import type { ClientRepository } from '../../_ports/client.repository'

interface Deps {
  clientRepo: ClientRepository
}

interface RegisterInput {
  name: string
  email: string
  phone?: string
}

type RegisterError = 'EMAIL_TAKEN' | 'INVALID_INPUT' | 'DB_ERROR'

export const makeRegisterClient =
  ({ clientRepo }: Deps) =>
  async (input: RegisterInput): Promise<Result<Client, RegisterError>> => {
    if (!input.name.trim() || !input.email.trim()) return err('INVALID_INPUT')

    const existing = await clientRepo.findByEmail(input.email)
    if (existing.isOk()) return err('EMAIL_TAKEN')

    const createResult = await clientRepo.create({
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      phone: input.phone?.trim() ?? null,
    })

    if (createResult.isErr()) return err('DB_ERROR')

    return ok(createResult.value)
  }
