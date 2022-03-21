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
        return {...state, darkMode: action.bool}

    default:
        return state
    }
}

type ActionsTypes = SetInitializedType | ToggleDarkmodeType

type SetInitializedType = {
    type: typeof SET_INITIALIZED
}

type ToggleDarkmodeType = {
    type: typeof SET_DARKMODE,
    bool: boolean
}

type DispatchType = Dispatch<ActionsTypes>
type ThunkType = ThunkAction<Promise<void>, RootState, unknown, ActionsTypes>

export const setInitialized = ():SetInitializedType => ({type: SET_INITIALIZED});
export const toggleDarkMode = (bool: boolean):ToggleDarkmodeType => ({type: SET_DARKMODE, bool});


export const initializeApp = () => {
    return (dispatch:any) => {
        let promises = [dispatch(authCheck())];

        Promise.all(promises)
        .then(() => {
            dispatch(setInitialized());
        });
        
    }
}

export const toggleTheme = (bool: boolean) => {
    return (dispatch: any) => {
        dispatch(toggleDarkMode(bool))
    }
}