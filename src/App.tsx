import React, { useEffect } from 'react';
// import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import './App.css';
import { connect, useDispatch, useSelector } from 'react-redux';
import { AppInitialStateType, initializeApp, toggleTheme } from './redux/appReducer';
import { compose } from 'redux';
import { RootState } from './redux/store';
import { AuthInitialStateType, logout } from './redux/authReducer';
import { todoAPI } from './api/todo-api';
import Todolists from './components/TodoLists/Todolists';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Login from './components/Login/Login';
import { actions } from './redux/todoReducer';

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

  const themeToggleHandler = () => {
    dispatch(toggleTheme())
  }

  const logoutHandler = () => {
    dispatch(logout())
    dispatch(actions.setTodoLists(null))
  }

  let style = {
    backgroundColor: '#232324',
    transition: '0.3s'
  };
  if(!props.app.darkMode) {
    style = {
      backgroundColor: 'white',
      transition: '0.3s'
    };
  }
  else if (props.app.darkMode) {
    style = {
      backgroundColor: '#232324',
      transition: '0.3s'
    };
  }
  
  return (
    <body style={style}>
    <div className="App">
      {props.app.isInitialized ?
      <div>
        <IconButton aria-label="darkmode" onClick={themeToggleHandler}>
          <Brightness4Icon />
        </IconButton>
        {props.auth.login ? <div>{props.auth.login}<div><button onClick={logoutHandler}>Logout</button></div> <Todolists /></div> : <div><Login /></div>}
      </div>
      :
      <div>Loading...</div>
      }
    </div>
    </body>
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
