import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { container } from '../container'
import { response, errorResponse, parseBody } from '../_lib/http'

export const list: APIGatewayProxyHandlerV2 = async event => {
  const projectId = event.pathParameters?.id
  if (!projectId) return errorResponse('MISSING_ID', 400)
  const result = await container.listProjectFiles(projectId)
  return result.isOk() ? response(200, result.value) : errorResponse('DB_ERROR', 500)
}

export const getUploadUrl: APIGatewayProxyHandlerV2 = async event => {
  const projectId = event.pathParameters?.id
  const body = parseBody(event.body)
  if (!projectId || !body?.fileName || !body?.mimeType) return errorResponse('INVALID_BODY', 400)

  const key = `${projectId}/${Date.now()}-${body.fileName}`
  const result = await container.storage.getSignedUrl(key, 3600)
  return result.isOk()
    ? response(200, { uploadUrl: result.value, key })
    : errorResponse('STORAGE_ERROR', 502)
}
