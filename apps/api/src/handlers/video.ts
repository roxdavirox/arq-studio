import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { container } from '../container'
import { response, errorResponse } from '../_lib/http'
import type { ConsultationId } from '@arq/types'

export const join: APIGatewayProxyHandlerV2 = async event => {
  const id = event.pathParameters?.id as ConsultationId
  const clientId = event.requestContext.authorizer?.lambda?.clientId as string
  const clientName = event.requestContext.authorizer?.lambda?.clientName as string

  const result = await container.joinConsultation(id, clientId, 'client')
  if (result.isErr()) {
    if (result.error === 'NOT_FOUND') return errorResponse('NOT_FOUND', 404)
    if (result.error === 'NOT_ACTIVE') return errorResponse('NOT_ACTIVE', 422)
    return errorResponse('PROVIDER_ERROR', 502)
  }
  return response(200, result.value)
}
