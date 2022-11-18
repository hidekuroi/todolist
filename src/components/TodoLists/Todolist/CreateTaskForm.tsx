import { createTheme, IconButton, Input, Stack } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@emotion/react';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';

type PropsType = {
    createTaskHandler: (title: string) => void
}

const CreateTaskForm = (props: PropsType) => {
    const [inputText, setInputText] = useState('')
    const [darkTheme, setDarkTheme] = useState(createTheme({
        palette: {
          mode: 'dark',
        },
      }))
    const isDarkMode = useSelector((state: RootState) => {return state.app.darkMode})
    const tileColor = useSelector((state: RootState) => {return state.app.tileColor})

    const inputHandler = (e: any) => {
        const newText = e.target.value
        setInputText(newText)
    }

    const submitHandler = (e: any) => {
        e.preventDefault()
        props.createTaskHandler(inputText)
        setInputText('')
    }


    useEffect(() => {
      if(isDarkMode) {
        setDarkTheme(createTheme({
            palette: {
              mode: 'dark',
            },
          }))
      }
      else {
        setDarkTheme(createTheme({
            palette: {
              mode: 'light',
            },
          }))
      }
    }, [isDarkMode])
    

  return (
    <div>
        <form id="createTaskForm" onSubmit={submitHandler}>
        <Stack direction='row'>
            <ThemeProvider theme={darkTheme}>
            <Input color={'primary'} placeholder="Enter new task" value={inputText} onChange={inputHandler}/>
            <IconButton sx={{color: tileColor}} onClick={submitHandler}><SendIcon /></IconButton>
            </ThemeProvider>
        </Stack>
        </form>
    </div>
  )
}

export default CreateTaskForm