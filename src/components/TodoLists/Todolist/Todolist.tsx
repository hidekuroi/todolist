import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Input, Menu, MenuItem, Stack, styled, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import React, { useEffect, useState } from 'react'
import classes from './Todolist.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { createTask, getTasks, todoRename, TodoType, deleteTask, deleteTodo, tasksReorder, editTask, editSettingsTask, TasksType } from '../../../redux/todoReducer'
import CreateTaskForm from './CreateTaskForm'
import Task, { UpdateTaskModel } from './Task'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { RootState } from '../../../redux/store';


interface PropsType extends TodoType {
  index: number,
  settings: TasksType[]
}

const Todolist = (props: PropsType) => {

    const darkMode = useSelector((state: RootState) => {return state.app.darkMode})
     
    const dispatch = useDispatch()

    const selectorTileColor = useSelector((state: RootState) => {return state.app.tileColor})
    const [tileColor, setTileColor] = useState(selectorTileColor)
    const [isMainColor, setIsMainColor] = useState(true)

    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.title);
    const [isUncompleted, setIsUncompleted] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [orderChanged, toggleOrderChanged] = useState(false)
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


    //TODO: unite all this fucking !== '/*settings*/'
    //TODO: *****REWRITE COMPONENT FROM SCRATCH!*****
    //! govnocode ebany


    const [initialTasks, setInitialTasks] = useState(props.tasks.map((p, index) => {
        if(p.title !== '/*settings*/'){
          return (<Draggable index={index} draggableId={p.id} key={p.id}>
          {(provided) => (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Task tileColor={isMainColor ? selectorTileColor : tileColor} taskDeleted={taskDeleted} taskEdit={taskEdit} taskData={p} title={p.title}
        todoListId={props.id} taskId={p.id} darkMode={darkMode}/></li>)}
        </Draggable>)}
        else return <span hidden></span>  
      }))

    const [tasks, setTasks] = useState(props.tasks.map((p, index) => {
      if(p.title !== '/*settings*/'){
        return (<Draggable index={index} draggableId={p.id} key={p.id}>
        {(provided) => (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
        <Task tileColor={isMainColor ? selectorTileColor : tileColor} taskDeleted={taskDeleted} taskEdit={taskEdit} taskData={p} title={p.title}
      todoListId={props.id} taskId={p.id} darkMode={darkMode}/></li>)}
      </Draggable>)}
      else return <span hidden></span>  
    }))



    const [todolistSettings, setTodolistSettings] = useState<any>({})

    let settingsTask: any
    if(props.tasks){
      for (let i = 0; i < props.tasks.length; i++) {
        if(props.tasks[i].title === '/*settings*/') settingsTask = props.tasks[i]
      }
    }

    const setTasksFun = () => {
      setTasks(props.tasks.map((p, index) => {
        if(p.title !== '/*settings*/'){
          return (<Draggable index={index} draggableId={p.id} key={p.id}>
          {(provided) => (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Task tileColor={isMainColor ? selectorTileColor : tileColor} taskDeleted={taskDeleted} taskEdit={taskEdit} taskData={p} title={p.title}
        todoListId={props.id} taskId={p.id} darkMode={darkMode}/></li>)}
        </Draggable>)}
        else return <span hidden></span>  
      }))
    }

    const setInitialTasksFun = () => {
      setInitialTasks(props.tasks.map((p, index) => {
        if(p.title !== '/*settings*/'){
          return (<Draggable index={index} draggableId={p.id} key={p.id}>
          {(provided) => (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Task tileColor={isMainColor ? selectorTileColor : tileColor} taskDeleted={taskDeleted} taskEdit={taskEdit} taskData={p} title={p.title}
        todoListId={props.id} taskId={p.id} darkMode={darkMode}/></li>)}
        </Draggable>)}
        else return <span hidden></span>  
      }))
    }

    

    const uncompletedFilter = (task: any) => {
      for (let i = 0; i < props.tasks.length; i++) {
        if(task.props.draggableId === props.tasks[i].id) {
          if(props.tasks[i].status === 0) return task
        }
      }
      return
    }

    const completedFilter = (task: any) => {
      for (let i = 0; i < props.tasks.length; i++) {
        if(task.props.draggableId === props.tasks[i].id) {
          if(props.tasks[i].status === 1) return task
        }
      }
      return
    }

    // useEffect(() => {
    //    if(props)dispatch(getTasks(props.id))
    // }, [])

    useEffect(() => {
      // if(indexIsInitialized){
      //   dispatch(getTasks(props.id))
      // }
      // else {
      //   setIndexIsInitialized(true) 
      // }

    }, [props.index])

    useEffect(() => {
      setInitialTasksFun()
      setTasksFun()

      toggleOrderChanged(!orderChanged)


      props.tasks.map((task) => {
        console.log('CHANGED')
        if(task.title === '/*settings*/') {
          let keyValue: any = {}

          const settings = task?.description?.split(';')
          settings?.map((setting) => {
            const splitted = setting.split('=')
            keyValue[splitted[0]] = splitted[1]
          })

          setTodolistSettings(keyValue)
          return
        }
      })
      
    }, [props.tasks])

    useEffect(() => {
      dispatch(getTasks(props.id))
    }, [props.index, props.id, props.order])

    useEffect(() => {
      if(todolistSettings.filter === '0') {
        setIsUncompleted(false)
        setIsCompleted(false)
      }
      else if(todolistSettings.filter === '1') {
        setIsUncompleted(true)
        setIsCompleted(false)
      }
      else if(todolistSettings.filter === '2') {
        setIsUncompleted(false)
        setIsCompleted(true)
      }

      if(todolistSettings.tileColor && todolistSettings.tileColor !== 'main') {
        setIsMainColor(false)
        setTileColor(todolistSettings.tileColor)
      }
    }, [todolistSettings])

    // useEffect(() => {
    //   //console.log(tileColor)
    //   console.log('changed')

    //   setTasks(initialTasks.filter)
    // }, [tileColor, selectorTileColor])

    useEffect(() => {
      setInitialTasksFun()
    }, [tileColor, selectorTileColor])

    useEffect(() => {
      if(!isUncompleted && !isCompleted){
      setTasks(initialTasks)
      }
      else {
        if(isUncompleted){
          setTasks(initialTasks.filter(uncompletedFilter))
        }
        if(isCompleted){
          setTasks(initialTasks.filter(completedFilter))
        }
      }
    
      
    }, [isUncompleted, isCompleted, orderChanged, initialTasks])
    
    
    const uncompletedHandler = () => {
      setIsCompleted(false)
      setIsUncompleted(!isUncompleted)

        let settingsCopy = todolistSettings

        if(!isUncompleted === false) {
          settingsCopy.filter = '0'
        }
        else {
          settingsCopy.filter = '1'
        }


        dispatch(editSettingsTask(props.id, settingsTask, settingsCopy))
      }

      useEffect(() => {
        console.log('rerendered')
      }, [tasks])
      

    const completedHandler = () => {
      setIsUncompleted(false)
      setIsCompleted(!isCompleted)

        let settingsCopy = todolistSettings

        if(!isCompleted === false) {
          settingsCopy.filter = '0'
        }
        else {
          settingsCopy.filter = '2'
        }


        dispatch(editSettingsTask(props.id, settingsTask, settingsCopy))
    }

    const changeListTileColor = (color: string) => {
      setTileColor(color)
      setIsMainColor(false)

      let settingsCopy = todolistSettings
      settingsCopy.tileColor = color

      dispatch(editSettingsTask(props.id, settingsTask, settingsCopy))
    }    

    const titleClickHandler = () => {
        setEditMode(true)
    }

    const openMenu = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const inputHandler = (e: any) => {
        const newValue = e.currentTarget.value
        setTitle(newValue.toUpperCase())
    }

    const inputBlurHandler = () => {
        const newTitle = title
        if(newTitle !== props.title && newTitle !== 'SETTINGS') {
            dispatch(todoRename(newTitle, props.id))
        }
        setEditMode(false)
    }

    const deleteTodoHandler = () => {
      dispatch(deleteTodo(props.id))
      setOpen(false);
    }

    const createTaskHandler = (title: string) => {
      dispatch(createTask(title, props.id))
    }

    const taskDeleted = (todoListId: string, taskId: string) => {
      dispatch(deleteTask(todoListId, taskId))
    }

    const taskEdit = (todolistId: string, taskId: string, updateTaskModel: UpdateTaskModel) => {
      dispatch(editTask(todolistId, taskId, updateTaskModel))
    }

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const Div = styled('span')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: title.startsWith('*') ? (darkMode ? '#241f2e' : '#e6e0f3') : (darkMode ? '#393939' : '#f9f9f9'),
        padding: theme.spacing(1),
        }));

    const dragEndHandler = (result: any) => {
      const items = Array.from(tasks);
const [reorderedItem] = items.splice(result.source.index, 1);
items.splice(result.destination.index, 0, reorderedItem);
      if(result.source.index === result.destination.index){ return }
    setTasks(items);
    let taskID: string | number = 0 
    if(!props.tasks[result.destination.index - 1]){ taskID = 0 }
    else {taskID = props.tasks[result.destination.index - 1].id}
    dispatch(tasksReorder(props.id, result.draggableId, taskID))
    }
    
  return (
    <div>
        <Draggable index={props.index} draggableId={props.id} key={props.id}>{(provided) => (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
      <Box component="span" 
    sx={{
        display: 'block',
        p: 1,
        m: 1,
        bgcolor: (theme) => (title.startsWith('*') ? (darkMode ? '#1a1622' : '#f2ecff') : (darkMode ? '#303030' : '#fcfcfc')),
        color: (theme) =>
        darkMode ? 'grey.300' : 'grey.800',
        border: '1px solid',
        borderColor: (theme) =>
        darkMode ? 'grey.800' : 'grey.300',
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
      }}>
          <Box component="span" 
    sx={{
        display: 'block',
        p: 1,
        m: 1,
        bgcolor: (theme) => (title.startsWith('*') ? (darkMode ? '#241f2e' : '#e6e0f3') : (darkMode ? '#393939' : '#f9f9f9')),
        color: (theme) =>
        darkMode ? 'grey.300' : 'grey.800',
        border: '1px solid',
        borderColor: (theme) =>
        darkMode ? 'grey.800' : 'grey.300',
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
      }}>
            {!editMode 
            ? 
            <Div onClick={titleClickHandler} sx={[{transition: '0.2s'}, {'&:hover': {color: selectorTileColor, cursor: 'pointer'}}]}>{props.title}</Div> 
            : 
            <form onSubmit={inputBlurHandler}><Input sx={{color: 'inherit'}} value={title} onChange={inputHandler} autoFocus={true} onBlur={inputBlurHandler}/></form>}
            <span>
            <IconButton color={'inherit'}
            id="task-button"
            aria-controls={openMenu ? 'task-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            onClick={handleClick}
            sx={[{transition: '0.2s'}, {'&:hover': {color: selectorTileColor}}]}
            >
              <EditIcon />
            </IconButton>

            <Menu
                    id="task-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    variant='menu'
                    MenuListProps={{
                    'aria-labelledby': 'task-button',
                    }}
                >

                    <MenuItem onClick={() => {
                      handleCloseMenu()
                      titleClickHandler()
                      }}><DriveFileRenameOutlineIcon /> Rename</MenuItem>

                    <MenuItem sx={[{backgroundColor: 'rgba(255, 0 , 0, 10%)'}, {'&:hover': {backgroundColor: 'rgba(255, 0, 0, 15%)'}}]} onClick={() => {
                      handleCloseMenu()
                      handleClickOpen()
                      }}><DeleteIcon htmlColor='darkred'/> <p style={{color: 'darkred'}}>Delete list</p></MenuItem>

                    <MenuItem>
                    <Accordion >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <ColorLensIcon /> Tile color
                      </AccordionSummary>
                      <AccordionDetails>
                        <MenuItem onClick={() => changeListTileColor('main')} value='main'>Main</MenuItem>
                        {props.settings.map((i) => i.title !== 'darkmode' && <div style={{display: 'flex', alignItems: 'center'}}><Brightness1Icon htmlColor={i.title} /><MenuItem onClick={() => changeListTileColor(i.title)} value={i.title}>{i.title}</MenuItem></div>)}
                      </AccordionDetails>
                    </Accordion>
                    </MenuItem>

                    
            </Menu>
            </span>
          </Box>
          <div><CreateTaskForm createTaskHandler={createTaskHandler}/></div>
          <div>
            <Divider light={true} sx={{marginBottom: '10px'}} />
            <Stack sx={{marginBottom: '10px'}} direction='row' spacing={1}>
              {isUncompleted 
              ? <div><Button size='small' variant='contained' color='primary' onClick={uncompletedHandler}>Uncompleted</Button></div>
              : <div><Button size='small' variant='outlined' color='primary' onClick={uncompletedHandler}>Uncompleted</Button></div>
              }
              {isCompleted 
              ? <div><Button size='small' variant='contained' color='primary' onClick={completedHandler}>Completed</Button></div>
              : <div><Button size='small' variant='outlined' color='primary' onClick={completedHandler}>Completed</Button></div>
              }

            </Stack>
            <Divider light={true} sx={{marginBottom: '10px'}} />
          </div>
          {props.tasks.length > 0 && <div className={classes.tasks}>
            <DragDropContext onDragEnd={dragEndHandler}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <ul className={classes.taskList} {...provided.droppableProps} ref={provided.innerRef}>{tasks}
                {provided.placeholder}
                </ul>
              )}
            </Droppable>
            </DragDropContext>
            </div>}
        </Box>
        </li>)}
        </Draggable>
          <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Todolist?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete Todolist? All tasks will be deleted and won't be able to restore.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button color="error" onClick={deleteTodoHandler} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  )
}

export default Todolist
