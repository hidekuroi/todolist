import React, { useEffect, useState } from 'react';
import './App.css';
import { connect, useDispatch, useSelector } from 'react-redux';
import { AppInitialStateType, changeTileColor, initializeApp, toggleDarkMode, toggleTheme } from './redux/appReducer';
import { compose } from 'redux';
import { RootState } from './redux/store';
import { AuthInitialStateType, logout } from './redux/authReducer';
import Todolists from './components/TodoLists/Todolists';
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import Login from './components/Login/Login';
import { actions, createSettingsTodo, editTask, TasksType, TodoType } from './redux/todoReducer';
import { UpdateTaskModel } from './components/TodoLists/Todolist/Task';
import Settings from './components/TodoLists/Settings';

type PropsType = {
  app: AppInitialStateType,
  auth: AuthInitialStateType
}


const App = (props: PropsType) => {
  const stateDarkmode = props.app.darkMode
  const todoData = useSelector((state: RootState) => {return state.todo.todoData})
  const [settings, setSettings] = useState([] as TasksType[])
  const [settingsTodolist, setSettingsTodolist] = useState({} as TodoType)
  const [open, setOpen] = useState<boolean>(false)
  const tileColor = props.app.tileColor;
  const dispatch = useDispatch();

  const handleSelectChange = (event: SelectChangeEvent) => {
    
    if(event.target.value !== tileColor){
      for (let i = 0; i < settings.length; i++) {
        if(settings[i].title === event.target.value){
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
        if(settings[k].title === tileColor){
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


  // for (let k = 0; k < settings.length; k++) {
  //   if(settings[k].title === 'darkmode' && settings[k].status === 1) dispatch(toggleTheme(true))
  //   else if(settings[k].title === 'darkmode' && settings[k].status === 1) dispatch(toggleTheme(false))
  // }

  useEffect(() => {
    if(settings.length > 0) {

      for (let k = 0; k < settings.length; k++) {
          if(settings[k].title === 'darkmode' && settings[k].status === 1) dispatch(toggleTheme(true))
          else if(settings[k].title === 'darkmode' && settings[k].status === 1) dispatch(toggleTheme(false))
        }

      for (let i = 0; i < settings.length; i++) {
        //TODO: make color||other settings vars
        if(settings[i].status === 1 && settings[i].title !== 'darkmode') dispatch(changeTileColor(settings[i].title))
      }
    }
  }, [settings])
  

  useEffect(() => {
    if(todoData){
      let isSettings = 0
      for (let i = 0; i < todoData.length; i++) {
        if(todoData[i].title === 'SETTINGS'){
          isSettings++
          setSettings(todoData[i].tasks)
          setSettingsTodolist(todoData[i])
        }
      }
      if(isSettings === 0) {
        dispatch(createSettingsTodo())
        dispatch(actions.setIsFetching())
      }
  }
  }, [todoData])
  

  useEffect(() => {
    if(!props.app.isInitialized){
      dispatch(initializeApp());
    } 
  }, [props.app.isInitialized])

  const themeToggleHandler = () => {

    for (let i = 0; i < settings.length; i++) {
      if(settings[i].title === 'darkmode') {
        const updateTaskModel: UpdateTaskModel = {
          title: settings[i].title,
          description: settings[i].description,
          completed: settings[i].completed,
          deadline: settings[i].deadline,
          priority: settings[i].priority,
          startDate: settings[i].startDate,
          status: !stateDarkmode ? 1 : 0,
        }

        dispatch(editTask(settingsTodolist.id, settings[i].id, updateTaskModel))
        dispatch(toggleTheme(!stateDarkmode ? true : false))
      }
      
    }

  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const taskEdit = (todolistId: string, taskId: string, updateTaskModel: UpdateTaskModel) => {
    dispatch(editTask(todolistId, taskId, updateTaskModel))
  }

  const logoutHandler = () => {
    dispatch(logout())
    dispatch(actions.setTodoLists(null))
    dispatch(toggleDarkMode(false))
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
        {props.auth.isAuth && <>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <IconButton aria-label="info" onClick={() => setOpen(true)}>
            <InfoIcon htmlColor={stateDarkmode ? '#e6e0f3' : ''} />
          </IconButton>

          <IconButton aria-label="darkmode" onClick={themeToggleHandler}>
            <Brightness4Icon htmlColor={stateDarkmode ? '#e6e0f3' : ''} />
          </IconButton>

          <IconButton aria-label="settings" onClick={() => setOpen(true)}>
            <SettingsIcon htmlColor={stateDarkmode ? '#e6e0f3' : ''} />
          </IconButton>
        </div>

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
              {/* <MenuItem value={'purple'}>Purple</MenuItem>
              <MenuItem value={'red'}>Red</MenuItem>
              <MenuItem value={'greenyellow'}>Green</MenuItem>
              <MenuItem value={'cyan'}>Cyan</MenuItem>
              <MenuItem value={'#ff69cc'}>Pink</MenuItem>
              <MenuItem sx={{display: (stateDarkmode ? "" : "none")}} value={'white'}>{'White/Black (Buggy)'}</MenuItem>
              <MenuItem sx={{display: (stateDarkmode ? "none" : "")}} value={'black'}>{'White/Black (Buggy)'}</MenuItem> */}
              {/* //TODO: make color||other settings vars */}
              {settings.map((i) => i.title !== 'darkmode' && <MenuItem value={i.title}>{i.title}</MenuItem>)}
            </Select>
          </FormControl>
          {/* </ThemeProvider> */}
        </Box>
        </>}

        {props.auth.login ? <div style={{color: (stateDarkmode ? 'white' : 'black')}}>{props.auth.login}<div><Button variant='text' sx={{color: tileColor}} onClick={logoutHandler}>Logout</Button>
        </div>
          <Todolists />
          <Settings open={open} handleClose={handleClose} settingsList={settingsTodolist} taskEdit={taskEdit} />
                
            
        </div> 
        : <div><Login /></div>}
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
