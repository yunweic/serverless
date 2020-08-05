import * as AWS  from 'aws-sdk'
import { createLogger } from '../utils/logger'

export class TodoDataAccess {
  constructor(
    private readonly docClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE
  ){}

  async getTodosPerUser(userId: string) {

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
  
    return result.Items
  }
    
  async createTodo(newItem: any) {
      
    const logger = createLogger('createTodo')

    logger.info(`Storing new item: ${JSON.stringify(newItem)}`)

    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: newItem
      }).promise()

    return newItem
}
  
  async deleteTodo(userId: string, todoId: string) {

    const logger = createLogger('deleteTodo')
    
    logger.info(`Delete item: ${userId} ${todoId}`)

    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }).promise()

  }
  
  async updateTodo(userId: string, todoId: string, todoName: string, dueDate: string, done: boolean) {
      
    const logger = createLogger('updateTodo')

    logger.info(`Storing new item: ${userId} ${todoId} ${todoName} ${dueDate} ${done}`)
    
    await this.docClient.update({
      TableName: this.todosTable,
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
  
  async updateAttachment(userId: string, todoId: string, attachmentUrl: string) {
  
    const logger = createLogger('updateAttachment')

    logger.info(`Storing new item: ${userId} ${todoId} ${attachmentUrl}`)

    await this.docClient.update({
      TableName: this.todosTable,
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

}

