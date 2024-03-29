import { Box, Input, styled } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { createNewTodo, getTodos} from '../../redux/todoReducer'

const CreateNewTodo: React.FC = React.memo(() => {
    const dispatch = useDispatch()
    const darkMode = useSelector((state: RootState) => {return state.app.darkMode})
   
    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: darkMode ? '#393939' : '#f9f9f9',
        padding: theme.spacing(1),
        }));

    const inputHandler = (e: any) => {
        const newText = e.currentTarget.value.toUpperCase()
        e.currentTarget.value = newText
    }

    const submitHandler = (e: any) => {
        e.preventDefault()
        const newText = e.currentTarget[0].value
        if(newText === 'SETTINGS') return
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
        bgcolor: (theme) => (darkMode ? '#393939' : '#f9f9f9'),
        color: (theme) =>   (darkMode ? 'grey.300' : 'grey.800'),
        border: '1px solid',
        borderColor: (theme) =>
        darkMode ? 'grey.800' : 'grey.300',
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
      }}>
            <Div style={{width: '150px'}}><form id="createNewTodo" onSubmit={submitHandler}>
                <Input color={'primary'} style={{color: (darkMode ? 'white' : 'black')}} key="newTodoInput" onChange={inputHandler} placeholder='New todolist'></Input>
            </form>
            </Div>
        </Box>
    </div>
  )
})

export default CreateNewTodo