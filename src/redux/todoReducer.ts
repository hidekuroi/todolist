import { UpdateTaskModel } from './../components/TodoLists/Todolist/Task';
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { DefaultResponseType, ResultCodeEnum } from "../api/api";
import { authAPI, IsAuthResponseType } from "../api/auth-api";
import { todoAPI } from "../api/todo-api";
import { InferActionsType, RootState } from "./store";

const SET_TODOLISTS = 'todo/todo/SET-TODOLISTS'
const SET_TASKS = 'todo/todo/SET-TASKS'
const REMOVE_TODO = 'todo/todo/REMOVE-TODO'

export type TasksType = {
    description: string,
    title: string,
    completed: boolean,
    status: number,
    priority: number,
    startDate: string,
    deadline: string,
    id: string,
    todoListId: string,
    order: number,
    addedDate: string
}

export type TodoType = {
    id: string,
    title: string,
    addedDate: string,
    order: number,
    totalCount: number
    tasks: TasksType[] | []
}

export type TodoInitialStateType = {
    todoData: Array<TodoType> | null,
    isInitialized: boolean,
}

const InitialState: TodoInitialStateType = {
    todoData: null,
    isInitialized: false
}
//@ts-ignore
export default (state = InitialState, action: any): TodoInitialStateType => {
    switch (action.type) {
        case SET_TODOLISTS: {
            if (!state.todoData){
                let stateCopy = {...state, todoData: action.todoData}
                for (let i = 0; i < action.todoData.length; i++) {
                    stateCopy.todoData[i] = {...stateCopy.todoData[i], tasks: []}
                }
                return stateCopy
            }
            else{
                if(action.todoData === null) {
                    let stateCopy = {...state, todoData: null}
                    return stateCopy
                }
                let stateCopy = {...state, todoData: action.todoData}
                for (let i = 0; i < action.todoData.length; i++) {
                    stateCopy.todoData[i] = {...stateCopy.todoData[i], tasks: [...state.todoData[i].tasks]}
                }
                return stateCopy
            }
        }

        case SET_TASKS: {
            let stateCopy = {...state}
                if(state.todoData){
                for (let i = 0; i < state.todoData.length; i++) {
                    if(state.todoData[i].id === action.id) {
                        stateCopy.todoData = [...state.todoData]
                        stateCopy.todoData[i].tasks = []
                        console.log(action.tasksData)
                        stateCopy.todoData[i].totalCount = action.tasksData.totalCount
                        //@ts-ignore
                        if(action.tasksData.items.length > 0) stateCopy.todoData[i].tasks.push(...action.tasksData.items)
                        return stateCopy
                }
                }
                return stateCopy
                }
            return state;
        }

        case REMOVE_TODO: {
            if(state.todoData){
                let stateCopy = {...state, todoData: state.todoData}
                stateCopy = {...stateCopy, isInitialized: state.isInitialized}
                for (let i = 0; i < state.todoData?.length; i++) {
                    if(state.todoData[i].id === action.id) stateCopy = {...stateCopy, todoData: stateCopy.todoData.filter(todo => todo.id !== action.id)}
                }
                return stateCopy
            }
            else return state
        }
                
        default:{
            return state;
        }
    }
}

type ActionsTypes = InferActionsType<typeof actions>

export const actions = {
    setTodoLists: (todoData: Array<TodoType> | null) => ({type: SET_TODOLISTS, todoData} as const),
    setTasks: (tasksData: any, id: string) => ({type: SET_TASKS, tasksData, id} as const),
    removeTodo: (id: string) => ({type: REMOVE_TODO, id} as const),
}

type DispatchType = Dispatch<ActionsTypes>
type ThunkType = ThunkAction<Promise<void>, RootState, unknown, ActionsTypes>

export const getTodos = (): ThunkType => {
    return async (dispatch: DispatchType) => {
       let data = await todoAPI.getTodolists();
            dispatch(actions.setTodoLists(data));
    }
}

export const todoRename = (title: string, id: string): ThunkType => {
    return async (dispatch: any) => {
        let data = await todoAPI.todolistRename(title, id)
            dispatch(getTodos())
    }
}

export const getTasks = (id: string): ThunkType => {
    return async (dispatch: DispatchType) => {
        let data = await todoAPI.getTasks(id)
            dispatch(actions.setTasks(data, id))
    }
}

export const createTask = (title: string, id: string): ThunkType => {
    return async (dispatch: any) => {
        let data = await todoAPI.createTask(title, id)
            dispatch(getTasks(id))
    }
}

export const deleteTask = (todolistId: string, taskId: string): ThunkType => {
    return async (dispatch: any) => {
        let data = await todoAPI.removeTask(todolistId, taskId)
            dispatch(getTasks(todolistId))
    }
}

export const createNewTodo = (title: string): ThunkType => {
    return async (dispatch: any) => {
        let data = await todoAPI.todolistCreate(title)
            setTimeout(() => {
                dispatch(getTodos())
            }, 500);
    }
}

export const deleteTodo = (id: string): ThunkType => {
    return async (dispatch: any) => {
        let data = await todoAPI.todolistDelete(id)
            dispatch(actions.removeTodo(id))
            setTimeout(() => {
                dispatch(getTodos())
            }, 500);
    }
}

export const tasksReorder = (todolistId: string, taskId: string, putAfterId: string | number): ThunkType => {
    return async (dispatch: any) => {
        let data = await todoAPI.tasksReorder(todolistId, taskId, putAfterId)
        setTimeout(() => {
            dispatch(getTasks(todolistId))
        }, 500);
    }
}

export const editTask = (todolistId: string, taskId: string, updateTaskModel: UpdateTaskModel): ThunkType => {
    return async (dispatch: any) => {
        let data = await todoAPI.taskComplete(todolistId, taskId, updateTaskModel)
        setTimeout(() => {
            dispatch(getTasks(todolistId))
        }, 400);
    }
}