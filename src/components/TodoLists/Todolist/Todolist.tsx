import { Box, Input, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createTask, getTasks, todoRename, TodoType, deleteTask } from '../../../redux/todoReducer'
import CreateTaskForm from './CreateTaskForm'
import Task from './Task'

type PropsType = TodoType

const Todolist = (props: PropsType) => {

    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.title);

    const dispatch = useDispatch()

    useEffect(() => {
      console.log('called')
       if(props)dispatch(getTasks(props.id))
    }, [])
    

    const titleClickHandler = () => {
        setEditMode(true)
    }

    const inputHandler = (e: any) => {
        const newValue = e.currentTarget.value
        setTitle(newValue)
    }

    const inputBlurHandler = (e: any) => {
        const newTitle = e.currentTarget.value
        if(newTitle !== props.title) {
            dispatch(todoRename(newTitle, props.id))
            dispatch(createTask(newTitle, props.id))
        }
        setEditMode(false)
    }

    const createTaskHandler = (title: string) => {
      dispatch(createTask(title, props.id))
    }

    const taskCompleted = (todoListId: string, taskId: string) => {
      dispatch(deleteTask(todoListId, taskId))
    }

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
        }));

    const tasks = props.tasks.map(p => (<Task taskCompleted={taskCompleted} title={p.title}
                                              todoListId={props.id} taskId={p.id}/>))

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
            <Div onClick={titleClickHandler} sx={[{'&:hover': {color: 'cyan'}}]}>{props.title}</Div> 
            : 
            <Input value={title} onChange={inputHandler} autoFocus={true} onBlur={inputBlurHandler}/>}
          </Box>

          {props.tasks.length > 0 && <div>{tasks}</div>}
          <div><CreateTaskForm createTaskHandler={createTaskHandler}/></div>

    </div>
  )
}

export default Todolist