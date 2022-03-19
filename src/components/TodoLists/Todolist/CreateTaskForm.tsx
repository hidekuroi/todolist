import { IconButton, Input, Stack } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import React, { useState } from 'react'

type PropsType = {
    createTaskHandler: (title: string) => void
}

const CreateTaskForm = (props: PropsType) => {
    const [inputText, setInputText] = useState('')

    const inputHandler = (e: any) => {
        const newText = e.target.value
        setInputText(newText)
    }

    const submitHandler = (e: any) => {
        e.preventDefault()
        props.createTaskHandler(inputText)
        setInputText('')
    }

  return (
    <div>
        <form id="createTaskForm" onSubmit={submitHandler}>
        <Stack direction='row'>
            <Input color="secondary" placeholder="Enter new task" value={inputText} onChange={inputHandler}/>
            <IconButton color="secondary" onClick={submitHandler}><SendIcon /></IconButton>
        </Stack>
        </form>
    </div>
  )
}

export default CreateTaskForm