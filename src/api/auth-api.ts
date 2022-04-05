import { FormType } from './../redux/authReducer';
import { DefaultResponseType, instance, ResultCodeForCaptcha } from "./api"

export type IsAuthResponseType = {
    id: number,
    email: string,
    login: string
}

type LoginResponseType = {
    userId: number
}

export const authAPI = {
    isAuth() {
        return instance.get<DefaultResponseType<IsAuthResponseType>>(`auth/me`)
        .then(response => response)
    },
    login(form: FormType) {
        return instance.post<DefaultResponseType<LoginResponseType>>(`auth/login`, {email: form.email, password: form.password})
        .then(response => response.data)
    },
    logout() {
        return instance.delete<DefaultResponseType>(`auth/login`)
        .then(response => response.data)
    }
}