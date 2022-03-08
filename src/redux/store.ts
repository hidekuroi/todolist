import { applyMiddleware, combineReducers, createStore, compose } from "redux"
import authReducer from './authReducer'
import thunk from 'redux-thunk'
import appReducer from "./appReducer";
import todoReducer from "./todoReducer";

let reducers = combineReducers({
    auth: authReducer,
    app: appReducer,
    todo: todoReducer,
});
// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

type PropertiesTypes<T> = T extends {[key: string]: infer U} ? U : never
export type InferActionsType<T extends {[key: string]: (...args: any[])=>any}> = ReturnType<PropertiesTypes<T>>





export default store;