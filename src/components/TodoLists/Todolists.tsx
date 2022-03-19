import { Box, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { getTodos, TodoInitialStateType } from '../../redux/todoReducer'
import classes from './Todolists.module.css'
import CreateNewTodo from './CreateNewTodo'
import Todolist from './Todolist/Todolist'

// type PropsType = {
//   todoData: TodoInitialStateType
// }

const Todolists = () => {
  const todoData = useSelector((state: RootState) => {return state.todo.todoData})
  const todos = todoData?.map(listData => <Todolist key={listData.id} {...listData} />)
  // const [todos, setTodos] = useState(todoData?.map((listData, index) => (<Draggable index={index} draggableId={listData.id} key={listData.id}>{(provided) => (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}><Todolist key={listData.id} {...listData} /></li>)}</Draggable>)))
  const dispatch = useDispatch()
  useEffect(() => {
    
  dispatch(getTodos())
   
  }, [])
  // useEffect(() => {
  //   setTodos(todoData?.map((listData, index) => (<Draggable index={index} draggableId={listData.id} key={listData.id}>{(provided) => (<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}><Todolist key={listData.id} {...listData} /></li>)}</Draggable>)))
  // }, [todoData])
  

//   const dragEndHandler = (result: any) => {
//    if(todos) {const items = Array.from(todos);
// const [reorderedItem] = items.splice(result.source.index, 1);
// items.splice(result.destination.index, 0, reorderedItem);
//     if(result.source.index === result.destination.index){ return }
//   setTodos(items);}
//   }


  return (
    <div>
      {todoData ?
      <div>
        <div>
            {/* <DragDropContext onDragEnd={dragEndHandler}>
            <Droppable droppableId="tasks">
              
              {(provided) => (
                <ul className={classes.todosList} {...provided.droppableProps} ref={provided.innerRef}> */}
                  <Stack direction={'row'} spacing={2}  justifyContent="center">
                  {todos}
                  {/* {provided.placeholder} */}
                  <CreateNewTodo key='createNewTodo'/>
                  </Stack>
                {/* </ul>
              )}
              
            </Droppable>
            </DragDropContext> */}
            </div>
      </div>
      :
      <div>No data</div>
      }
    </div>
  )
}

export default Todolists