import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { ok, err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { Consultation, ConsultationId, ProjectId } from '@arq/types'
import type { ConsultationRepository } from '@arq/domain'
import { randomUUID } from 'crypto'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLE = process.env.CONSULTATIONS_TABLE!

export class DynamoConsultationRepository implements ConsultationRepository {
  async findById(id: ConsultationId): Promise<Result<Consultation, 'NOT_FOUND' | 'DB_ERROR'>> {
    try {
      const res = await client.send(new GetCommand({ TableName: TABLE, Key: { id } }))
      if (!res.Item) return err('NOT_FOUND')
      return ok(res.Item as Consultation)
    } catch {
      return err('DB_ERROR')
    }
  }

  async findByProject(projectId: ProjectId): Promise<Result<Consultation[], 'DB_ERROR'>> {
    try {
      const res = await client.send(
        new QueryCommand({ TableName: TABLE, IndexName: 'byProject', KeyConditionExpression: 'projectId = :p', ExpressionAttributeValues: { ':p': projectId } }),
      )
      return ok((res.Items ?? []) as Consultation[])
    } catch {
      return err('DB_ERROR')
    }
  }

  async create(data: Omit<Consultation, 'id'>): Promise<Result<Consultation, 'DB_ERROR'>> {
    const item: Consultation = { ...data, id: randomUUID() as ConsultationId }
    try {
      await client.send(new PutCommand({ TableName: TABLE, Item: item }))
      return ok(item)
    } catch {
      return err('DB_ERROR')
    }
  }

  async update(id: ConsultationId, data: Partial<Consultation>): Promise<Result<Consultation, 'NOT_FOUND' | 'DB_ERROR'>> {
    const current = await this.findById(id)
    if (current.isErr()) return current
    const updated: Consultation = { ...current.value, ...data }
    try {
      await client.send(new PutCommand({ TableName: TABLE, Item: updated }))
      return ok(updated)
    } catch {
      return err('DB_ERROR')
    }
  }
}
