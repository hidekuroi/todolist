import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Input, styled } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react'
import classes from './Todolist.module.css'
import { useDispatch } from 'react-redux'
import { createTask, getTasks, todoRename, TodoType, deleteTask, deleteTodo, tasksReorder } from '../../../redux/todoReducer'
import CreateTaskForm from './CreateTaskForm'
import Task from './Task'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';


type PropsType = TodoType

const Todolist = (props: PropsType) => {

    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.title);
    const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState(props.tasks.map((p, index) => (<Draggable index={index} draggableId={p.id} key={p.id}>{(provided) => (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}><Task taskCompleted={taskCompleted} title={p.title}
      todoListId={props.id} taskId={p.id}/></li>)}</Draggable>)))

    const dispatch = useDispatch()

    useEffect(() => {
       if(props)dispatch(getTasks(props.id))
    }, [])

    // useEffect(() => {
    //   console.log('props id')
    //   dispatch(getTasks(props.id))
      
    // }, [props.id])

    useEffect(() => {
      setTasks(props.tasks.map((p, index) => (<Draggable index={index} draggableId={p.id} key={p.id}>{(provided) => (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}><Task taskCompleted={taskCompleted} title={p.title}
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

    const taskCompleted = (todoListId: string, taskId: string) => {
      dispatch(deleteTask(todoListId, taskId))
    }

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
        }));

    const dragEndHandler = (result: any) => {
      const items = Array.from(tasks);
const [reorderedItem] = items.splice(result.source.index, 1);
items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
    let taskID: string | number = 0 
    if(!props.tasks[result.destination.index - 1]){ taskID = 0 }
    else {taskID = props.tasks[result.destination.index - 1].id}
    dispatch(tasksReorder(props.id, result.draggableId, taskID))
    }
    
  return (
    <div>
        <Box component="span" 
    sx={{
        display: 'block',
        p: 1,
        m: 1,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
        color: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
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
          <div><CreateTaskForm createTaskHandler={createTaskHandler}/></div>

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
          <Button color="secondary" onClick={deleteTodoHandler} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  )
}

export default Todolist