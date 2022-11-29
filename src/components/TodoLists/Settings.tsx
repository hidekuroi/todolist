import { Button, Dialog, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { createTask, deleteTodo, editTask, getTasks, tasksReorder, TodoType } from '../../redux/todoReducer';
import Task from './Todolist/Task';
import { UpdateTaskModel } from './Todolist/Task';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch } from 'react-redux';

type SettingsProps = {
    settingsList: TodoType
    open: boolean

    handleClose: () => void
    taskEdit: (todolistId: string, taskId: string, updateTaskModel: UpdateTaskModel) => void
}

const Settings = (props: SettingsProps) => {
    const [inputValue, setInputValue] = useState('')
    const [disabled, setDisabled] = useState(false)
    const dispatch = useDispatch()

    const submitHandler = (e: any) => {
        e.preventDefault()
        e.stopPropagation()

        setDisabled(true)
        dispatch(createTask(`#${inputValue}`, props.settingsList.id))

        //temporary settimout

        setTimeout(() => {
            let lastTaskId = props.settingsList?.tasks[props.settingsList?.tasks?.length - 1]?.id

            dispatch(tasksReorder(props.settingsList.id, props.settingsList.tasks[0].id, lastTaskId))
            setTimeout(() => {
                setDisabled(false)
                setInputValue('')
            }, 500);
            
        }, 1000);
    }

    const resetSettings = () => {
        setDisabled(true)
        dispatch(deleteTodo(props.settingsList.id))

        setTimeout(() => {
            setDisabled(false)
        }, 2300);
    }

    useEffect(() => {
      dispatch(getTasks(props.settingsList.id))
    }, [props.settingsList])

    // useEffect(() => {
    //     highestOrder = props.settingsList?.tasks[props.settingsList.tasks.length - 1]?.order + 1
    // }, [props.settingsList])

  return (
    <div>
        <Dialog
              open={props.open}
              onClose={props.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle sx={{ m: 0, p: 2 }}>
                  <>{'Settings'}</>
                  <IconButton
                    aria-label="close"
                    onClick={props.handleClose}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
              </DialogTitle>
              <DialogContent style={{paddingTop: '15px', borderTop: '1px solid lightgray'}}>
                  {/* {todoData?.map((list, index) => {
                    if(list.title === 'SETTINGS') return <><Todolist addedDate={list.addedDate} id={list.id} index={index} order={list.order} tasks={list.tasks} title={list.title} totalCount={list.totalCount} key={list.id} /></>
                  })} */}
                  <div>
                    <p style={{fontStyle: 'italic', color: 'gray'}}>{`Norm settings budut later rebyta guys`}</p>
                    <p style={{fontStyle: 'italic', color: 'gray'}}>{`(Вообще всё это можно настроить и без использования этой странички. Она существует для дальнейшего улучшения и отображения того, каким макаром сделаны настройки на страничке главной.)`}</p>
                    <p style={{fontWeight: 'bolder', marginTop: '10px'}}>{`Каждый последующий цвет, находящийся снизу, перекрывает по приоритету тот, что сверху.`}</p>
                  </div>
                  <div style={{marginTop: '15px'}}>
                    <p>Добавить новый цвет (HEX<Tooltip arrow disableFocusListener placement='top' title={'В любом RGB колор пикере обычно есть перевод значения в HEX.'}><span style={{color: 'purple', cursor: 'pointer'}}><sup>[?]</sup></span></Tooltip>):</p>
                    <form onSubmit={submitHandler}>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Color</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                inputProps={{maxLength: 6}}
                                disabled={disabled}
                                endAdornment={<IconButton disabled={disabled} onClick={submitHandler}><SendIcon /></IconButton>}
                                placeholder={'000000'}
                                value={inputValue}
                                onChange={(e: any) => setInputValue(e.currentTarget.value.toUpperCase())}
                                startAdornment={<InputAdornment position="start">#</InputAdornment>}
                                label="Amount"
                            />
                        </FormControl>
                    </form>
                  </div>
                  <div style={{marginTop: '10px'}}>
                    <Button disabled={disabled} onClick={resetSettings} variant='outlined' color='error'>Сбросить настройки и цвета</Button>
                    <p style={{fontStyle: 'italic', color: 'gray'}}>Тыкай если уверен, подтверждение не вылезает.</p>
                  </div>

                  <Divider style={{marginBottom: '15px', marginTop: '15px'}} />
                  
                  {props.settingsList?.tasks?.map((task) => {return <Task darkMode={false} taskData={task} taskEdit={props.taskEdit} taskId={task.id} title={task.title} todoListId={props.settingsList.id} />})}
                  
              </DialogContent>
            </Dialog>
    </div>
  )
}

export default Settings