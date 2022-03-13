import { Box, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { getTodos, TodoInitialStateType } from '../../redux/todoReducer'
import CreateNewTodo from './CreateNewTodo'
import Todolist from './Todolist/Todolist'

// type PropsType = {
//   todoData: TodoInitialStateType
// }

const Todolists = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    
  dispatch(getTodos())
   
  }, [])

  const todoData = useSelector((state: RootState) => {return state.todo.todoData})

  const TodoArr = todoData?.map(listData => <Todolist {...listData} />)

  return (
    <div>
      {todoData ?
      <div>
        <Stack direction={'row'} spacing={2} alignItems="center" justifyContent="center">
          {TodoArr}
        <CreateNewTodo key='createNewTodo'/>
        </Stack>
      </div>
      :
      <div>No data</div>
      }
    </div>
  )
}

export default Todolists