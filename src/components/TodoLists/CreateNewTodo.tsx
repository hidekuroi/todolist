import { Box, Input, styled } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createNewTodo } from '../../redux/todoReducer'

type PropsType = {
    inputText: string,

    inputHandler: (e: any) => void,
    submitHandler: (e: any) => void,
}

const CreateNewTodoForm = (props: PropsType) => {
    return(<form id="createNewTodo" onSubmit={props.submitHandler}>
                <Input key="newTodoInput" onChange={props.inputHandler} value={props.inputText} placeholder='New todolist'></Input>
            </form>
    )
}

const CreateNewTodo = () => {
    const [inputText, setInputText] = useState('')
    const dispatch = useDispatch()
   
    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
        }));

    const inputHandler = (e: any) => {
        e.preventDefault()
        const newText = e.currentTarget.value.toUpperCase()
        setInputText(newText)
    }

    const submitHandler = (e: any) => {
        e.preventDefault()
        dispatch(createNewTodo(inputText))
        setInputText('')
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
            <Div><CreateNewTodoForm inputHandler={inputHandler} inputText={inputText} submitHandler={submitHandler}/>
            </Div>
        </Box>
    </div>
  )
}

export default CreateNewTodo