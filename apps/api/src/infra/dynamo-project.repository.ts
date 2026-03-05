import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { ok, err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { Project, ProjectId, ClientId } from '@arq/types'
import type { ProjectRepository } from '@arq/domain'
import { randomUUID } from 'crypto'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLE = process.env.PROJECTS_TABLE!

export class DynamoProjectRepository implements ProjectRepository {
  async findById(id: ProjectId): Promise<Result<Project, 'NOT_FOUND' | 'DB_ERROR'>> {
    try {
      const res = await client.send(new GetCommand({ TableName: TABLE, Key: { id } }))
      if (!res.Item) return err('NOT_FOUND')
      return ok(res.Item as Project)
    } catch {
      return err('DB_ERROR')
    }
  }

  async findByClient(clientId: ClientId): Promise<Result<Project[], 'DB_ERROR'>> {
    try {
      const res = await client.send(
        new QueryCommand({ TableName: TABLE, IndexName: 'byClient', KeyConditionExpression: 'clientId = :c', ExpressionAttributeValues: { ':c': clientId } }),
      )
      return ok((res.Items ?? []) as Project[])
    } catch {
      return err('DB_ERROR')
    }
  }

  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<Project, 'DB_ERROR'>> {
    const project: Project = { ...data, id: randomUUID() as ProjectId, createdAt: new Date(), updatedAt: new Date() }
    try {
      await client.send(new PutCommand({ TableName: TABLE, Item: project }))
      return ok(project)
    } catch {
      return err('DB_ERROR')
    }
  }

  async update(id: ProjectId, data: Partial<Project>): Promise<Result<Project, 'NOT_FOUND' | 'DB_ERROR'>> {
    const current = await this.findById(id)
    if (current.isErr()) return current
    const updated: Project = { ...current.value, ...data, updatedAt: new Date() }
    try {
      await client.send(new PutCommand({ TableName: TABLE, Item: updated }))
      return ok(updated)
    } catch {
      return err('DB_ERROR')
    }
  }

  async delete(id: ProjectId): Promise<Result<void, 'NOT_FOUND' | 'DB_ERROR'>> {
    const check = await this.findById(id)
    if (check.isErr()) return check as any
    try {
      await client.send(new PutCommand({ TableName: TABLE, Item: { id, _deleted: true } }))
      return ok(undefined)
    } catch {
      return err('DB_ERROR')
    }
  }
}
