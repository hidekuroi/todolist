import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { authCheck } from "./authReducer";
import { RootState } from "./store";

const SET_INITIALIZED = '/app/SET-INITIALIZED';
const SET_DARKMODE = '/app/SET-DARKMODE';

export type AppInitialStateType = {
    isInitialized: boolean,
    darkMode: boolean,
}

const initialState: AppInitialStateType = {
    isInitialized: false,
    darkMode: false
}

export default (state = initialState, action:any):AppInitialStateType => {
    switch (action.type) {
        
    case SET_INITIALIZED:
        return { ...state, isInitialized: true}

    case SET_DARKMODE:
        if(!state.darkMode) return {...state, darkMode: true}
        else return {...state, darkMode: false}

    default:
        return state
    }
}

type ActionsTypes = SetInitializedType | ToggleDarkmodeType

type SetInitializedType = {
    type: typeof SET_INITIALIZED
}

type ToggleDarkmodeType = {
    type: typeof SET_DARKMODE
}

type DispatchType = Dispatch<ActionsTypes>
type ThunkType = ThunkAction<Promise<void>, RootState, unknown, ActionsTypes>

export const setInitialized = ():SetInitializedType => ({type: SET_INITIALIZED});
export const toggleDarkMode = ():ToggleDarkmodeType => ({type: SET_DARKMODE});


export const initializeApp = () => {
    return (dispatch:any) => {
        let promises = [dispatch(authCheck())];

        Promise.all(promises)
        .then(() => {
            dispatch(setInitialized());
        });
        
    }
}

export const toggleTheme = () => {
    return (dispatch: any) => {
        dispatch(toggleDarkMode())
    }
}