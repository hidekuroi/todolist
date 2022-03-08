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
}