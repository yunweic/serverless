import { TodoDataAccess } from '../dataLayer/todosAccess'
import * as uuid from 'uuid'

const todoAccess = new TodoDataAccess

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

  return todoAccess.createTodo(newItem)
}

export async function deleteTodo(userId: string, todoId: string) {
  return todoAccess.deleteTodo(userId, todoId)
  
}

export async function updateTodo(userId: string, todoId: string, todoName: string, dueDate: string, done: boolean) {
  return todoAccess.updateTodo(userId, todoId, todoName, dueDate, done)
  
}

export async function updateAttachment(userId: string, todoId: string, attachmentUrl: string) {
  return todoAccess.updateAttachment(userId, todoId, attachmentUrl)

}