import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { authCheck } from "./authReducer";
import { RootState } from "./store";

const SET_INITIALIZED = '/app/SET-INITIALIZED';
const SET_DARKMODE = '/app/SET-DARKMODE';
const CHANGE_TILECOLOR = '/app/CHANGE-TILECOLOR';

type TileColorType = 'purple' | 'red' | 'greenyellow' | 'cyan' | 'white' | 'black' | string

export type AppInitialStateType = {
    isInitialized: boolean,
    darkMode: boolean,
    tileColor: TileColorType
}

const initialState: AppInitialStateType = {
    isInitialized: false,
    darkMode: false,
    tileColor: 'purple'
}

export default (state = initialState, action:ActionsTypes):AppInitialStateType => {
    switch (action.type) {
        
    case SET_INITIALIZED:
        return { ...state, isInitialized: true}

    case SET_DARKMODE:
        return {...state, darkMode: action.bool}

    case CHANGE_TILECOLOR:
        if(action.color === 'white' && !state.darkMode) {
            console.log('1')
            return {...state, tileColor: 'black'}
        }
        if(action.color === 'black' && state.darkMode) {
            return {...state, tileColor: 'white'}
        }
        else {
            console.log('2');
            
            return {...state, tileColor: action.color}
        }

    default:
        return state
    }
}

type ActionsTypes = SetInitializedType | ToggleDarkmodeType | ChangeTileColor

type SetInitializedType = {
    type: typeof SET_INITIALIZED
}

type ToggleDarkmodeType = {
    type: typeof SET_DARKMODE,
    bool: boolean
}

type ChangeTileColor = {
    type: typeof CHANGE_TILECOLOR,
    color: TileColorType
}

type DispatchType = Dispatch<ActionsTypes>
type ThunkType = ThunkAction<Promise<void>, RootState, unknown, ActionsTypes>

export const setInitialized = ():SetInitializedType => ({type: SET_INITIALIZED});
export const toggleDarkMode = (bool: boolean):ToggleDarkmodeType => ({type: SET_DARKMODE, bool});
export const changeTileColor = (color: TileColorType):ChangeTileColor => ({type: CHANGE_TILECOLOR, color})


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