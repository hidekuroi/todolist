import { Button, IconButton, Stack } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { getTasks, getTodos, todosReorder } from '../../redux/todoReducer'
import classes from './Todolists.module.css'
import CreateNewTodo from './CreateNewTodo'
import Todolist from './Todolist/Todolist'

import ChevronLeftIcon from '@mui/icons-material/ArrowBackIosNew';
import ChevronRightIcon from '@mui/icons-material/ArrowForwardIos';

// type PropsType = {
//   todoData: TodoInitialStateType
// }

const Todolists = () => {
  

  const todoData = useSelector((state: RootState) => {return state.todo.todoData})
  //const todos = todoData?.map((listData, index) => <Todolist index={index} key={listData.id} {...listData} />)
  const [todos, setTodos] = useState(todoData?.map((listData, index) => <Todolist index={index} key={listData.id} {...listData} />))
  const [settingsInitialized, setSettingsInitialized] = useState(false)
  const scrollRef = useRef(null)
  const dispatch = useDispatch()

  
const settingsFilter = (todo:any) => {
    if(todo.props.title) { 
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

  const scrollHandler = (scrollOffset: number) => {
    //@ts-ignore
    scrollRef.current.scrollLeft += scrollOffset
  }


  return (
    <div>
      {todoData ?
      <div>
        <div style={{display: 'flex'}}>
            <Button color={'inherit'} onClick={() => scrollHandler(-250)}
             style={{borderRight: '1px solid lightgray', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}
             >
            <ChevronLeftIcon style={{marginTop: '25vh'}} color={'inherit'}/>
            </Button>

            <div ref={scrollRef} style={{overflowX: 'hidden', scrollBehavior: 'smooth'}}>
              <DragDropContext onDragEnd={dragEndHandler}>
              <Droppable droppableId="tasks" direction="horizontal">
                {(provided) => (
                  <ul className={classes.todosList} {...provided.droppableProps} ref={provided.innerRef}>
                    <Stack className={classes.check} style={{minWidth: 'auto'}} direction={'row'} spacing={1}  justifyContent="flex-start">
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
            
            <Button color={'inherit'} onClick={() => scrollHandler(250)}
             style={{borderLeft: '1px solid lightgray', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}
             >
            <ChevronRightIcon style={{marginTop: '25vh'}} color={'inherit'} />
            </Button>
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