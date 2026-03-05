import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { container } from '../container'
import { response, errorResponse, parseBody } from '../_lib/http'
import type { ProjectId, ProjectStatus } from '@arq/types'

export const list: APIGatewayProxyHandlerV2 = async event => {
  const clientId = event.requestContext.authorizer?.lambda?.clientId as string
  const result = await container.listClientProjects(clientId as any)
  return result.isOk() ? response(200, result.value) : errorResponse('DB_ERROR', 500)
}

export const get: APIGatewayProxyHandlerV2 = async event => {
  const id = event.pathParameters?.id as ProjectId
  const clientId = event.requestContext.authorizer?.lambda?.clientId as string
  const result = await container.getProject(id, clientId)
  if (result.isErr()) {
    if (result.error === 'NOT_FOUND') return errorResponse('NOT_FOUND', 404)
    if (result.error === 'UNAUTHORIZED') return errorResponse('UNAUTHORIZED', 403)
    return errorResponse('DB_ERROR', 500)
  }
  return response(200, result.value)
}

export const create: APIGatewayProxyHandlerV2 = async event => {
  const clientId = event.requestContext.authorizer?.lambda?.clientId as string
  const body = parseBody(event.body)
  if (!body) return errorResponse('INVALID_BODY', 400)

  const result = await container.createProject({ ...body, clientId })
  if (result.isErr()) {
    if (result.error === 'INVALID_INPUT') return errorResponse('INVALID_INPUT', 400)
    if (result.error === 'CLIENT_NOT_FOUND') return errorResponse('CLIENT_NOT_FOUND', 404)
    return errorResponse('DB_ERROR', 500)
  }
  return response(201, result.value)
}

export const updateStatus: APIGatewayProxyHandlerV2 = async event => {
  const id = event.pathParameters?.id as ProjectId
  const body = parseBody(event.body)
  if (!body?.status) return errorResponse('INVALID_BODY', 400)

  const result = await container.updateProjectStatus(id, body.status as ProjectStatus)
  if (result.isErr()) {
    if (result.error === 'NOT_FOUND') return errorResponse('NOT_FOUND', 404)
    if (result.error === 'INVALID_TRANSITION') return errorResponse('INVALID_TRANSITION', 422)
    return errorResponse('DB_ERROR', 500)
  }
  return response(200, result.value)
}
