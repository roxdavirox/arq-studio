import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { container } from '../container'
import { response, errorResponse } from '../_lib/http'
import type { ClientId } from '@arq/types'

export const me: APIGatewayProxyHandlerV2 = async event => {
  const clientId = event.requestContext.authorizer?.lambda?.clientId as ClientId
  const result = await container.getClient(clientId)
  return result.isOk() ? response(200, result.value) : errorResponse('UNAUTHORIZED', 401)
}
