import { UpdateTaskModel } from "../components/TodoLists/Todolist/Task"
import { DefaultResponseType, instance, ResultCodeForCaptcha } from "./api"


export const todoAPI = {
    todolistCreate(title: string) {
        return instance.post<any>(`todo-lists`, {title: title})
        .then(response => response.data)
    },
    todolistDelete(id: string) {
        return instance.delete<any>(`todo-lists/${id}`)
        .then(response => response.data)
    },
    todolistRename(title: string, id: string) {
        return instance.put<any>(`todo-lists/${id}`, {title: title})
        .then(response => response.data)
    },
    getTodolists() {
        return instance.get<any>('todo-lists')
        .then(response => response.data)
    },
    getTasks(id:string) {
        return instance.get<any>(`todo-lists/${id}/tasks`)
        .then(response => response.data)
    },
    createTask(title: string, id: string) { 
        return instance.post<any>(`todo-lists/${id}/tasks`, {title: title})
        .then(response => response.data)
    },
    removeTask(todoListId: string, taskId: string) {
        return instance.delete<any>(`todo-lists/${todoListId}/tasks/${taskId}`)
        .then(response => response.data)
    },
    tasksReorder(todolistId: string, taskId: string, putAfterId: string | number) {
        return instance.put<any>(`todo-lists/${todolistId}/tasks/${taskId}/reorder`, {putAfterItemId: putAfterId})
        .then(response => response.data)
    },
    taskComplete(todolistId: string, taskId: string, updateTaskModel: UpdateTaskModel) {
        return instance.put<any>(`todo-lists/${todolistId}/tasks/${taskId}`, updateTaskModel)
        .then(response => console.log(response))
    }
}
