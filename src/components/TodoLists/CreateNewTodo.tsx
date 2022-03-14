import { Box, Input, styled } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createNewTodo } from '../../redux/todoReducer'

const CreateNewTodo: React.FC = React.memo(() => {
    //const [inputText, setInputText] = useState('')
    const dispatch = useDispatch()
   
    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
        }));

    const inputHandler = (e: any) => {
        const newText = e.currentTarget.value.toUpperCase()
        e.currentTarget.value = newText
    }

    const submitHandler = (e: any) => {
        e.preventDefault()
        const newText = e.currentTarget[0].value
        dispatch(createNewTodo(newText))
        e.currentTarget[0].value = ''
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
            <Div><form id="createNewTodo" onSubmit={submitHandler}>
                <Input key="newTodoInput" onChange={inputHandler} placeholder='New todolist'></Input>
            </form>
            </Div>
        </Box>
    </div>
  )
})

export default CreateNewTodo