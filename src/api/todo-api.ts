import { DefaultResponseType, instance, ResultCodeForCaptcha } from "./api"


export const todoAPI = {
    todolistCreate(title: string) {
        return instance.post<any>(`todo-lists`, {title: title})
        .then(response => response)
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
    }
}
