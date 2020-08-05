import * as AWS  from 'aws-sdk'
import { createLogger } from '../utils/logger'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

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

export async function createTodo(userId: string, todoId: string, newTodo: any) {
    
    const logger = createLogger('createTodo')

    const createdAt = new Date().toISOString()

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

}

export async function updateTodo(userId: string, todoId: string, todoName: string, dueDate: string, done: boolean) {
    
    await docClient.update({
        TableName: todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        ExpressionAttributeNames: { "#N": "name" },
        UpdateExpression: "set #N=:todoName, dueDate=:dueDate, done=:done",
        ExpressionAttributeValues: {
          ":todoName": todoName,
          ":dueDate": dueDate,
          ":done": done
        },
        ReturnValues: "UPDATED_NEW"
      }).promise()

}

export async function updateAttachment(userId: string, todoId: string, attachmentUrl: string) {

    await docClient.update({
        TableName: todosTable,
        Key: {
            userId: userId,
            todoId: todoId
        },
        ExpressionAttributeNames: {"#A": "attachmentUrl"},
        UpdateExpression: "set #A = :attachmentUrl",
        ExpressionAttributeValues: {
            ":attachmentUrl": attachmentUrl,
        },
        ReturnValues: "UPDATED_NEW"
    }).promise()

}