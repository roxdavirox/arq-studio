import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { ok, err } from '@roxdavirox/fp-core/result'
import type { Result } from '@roxdavirox/fp-core/result'
import type { StorageProvider } from '@arq/domain'

const s3 = new S3Client({})
const BUCKET = process.env.FILES_BUCKET!

export class S3StorageProvider implements StorageProvider {
  async upload(key: string, body: Buffer, mimeType: string): Promise<Result<string, 'UPLOAD_ERROR'>> {
    try {
      await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: mimeType }))
      return ok(`https://${BUCKET}.s3.amazonaws.com/${key}`)
    } catch {
      return err('UPLOAD_ERROR')
    }
  }

  async getSignedUrl(key: string, expiresInSeconds: number): Promise<Result<string, 'NOT_FOUND'>> {
    try {
      const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn: expiresInSeconds })
      return ok(url)
    } catch {
      return err('NOT_FOUND')
    }
  }

  async delete(key: string): Promise<Result<void, 'NOT_FOUND' | 'DELETE_ERROR'>> {
    try {
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
      return ok(undefined)
    } catch {
      return err('DELETE_ERROR')
    }
  }
}
