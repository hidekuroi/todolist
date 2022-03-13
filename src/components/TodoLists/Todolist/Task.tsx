import { IconButton, Stack, styled, Typography } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import React, { useState } from 'react'

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
        props.taskCompleted(props.todoListId, props.taskId)
    }

    return (
    <div>
        <Stack direction="row" spacing={1}>
        <Typography color="secondary" variant="subtitle1" gutterBottom component="div">{props.title}</Typography>
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