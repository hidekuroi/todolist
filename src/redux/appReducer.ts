import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { authCheck } from "./authReducer";
import { RootState } from "./store";

const SET_INITIALIZED = '/app/SET-INITIALIZED';
const THEME_CHANGE = '/app/THEME-CHANGE';

export type AppInitialStateType = {
    isInitialized: boolean,
}

const initialState: AppInitialStateType = {
    isInitialized: false,
}

export default (state = initialState, action:any):AppInitialStateType => {
    switch (action.type) {
        
    case SET_INITIALIZED:
        return { ...state, isInitialized: true}

    default:
        return state
    }
}

type ActionsTypes = SetInitializedType | ChangeThemeType

type SetInitializedType = {
    type: typeof SET_INITIALIZED
}

type ChangeThemeType = {
    type: typeof THEME_CHANGE
}

type DispatchType = Dispatch<ActionsTypes>
type ThunkType = ThunkAction<Promise<void>, RootState, unknown, ActionsTypes>

export const setInitialized = ():SetInitializedType => ({type: SET_INITIALIZED});



export const initializeApp = () => {
    return (dispatch:any) => {
        let promises = [dispatch(authCheck())];

        Promise.all(promises)
        .then(() => {
            dispatch(setInitialized());
        });
        
    }
}