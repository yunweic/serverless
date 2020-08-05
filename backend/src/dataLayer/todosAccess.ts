import * as AWS  from 'aws-sdk'
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

const logger = createLogger('updateTodo')

export async function getTodosPerUser(userId: string) {
    const result = await docClient.query({
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
  
    return result.Items
  }

export async function createTodo(userId: string, todoId: string, event: any) {
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

export async function deleteTodo(userId: string, todoId: string) {
    await docClient.delete({
        TableName: todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        }
      }).promise()

      return 
}