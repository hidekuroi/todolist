import { Box, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { getTodos, TodoInitialStateType, todosReorder } from '../../redux/todoReducer'
import classes from './Todolists.module.css'
import CreateNewTodo from './CreateNewTodo'
import Todolist from './Todolist/Todolist'

// type PropsType = {
//   todoData: TodoInitialStateType
// }

const Todolists = () => {
  const todoData = useSelector((state: RootState) => {return state.todo.todoData})
  //const todos = todoData?.map((listData, index) => <Todolist index={index} key={listData.id} {...listData} />)
  const [todos, setTodos] = useState(todoData?.map((listData, index) => <Todolist index={index} key={listData.id} {...listData} />))
  const dispatch = useDispatch()
  const state = useSelector((state: RootState) => {return state})
  useEffect(() => {
    
  dispatch(getTodos())
   
  }, [])
  useEffect(() => {
    console.log('breeeeeps')
    setTodos(todoData?.map((listData, index) => <Todolist index={index} key={listData.id} {...listData} />))
  }, [todoData])
  

  const dragEndHandler = (result: any) => {
    if(todoData){
   if(todos) {const items = Array.from(todos);
    console.log(result)
const [reorderedItem] = items.splice(result.source.index, 1);
items.splice(result.destination.index, 0, reorderedItem);
if(result.source.index === result.destination.index){ return }
  setTodos(items);
    let todoID: string | number = 0 
    if(!todoData[result.destination.index - 1]){ todoID = 0 }
    else {todoID = todoData[result.destination.index].id}

    console.log(result.source.index)
    console.log(todoID)
     dispatch(todosReorder(result.draggableId, todoID))
    }
    }
  }


  return (
    <div>
      {todoData ?
      <div>
        <div>
            <DragDropContext onDragEnd={dragEndHandler}>
            <Droppable droppableId="tasks" direction="horizontal">
              
              {(provided) => (
                <ul className={classes.todosList} {...provided.droppableProps} ref={provided.innerRef}>
                  <Stack direction={'row'} spacing={2}  justifyContent="center">
                  {todos}
                  {provided.placeholder}
                  <CreateNewTodo key='createNewTodo'/>
                  </Stack>
                </ul>
              )}
              
            </Droppable>
            </DragDropContext>
            </div>
      </div>
      :
      <div>No data</div>
      }
    </div>
  )
}

export default Todolists