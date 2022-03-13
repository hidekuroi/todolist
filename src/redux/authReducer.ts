import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { DefaultResponseType, ResultCodeEnum } from "../api/api";
import { authAPI, IsAuthResponseType } from "../api/auth-api";
import { InferActionsType, RootState } from "./store";

const SET_AUTH_USER = 'todo/auth/SET-AUTH-USER'

export type AuthInitialStateType = {
    id: number | null,
    login: string | null,
    email: string | null,
    isAuth: boolean
}

const InitialState: AuthInitialStateType = {
    id: null,
    login: '',
    email: '',
    isAuth: false
}
//@ts-ignore
export default (state = InitialState, action: any): AuthInitialStateType => {
    switch (action.type) {
        case SET_AUTH_USER: {
            if(action.authData.resultCode === 0) {
                if(action.authData.resultCode === ResultCodeEnum.Success){
                    let stateCopy = { ...state, ...action.authData.data};
                    stateCopy.isAuth = true;
                    return stateCopy;
                }
            }
            else if(action.authData.resultCode === 1){
                let stateCopy = {...state};
                stateCopy.login = null;
                stateCopy.email = null;
                stateCopy.id = null;
                stateCopy.isAuth = false;
                
                return stateCopy;
            }
        break
        }
                
        default:{
            return state;
        }
    }
}

type ActionsTypes = InferActionsType<typeof actions>

export const actions = {
    setAuthUser: (authData: DefaultResponseType<IsAuthResponseType> | null) => ({type: SET_AUTH_USER, authData}),
}

type DispatchType = Dispatch<ActionsTypes>
type ThunkType = ThunkAction<Promise<void>, RootState, unknown, ActionsTypes>

export const authCheck = (): ThunkType => {
    return async (dispatch: DispatchType | any) => {
       let data = await authAPI.isAuth();
            dispatch(actions.setAuthUser(data.data));
    }
}

export const login = (form: FormType): ThunkType => {
    return async (dispatch: any) => {
        let data = await authAPI.login(form);
            dispatch(authCheck())
    }
}

export const logout = (): ThunkType => {
    return async (dispatch: any) => {
        let data = await authAPI.logout();
            dispatch(authCheck())
    }
}

export type FormType = {
    email: string,
    password: string
}