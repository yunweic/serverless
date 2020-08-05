import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const logger = createLogger('deleteTodo')

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  logger.info(`Processing delete event: ${JSON.stringify(todoId)}`)

  await docClient.delete({
    TableName: todosTable,
    Key: {
      userId: getUserId(event),
      todoId: todoId
    }
  }).promise()

  return{
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}
