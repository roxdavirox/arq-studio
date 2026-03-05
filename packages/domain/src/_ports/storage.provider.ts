import type { Result } from '@roxdavirox/fp-core/result'

export interface StorageProvider {
  upload(key: string, body: Buffer, mimeType: string): Promise<Result<string, 'UPLOAD_ERROR'>>
  getSignedUrl(key: string, expiresInSeconds: number): Promise<Result<string, 'NOT_FOUND'>>
  delete(key: string): Promise<Result<void, 'NOT_FOUND' | 'DELETE_ERROR'>>
}
