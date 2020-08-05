import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const logger = createLogger('updateTodo')

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  logger.info(`Processing update event: ${JSON.stringify(event)}`)

  const uid = getUserId(event)

  logger.info(`User Id: ${JSON.stringify(uid)}`)

  await docClient.update({
    TableName: todosTable,
    Key: {
      userId: uid,
      todoId: todoId
    },
    ExpressionAttributeNames: { "#N": "name" },
    UpdateExpression: "set #N=:todoName, dueDate=:dueDate, done=:done",
    ExpressionAttributeValues: {
      ":todoName": updatedTodo.name,
      ":dueDate": updatedTodo.dueDate,
      ":done": updatedTodo.done
    },
    ReturnValues: "UPDATED_NEW"
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
