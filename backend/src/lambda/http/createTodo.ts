import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

const logger = createLogger('createTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // TODO: Implement creating a new TODO item
  logger.info(`Processing create event: ${JSON.stringify(event)}`)

  const todoId = uuid.v4()
  const newItem = await createAttachment(getUserId(event), todoId, event)

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

async function createAttachment(userId: string, todoId: string, event: any) {
  const createdAt = new Date().toISOString()
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const newItem = {
    userId,
    createdAt,
    todoId,
    ...newTodo,
    done: false
  }

  logger.info(`Storing new item: ${JSON.stringify(newItem)}`)

  await docClient
    .put({
      TableName: todosTable,
      Item: newItem
    })
    .promise()

  return newItem
}