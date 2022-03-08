import React, { useEffect } from 'react';
// import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import './App.css';
import { connect, useDispatch } from 'react-redux';
import { AppInitialStateType, initializeApp } from './redux/appReducer';
import { compose } from 'redux';
import { RootState } from './redux/store';
import { AuthInitialStateType } from './redux/authReducer';
import { todoAPI } from './api/todo-api';
import Todolists from './components/TodoLists/Todolists';

type PropsType = {
  app: AppInitialStateType,
  auth: AuthInitialStateType
}

// todoAPI.todolistCreate('breapsoCaster')

const App = (props: PropsType) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if(!props.app.isInitialized){
      dispatch(initializeApp());
    } 
  }, [props.app.isInitialized])

  console.log(props.app.isInitialized)
  
  return (
    <div className="App">
      {props.app.isInitialized ?
      <div>{props.auth.login ? <div>{props.auth.login} <Todolists /></div> : <div>You are not signed in</div>}</div>
      :
      <div>Loading...</div>
      }
    </div>
  );
}

let mapStateToProps = (state: RootState) => ({
  app: state.app,
  auth: state.auth
});

const composed = compose(
  // withRouter,
  connect(mapStateToProps,{initializeApp})
  );

export default composed(App);
