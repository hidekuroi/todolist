import { IconButton, Stack, styled, Typography } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import React, { useState } from 'react'
import classes from './Task.module.css'

type PropsType = {
    title: string,
    todoListId: string,
    taskId: string,

    taskCompleted: (todoListId: string, taskId: string) => void
}

const Task = (props: PropsType) => {
    const [isCompleted, setIsCompleted] = useState(false)

    const completeHandler = () => {
        if(!isCompleted) {
            setIsCompleted(true)
        }
        setTimeout(() => {
            props.taskCompleted(props.todoListId, props.taskId)
        }, 300);
    }

    return (
    <div>
        <Stack className={`${classes.task} ${isCompleted && classes.taskCompleted}`} direction="row" spacing={1}>
        <Typography className={`${classes.taskText} ${isCompleted && classes.taskCompletedText}`} variant="subtitle1" gutterBottom component="div">{props.title}</Typography>
            {!isCompleted ? <IconButton>
                <CheckBoxOutlineBlankIcon onClick={completeHandler}/>
            </IconButton>
            : <IconButton>
                <CheckBoxIcon onClick={completeHandler}/>
            </IconButton>
            }
        </Stack>
    </div>
  )
}

export default Task