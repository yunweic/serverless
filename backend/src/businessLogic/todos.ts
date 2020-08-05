import { TodoDataAccess } from '../dataLayer/todosAccess'

const todoAccess = new TodoDataAccess

export async function getTodosPerUser(userId: string) {
  return todoAccess.getTodosPerUser(userId)
}
  
export async function createTodo(userId: string, todoId: string, newTodo: any) {
  return todoAccess.createTodo(userId, todoId, newTodo)
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