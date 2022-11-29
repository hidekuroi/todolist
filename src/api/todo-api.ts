import { UpdateTaskModel } from "../components/TodoLists/Todolist/Task"
import { TasksType, TodoType } from "../redux/todoReducer"
import { DefaultResponseType, instance, ResultCodeForCaptcha } from "./api"


export const todoAPI = {
    todolistCreate(title: string) {
        return instance.post<DefaultResponseType<TodoType>>(`todo-lists`, {title: title})
        .then(response => response.data)
    },
    todolistDelete(id: string) {
        return instance.delete<DefaultResponseType>(`todo-lists/${id}`)
        .then(response => response.data)
    },
    todolistRename(title: string, id: string) {
        return instance.put<DefaultResponseType<TodolistRenameResponseType>>(`todo-lists/${id}`, {title: title})
        .then(response => response.data)
    },
    todosReorder(todolistId: string, putAfterId: string | number) {
        return instance.put<DefaultResponseType>(`todo-lists/${todolistId}/reorder`, {putAfterItemId: putAfterId})
        .then(response => response.data)
    },
    getTodolists() {
        return instance.get<GetTodolistsResponseType>('todo-lists')
        .then(response => response.data)
    },
    getTasks(id:string) {
        return instance.get<GetTasksResponseType>(`todo-lists/${id}/tasks?count=100`)
        .then(response => response.data)
    },
    createTask(title: string, id: string, order?: number) { 
        return instance.post<DefaultResponseType<CreateTaskResponseType>>(`todo-lists/${id}/tasks`, {title: title, order})
        .then(response => response.data)
    },
    removeTask(todoListId: string, taskId: string) {
        return instance.delete<DefaultResponseType>(`todo-lists/${todoListId}/tasks/${taskId}`)
        .then(response => response.data)
    },
    tasksReorder(todolistId: string, taskId: string, putAfterId: string | number) {
        return instance.put<DefaultResponseType>(`todo-lists/${todolistId}/tasks/${taskId}/reorder`, {putAfterItemId: putAfterId})
        .then(response => response.data)
    },
    taskChange(todolistId: string, taskId: string, updateTaskModel: UpdateTaskModel) {
        return instance.put<TaskChangeResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, updateTaskModel)
        .then(response => response.data)
    }
}

type TodolistRenameResponseType = {
    title: string
} 

type GetTodolistsResponseType = Array<TodoType>

export type GetTasksResponseType = {
    items: Array<TasksType>,
    error: null | string,
    totalCount: number
}

type CreateTaskResponseType = {
    item: TasksType
}

type TaskChangeResponseType = {
    item: TasksType
}