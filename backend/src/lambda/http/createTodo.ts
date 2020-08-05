import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { createTodo } from '../../dataLayer/todosAccess'

import * as uuid from 'uuid'

const logger = createLogger('createTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // TODO: Implement creating a new TODO item
  logger.info(`Processing create event: ${JSON.stringify(event)}`)

  const todoId = uuid.v4()
  const newItem = await createTodo(getUserId(event), todoId, event)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
