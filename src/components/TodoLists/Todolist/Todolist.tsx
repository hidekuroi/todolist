import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Input, styled } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react'
import classes from './Todolist.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { createTask, getTasks, todoRename, TodoType, deleteTask, deleteTodo, tasksReorder, editTask } from '../../../redux/todoReducer'
import CreateTaskForm from './CreateTaskForm'
import Task, { UpdateTaskModel } from './Task'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { RootState } from '../../../redux/store';


interface PropsType extends TodoType {
  index: number
}

const Todolist = (props: PropsType) => {

    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.title);
    let [indexIsInitialized, setIndexIsInitialized] = useState(false)
    const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState(props.tasks.map((p, index) => (<Draggable index={index} draggableId={p.id} key={p.id}>{(provided) => (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}><Task  taskEdit={taskEdit} taskDeleted={taskDeleted} title={p.title}
      todoListId={props.id} taskId={p.id} taskData={p}/></li>)}</Draggable>)))

    const darkMode = useSelector((state: RootState) => {return state.app.darkMode})
    const dispatch = useDispatch()

    useEffect(() => {
       if(props)dispatch(getTasks(props.id))
    }, [])

    useEffect(() => {
      if(indexIsInitialized){
        console.log('props changed')
        dispatch(getTasks(props.id))
      }
      else {
        setIndexIsInitialized(true) 
      }

    }, [props.index])

    useEffect(() => {
      setTasks(props.tasks.map((p, index) => (<Draggable index={index} draggableId={p.id} key={p.id}>{(provided) => (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}><Task taskDeleted={taskDeleted} taskEdit={taskEdit} taskData={p} title={p.title}
        todoListId={props.id} taskId={p.id}/></li>)}</Draggable>)))
    
      
    }, [props.tasks])
    
    
    

    const titleClickHandler = () => {
        setEditMode(true)
    }

    const inputHandler = (e: any) => {
        const newValue = e.currentTarget.value
        setTitle(newValue.toUpperCase())
    }

    const inputBlurHandler = (e: any) => {
        const newTitle = e.currentTarget.value
        if(newTitle !== props.title) {
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
        backgroundColor: darkMode ? '#393939' : '#f9f9f9',
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
        bgcolor: (theme) => (darkMode ? '#303030' : '#fcfcfc'),
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
        bgcolor: (theme) => (darkMode ? '#393939' : '#f9f9f9'),
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
            <Div onClick={titleClickHandler} sx={[{'&:hover': {color: 'cyan', cursor: 'pointer'}}]}>{props.title}</Div> 
            : 
            <Input value={title} onChange={inputHandler} autoFocus={true} onBlur={inputBlurHandler}/>}
            <span><IconButton onClick={handleClickOpen}><DeleteIcon /></IconButton></span>
          </Box>
          <div><CreateTaskForm createTaskHandler={createTaskHandler}/></div>
          {props.tasks.length > 0 && <div>
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
        </Box></li>)}</Draggable>
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
            Are you sure you want to delete Todolist? All tasks will be deleted and can not be restored.
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