import { TodoDataAccess } from '../dataLayer/todosAccess'
import * as uuid from 'uuid'
import * as AWS  from 'aws-sdk'

const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const bucketName = process.env.IMAGES_S3_BUCKET

const todoAccess = new TodoDataAccess

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export async function getTodosPerUser(userId: string) {
  return todoAccess.getTodosPerUser(userId)
}
  
export async function createTodo(userId: string, newTodo: any) {

  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()

  const newItem = {
    userId,
    createdAt,
    todoId,
    ...newTodo,
    done: false
  }

  return await todoAccess.createTodo(newItem)
}

export async function deleteTodo(userId: string, todoId: string) {
  return await todoAccess.deleteTodo(userId, todoId)
  
}

export async function updateTodo(userId: string, todoId: string, updatedTodo: any) {

  return await todoAccess.updateTodo(userId, todoId, updatedTodo.name, updatedTodo.dueDate, updatedTodo.done)
  
}

export async function updateAttachment(userId: string, todoId: string) {

  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`

  await todoAccess.updateAttachment(userId, todoId, attachmentUrl)

  return getUploadUrl(todoId)

}

function getUploadUrl(attachmentId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: parseInt(urlExpiration)
  })
}