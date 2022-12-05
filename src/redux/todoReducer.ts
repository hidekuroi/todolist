import { UpdateTaskModel } from './../components/TodoLists/Todolist/Task';
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { GetTasksResponseType, todoAPI } from "../api/todo-api";
import { InferActionsType, RootState } from "./store";

let isFetching = false

const SET_TODOLISTS = 'todo/todo/SET-TODOLISTS'
const SET_TASKS = 'todo/todo/SET-TASKS'
const REMOVE_TODO = 'todo/todo/REMOVE-TODO'
const SHIFT_TODO = 'todo/todo/SHIFT-TODO'
const SET_IS_FETCHING = 'todo/todo/SET-IS-FETCHING'

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
    isInitialized: false,
}
//@ts-ignore
export default (state = InitialState, action: ActionsTypes): TodoInitialStateType => {
    switch (action.type) {
        case SET_TODOLISTS: {
            if (!state.todoData){
                let stateCopy = {...state, todoData: action.todoData}
                if(action.todoData && stateCopy.todoData){
                for (let i = 0; i < action.todoData.length; i++) {
                    stateCopy.todoData[i] = {...stateCopy.todoData[i], tasks: []}
                }
                }
                return stateCopy
            }
            else{
                if(action.todoData === null) {
                    let stateCopy = {...state, todoData: null}
                    return stateCopy
                }
                let stateCopy = {...state, todoData: action.todoData}
                if(stateCopy.todoData.length === action.todoData.length){
                    for (let i = 0; i < action.todoData.length; i++) {
                        stateCopy.todoData[i] = {...stateCopy.todoData[i], tasks: [...state.todoData[i].tasks]}
                    }
                }
                else {
                   console.log('hz')
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

        case SHIFT_TODO: {
            let stateCopy = {...state, todoData: state.todoData}
            stateCopy = {...stateCopy, isInitialized: state.isInitialized}
            stateCopy.todoData?.unshift({
                id: '',
                title: action.title,
                addedDate: '',
                order: -9999,
                totalCount: 0,
                tasks: []
            })
            return stateCopy
        }

        case SET_IS_FETCHING: {
            isFetching = true
            return state
        }
                
        default:{
            return state;
        }
    }
}

type ActionsTypes = InferActionsType<typeof actions>

export const actions = {
    setTodoLists: (todoData: Array<TodoType> | null) => ({type: SET_TODOLISTS, todoData} as const),
    setTasks: (tasksData: GetTasksResponseType, id: string) => ({type: SET_TASKS, tasksData, id} as const),
    removeTodo: (id: string) => ({type: REMOVE_TODO, id} as const),
    shiftTodo: (title: string) => ({type: SHIFT_TODO, title} as const),
    setIsFetching: () => ({type: SET_IS_FETCHING} as const)
}

type DispatchType = Dispatch<ActionsTypes>
type ThunkType = ThunkAction<Promise<void>, RootState, unknown, ActionsTypes>

export const createSettingsTodo = (): ThunkType => {
    return async (dispatch: any) => {
        if(!isFetching){
            const data = await todoAPI.todolistCreate('SETTINGS')
            //@ts-ignore
            const settingsListId = data.data.item.id


            dispatch(actions.shiftTodo('SETTINGS'))

            let pink = await todoAPI.createTask('#FF69CC', settingsListId)
            let purple = await todoAPI.createTask('Purple', settingsListId)
            let red = await todoAPI.createTask('Red', settingsListId)
            let greenyellow = await todoAPI.createTask('Greenyellow', settingsListId)
            let cyan = await todoAPI.createTask('Cyan', settingsListId)
            let white = await todoAPI.createTask('White', settingsListId)
            let black = await todoAPI.createTask('Black', settingsListId)
            let darkmode = await todoAPI.createTask('darkmode', settingsListId)

            const purpleTask = purple.data.item

            const updateTaskModel: UpdateTaskModel = {
                title: purpleTask.title,
                description: purpleTask.description,
                completed: purpleTask.completed,
                deadline: purpleTask.deadline,
                priority: purpleTask.priority,
                startDate: purpleTask.startDate,
                status: 1,
            }

            dispatch(editTask(settingsListId, purpleTask.id, updateTaskModel))

            setTimeout(() => {
                dispatch(getTodos())
            }, 4000);
        }
    }
}

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

export const todosReorder = (todolistId: string, putAfterId: string | number): ThunkType => {
    return async (dispatch: any) => {
        let data = await todoAPI.todosReorder(todolistId, putAfterId)
            setTimeout(() => {
                dispatch(getTodos())
                // setTimeout(() => {
                //     dispatch(getTasks(todolistId))
                //     if(typeof putAfterId == 'string')dispatch(getTasks(putAfterId))
                // }, 200);
            }, 400);
    }
}

export const getTasks = (id: string): ThunkType => {
    return async (dispatch: DispatchType) => {
        let data = await todoAPI.getTasks(id)
            dispatch(actions.setTasks(data, id))
    }
}

export const createTask = (title: string, id: string, order?: number): ThunkType => {
    return async (dispatch: any) => {
        let data = await todoAPI.createTask(title, id, order)

        if(title === '/*settings*/') {
            const settingsTask = data.data.item
            const updateTaskModel: UpdateTaskModel = {
                title: settingsTask.title,
                description: 'filter=0,tileColor=main',
                completed: settingsTask.completed,
                deadline: settingsTask.deadline,
                priority: settingsTask.priority,
                startDate: settingsTask.startDate,
                status: settingsTask.status,
            }
            dispatch(editTask(id, settingsTask.id, updateTaskModel))
        }
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
        await todoAPI.todolistCreate(title).then((data) => {
            //? idk im too lazy to fix that typeshit
            //@ts-ignore
            dispatch(createTask('/*settings*/', data.data.item.id))
            dispatch(actions.shiftTodo(title))
            dispatch(getTodos())
        })
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
        let data = await todoAPI.taskChange(todolistId, taskId, updateTaskModel)
        setTimeout(() => {
            dispatch(getTasks(todolistId))
        }, 400);
    }
}

export const editSettingsTask = (todolistId: string, task: TasksType, settings: any): ThunkType => {
    return async (dispatch: any) => {
        console.log(settings)
        const updateTaskModel: UpdateTaskModel = {
            title: task.title,
            description: `filter=${settings.filter};tileColor=${settings.tileColor ? settings.tileColor: 'main'}`,
            completed: task.completed,
            deadline: task.deadline,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status,
        }
        await todoAPI.taskChange(todolistId, task.id, updateTaskModel).then((data) => {
          //  dispatch(getTasks(todolistId))
        })
    }
}