import { IconButton, Stack } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import React from 'react'

type PropsType = {
    title: string,
    todoListId: string,
    taskId: string,

    taskCompleted: (todoListId: string, taskId: string) => void
}

const Task = (props: PropsType) => {
    const completeHandler = () => {
        props.taskCompleted(props.todoListId, props.taskId)
    }

  return (
    <div>
        <Stack direction="row" spacing={1}>
            <div>{props.title}</div>
            <IconButton>
                <CheckBoxOutlineBlankIcon onClick={completeHandler}/>
            </IconButton>
        </Stack>
    </div>
  )
}

export default Task