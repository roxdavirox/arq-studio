import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { ok, err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { ProjectFile, ProjectId, FileId } from '@arq/types'
import { randomUUID } from 'crypto'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const TABLE = process.env.FILES_TABLE ?? `${process.env.PROJECTS_TABLE!.replace('projects', 'files')}`

export class DynamoFileRepository {
  async findByProject(projectId: ProjectId): Promise<Result<ProjectFile[], 'DB_ERROR'>> {
    try {
      const res = await client.send(
        new QueryCommand({ TableName: TABLE, IndexName: 'byProject', KeyConditionExpression: 'projectId = :p', ExpressionAttributeValues: { ':p': projectId } }),
      )
      return ok((res.Items ?? []) as ProjectFile[])
    } catch {
      return err('DB_ERROR')
    }
  }

  async create(data: Omit<ProjectFile, 'id' | 'uploadedAt'>): Promise<Result<ProjectFile, 'DB_ERROR'>> {
    const item: ProjectFile = { ...data, id: randomUUID() as FileId, uploadedAt: new Date() }
    try {
      await client.send(new PutCommand({ TableName: TABLE, Item: item }))
      return ok(item)
    } catch {
      return err('DB_ERROR')
    }
  }
}
