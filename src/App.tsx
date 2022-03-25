import React, { useEffect, useState } from 'react';
// import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import './App.css';
import { connect, useDispatch, useSelector } from 'react-redux';
import { AppInitialStateType, initializeApp, toggleTheme } from './redux/appReducer';
import { compose } from 'redux';
import { RootState } from './redux/store';
import { AuthInitialStateType, logout } from './redux/authReducer';
import { todoAPI } from './api/todo-api';
import Todolists from './components/TodoLists/Todolists';
import { Button, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Login from './components/Login/Login';
import { actions, editTask, TasksType, TodoType } from './redux/todoReducer';
import { UpdateTaskModel } from './components/TodoLists/Todolist/Task';

type PropsType = {
  app: AppInitialStateType,
  auth: AuthInitialStateType
}

// todoAPI.todolistCreate('breapsoCaster')

const App = (props: PropsType) => {
  const stateDarkmode = props.app.darkMode
  const todoData = useSelector((state: RootState) => {return state.todo.todoData})
  const [settings, setSettings] = useState([] as TasksType[])
  const [settingsTodolist, setSettingsTodolist] = useState({} as TodoType)
  let apiDarkmode: boolean = false

  useEffect(() => {
    if(settings.length > 0) {
      if(settings[0].status === 0) dispatch(toggleTheme(false))
      else if(settings[0].status === 1) dispatch(toggleTheme(true))
    }
  }, [settings])
  

  useEffect(() => {
    if(todoData){
      for (let i = 0; i < todoData.length; i++) {
        if(todoData[i].title === 'SETTINGS'){
          setSettings(todoData[i].tasks)
          setSettingsTodolist(todoData[i])
        }
      }
  }
  }, [todoData])
  

  const dispatch = useDispatch();
  useEffect(() => {
    if(!props.app.isInitialized){
      dispatch(initializeApp());
    } 
  }, [props.app.isInitialized])

  const themeToggleHandler = () => {
    if(!stateDarkmode){
      const updateTaskModel: UpdateTaskModel = {
        title: settings[0].title,
        description: settings[0].description,
        completed: settings[0].completed,
        deadline: settings[0].deadline,
        priority: settings[0].priority,
        startDate: settings[0].startDate,
        status: 1,
    }
      dispatch(editTask(settingsTodolist.id, settings[0].id, updateTaskModel))
      dispatch(toggleTheme(true))
    }
    else {
      const updateTaskModel: UpdateTaskModel = {
        title: settings[0].title,
        description: settings[0].description,
        completed: settings[0].completed,
        deadline: settings[0].deadline,
        priority: settings[0].priority,
        startDate: settings[0].startDate,
        status: 0,
    }
      dispatch(editTask(settingsTodolist.id, settings[0].id, updateTaskModel))
      dispatch(toggleTheme(false))
    }
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
        {props.auth.login ? <div>{props.auth.login}<div><Button variant='text' color="secondary" onClick={logoutHandler}>Logout</Button></div> <Todolists /></div> : <div><Login /></div>}
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
