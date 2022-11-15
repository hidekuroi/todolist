import React, { useEffect, useState } from 'react';
import './App.css';
import { connect, useDispatch, useSelector } from 'react-redux';
import { AppInitialStateType, changeTileColor, initializeApp, toggleTheme } from './redux/appReducer';
import { compose } from 'redux';
import { RootState } from './redux/store';
import { AuthInitialStateType, logout } from './redux/authReducer';
import Todolists from './components/TodoLists/Todolists';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, ThemeProvider } from '@mui/material';
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
  const tileColor = props.app.tileColor;
  const dispatch = useDispatch();

  let apiDarkmode: boolean = false


  const handleSelectChange = (event: SelectChangeEvent) => {
    
    if(event.target.value !== tileColor){
      for (let i = 0; i < settings.length; i++) {
        console.log(settings[i].title)
        console.log(event.target.value)
        if(settings[i].title == event.target.value){
          console.log('SEKAI')
          const updateTaskModel: UpdateTaskModel = {
            title: settings[i].title,
            description: settings[i].description,
            completed: settings[i].completed,
            deadline: settings[i].deadline,
            priority: settings[i].priority,
            startDate: settings[i].startDate,
            status: 1,
        }

        dispatch(editTask(settingsTodolist.id, settings[i].id, updateTaskModel))
        
        }
        
      }
      for (let k = 0; k < settings.length; k++) {
        if(settings[k].title == tileColor){
          const updateTaskModel: UpdateTaskModel = {
            title: settings[k].title,
            description: settings[k].description,
            completed: settings[k].completed,
            deadline: settings[k].deadline,
            priority: settings[k].priority,
            startDate: settings[k].startDate,
            status: 0,
        }
        dispatch(editTask(settingsTodolist.id, settings[k].id, updateTaskModel))
      }
      }
      dispatch(changeTileColor(event.target.value))
    }
  };

  useEffect(() => {
    console.log(settings)
    if(settings.length > 0) {
      if(settings[0].status === 0) dispatch(toggleTheme(false))
      else if(settings[0].status === 1) dispatch(toggleTheme(true))

      for (let i = 1; i < settings.length; i++) {
        if(settings[i].status === 1) dispatch(changeTileColor(settings[i].title))
      }
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
          <Brightness4Icon htmlColor={stateDarkmode ? '#e6e0f3' : ''} />
        </IconButton>

        <Box sx={{ minWidth: 120 }}>
          {/* <ThemeProvider theme={dark}> */}
          <FormControl>
            <InputLabel id="demo-simple-select-label" sx={{color: (stateDarkmode ? 'white' : 'black')}}>Tile color</InputLabel>
            <Select
              defaultValue='purple'
              sx={{color: (stateDarkmode ? 'white' : 'black')}}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tileColor}
              label="Tile color"
              onChange={handleSelectChange}
              
            >
              <MenuItem value={'purple'}>Purple</MenuItem>
              <MenuItem value={'red'}>Red</MenuItem>
              <MenuItem value={'greenyellow'}>Green</MenuItem>
              <MenuItem value={'cyan'}>Blue</MenuItem>
              <MenuItem sx={{display: (stateDarkmode ? "" : "none")}} value={'white'}>{'White/Black'}</MenuItem>
              <MenuItem sx={{display: (stateDarkmode ? "none" : "")}} value={'black'}>{'White/Black'}</MenuItem>
            </Select>
          </FormControl>
          {/* </ThemeProvider> */}
        </Box>

        {props.auth.login ? <div style={{color: (stateDarkmode ? 'white' : 'black')}}>{props.auth.login}<div><Button variant='text' sx={{color: tileColor}} onClick={logoutHandler}>Logout</Button></div> <Todolists /></div> : <div><Login /></div>}
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
