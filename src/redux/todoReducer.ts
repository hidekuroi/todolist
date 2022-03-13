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
                let stateCopy = {...state, todoData: action.todoData}
                for (let i = 0; i < action.todoData.length; i++) {
                    stateCopy.todoData[i] = {...stateCopy.todoData[i], tasks: [...state.todoData[i].tasks]}
                }
                return stateCopy
            }
        }

        case SET_TASKS: {
            console.log('>>>>SETTER')
            let stateCopy = {...state}
                if(state.todoData){
                for (let i = 0; i < state.todoData.length; i++) {
                    console.log(state.todoData[i].id)
                    console.log(action.tasksData.items[0].todoListId)
                    if(state.todoData[i].id === action.tasksData.items[0].todoListId) {
                        stateCopy.todoData = [...state.todoData]
                        stateCopy.todoData[i].tasks = []
                        //@ts-ignore
                        stateCopy.todoData[i].tasks.push(...action.tasksData.items)
                        
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
    setTodoLists: (todoData: Array<TodoType>) => ({type: SET_TODOLISTS, todoData} as const),
    setTasks: (tasksData: any) => ({type: SET_TASKS, tasksData} as const),
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
            dispatch(actions.setTasks(data))
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