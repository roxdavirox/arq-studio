import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { container } from '../container'
import { response, errorResponse, parseBody } from '../_lib/http'
import type { ConsultationId, ProjectId, ClientId, ArchitectId } from '@arq/types'

export const list: APIGatewayProxyHandlerV2 = async event => {
  const projectId = event.queryStringParameters?.projectId as ProjectId | undefined
  if (!projectId) return errorResponse('MISSING_PROJECT_ID', 400)
  const result = await container.consultationRepo.findByProject(projectId)
  return result.isOk() ? response(200, result.value) : errorResponse('DB_ERROR', 500)
}

export const get: APIGatewayProxyHandlerV2 = async event => {
  const id = event.pathParameters?.id as ConsultationId
  const result = await container.getConsultation(id)
  return result.isOk() ? response(200, result.value) : errorResponse('NOT_FOUND', 404)
}

export const schedule: APIGatewayProxyHandlerV2 = async event => {
  const body = parseBody(event.body)
  if (!body?.projectId || !body?.scheduledAt) return errorResponse('INVALID_BODY', 400)

  const clientId = event.requestContext.authorizer?.lambda?.clientId as ClientId
  const result = await container.scheduleConsultation({
    projectId: body.projectId,
    architectId: body.architectId as ArchitectId,
    clientId,
    scheduledAt: new Date(body.scheduledAt),
  })

  if (result.isErr()) {
    if (result.error === 'PAST_DATE') return errorResponse('PAST_DATE', 422)
    if (result.error === 'PROJECT_NOT_FOUND') return errorResponse('PROJECT_NOT_FOUND', 404)
    return errorResponse('DB_ERROR', 500)
  }
  return response(201, result.value)
}

export const start: APIGatewayProxyHandlerV2 = async event => {
  const id = event.pathParameters?.id as ConsultationId
  const result = await container.startConsultation(id)
  if (result.isErr()) {
    if (result.error === 'NOT_FOUND') return errorResponse('NOT_FOUND', 404)
    if (result.error === 'ALREADY_ACTIVE') return errorResponse('ALREADY_ACTIVE', 409)
    if (result.error === 'PROVIDER_ERROR') return errorResponse('PROVIDER_ERROR', 502)
    return errorResponse('DB_ERROR', 500)
  }
  return response(200, result.value)
}

export const end: APIGatewayProxyHandlerV2 = async event => {
  const id = event.pathParameters?.id as ConsultationId
  const body = parseBody(event.body)
  const result = await container.endConsultation(id, body?.notes)
  if (result.isErr()) {
    if (result.error === 'NOT_FOUND') return errorResponse('NOT_FOUND', 404)
    if (result.error === 'NOT_ACTIVE') return errorResponse('NOT_ACTIVE', 422)
    return errorResponse('DB_ERROR', 500)
  }
  return response(200, result.value)
}
