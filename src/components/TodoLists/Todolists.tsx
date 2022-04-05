import { Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { getTasks, getTodos, todosReorder } from '../../redux/todoReducer'
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
  const [settingsInitialized, setSettingsInitialized] = useState(false)
  const dispatch = useDispatch()

  
const settingsFilter = (todo:any) => {
    if(todo.props.title !== 'SETTINGS') { 
      return todo
    }
    else if(todo.props.title === 'SETTINGS' && !settingsInitialized) {
      dispatch(getTasks(todo.props.id))
      setSettingsInitialized(true)
      return
    }
  }

  useEffect(() => {
    
  dispatch(getTodos())
   
  }, [])
  useEffect(() => {
    setTodos(todoData?.map((listData, index) => <Todolist index={index} key={listData.id} {...listData} />))
  }, [todoData])
  

  const dragEndHandler = (result: any) => {
    if(todoData){
   if(todos) {const items = Array.from(todos);
const [reorderedItem] = items.splice(result.source.index, 1);
items.splice(result.destination.index, 0, reorderedItem);
if(result.source.index === result.destination.index){ return }
  setTodos(items);
    let todoID: string | number = 0 
    if(!todoData[result.destination.index - 1]){ todoID = 0 }
    else {todoID = todoData[result.destination.index - 1].id}

     dispatch(todosReorder(result.draggableId, todoID))
    }
    }
  }


  return (
    <div>
      {todoData ?
      <div>
        <div >
            <DragDropContext onDragEnd={dragEndHandler}>
            <Droppable droppableId="tasks" direction="horizontal">
              
              {(provided) => (
                <ul className={classes.todosList} {...provided.droppableProps} ref={provided.innerRef}>
                  <Stack style={{overflowX: 'auto'}} direction={'row'} spacing={2}  justifyContent="center">
                  {todos?.filter(settingsFilter)}
                  {provided.placeholder}
                  <div style={{minWidth: '200px'}}>
                  <CreateNewTodo  key='createNewTodo'/>
                  </div>
                  </Stack>
                </ul>
              )}
              
            </Droppable>
            </DragDropContext>
            </div>
      </div>
      :
      <div>
          <Stack direction={'row'} spacing={2}  justifyContent="center">
          <CreateNewTodo key='createNewTodo'/>
          </Stack>
      </div>
      }
    </div>
  )
}

export default Todolists