import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { ok, err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { Client, ClientId } from '@arq/types'
import type { ClientRepository } from '@arq/domain'
import { randomUUID } from 'crypto'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLE = process.env.CLIENTS_TABLE!

export class DynamoClientRepository implements ClientRepository {
  async findById(id: ClientId): Promise<Result<Client, 'NOT_FOUND' | 'DB_ERROR'>> {
    try {
      const res = await client.send(new GetCommand({ TableName: TABLE, Key: { id } }))
      if (!res.Item) return err('NOT_FOUND')
      return ok(res.Item as Client)
    } catch {
      return err('DB_ERROR')
    }
  }

  async findByEmail(email: string): Promise<Result<Client, 'NOT_FOUND' | 'DB_ERROR'>> {
    try {
      const res = await client.send(
        new QueryCommand({ TableName: TABLE, IndexName: 'byEmail', KeyConditionExpression: 'email = :e', ExpressionAttributeValues: { ':e': email } }),
      )
      if (!res.Items?.length) return err('NOT_FOUND')
      return ok(res.Items[0] as Client)
    } catch {
      return err('DB_ERROR')
    }
  }

  async create(data: Omit<Client, 'id' | 'createdAt'>): Promise<Result<Client, 'DB_ERROR'>> {
    const item: Client = { ...data, id: randomUUID() as ClientId, createdAt: new Date() }
    try {
      await client.send(new PutCommand({ TableName: TABLE, Item: item }))
      return ok(item)
    } catch {
      return err('DB_ERROR')
    }
  }

  async update(id: ClientId, data: Partial<Client>): Promise<Result<Client, 'NOT_FOUND' | 'DB_ERROR'>> {
    const current = await this.findById(id)
    if (current.isErr()) return current
    const updated: Client = { ...current.value, ...data }
    try {
      await client.send(new PutCommand({ TableName: TABLE, Item: updated }))
      return ok(updated)
    } catch {
      return err('DB_ERROR')
    }
  }
}
