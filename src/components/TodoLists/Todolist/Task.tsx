import { IconButton, Input, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SendIcon from '@mui/icons-material/Send';
import React, { useState, useEffect } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import classes from './Task.module.css'
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

export type UpdateTaskModel = {
    title: string,
    description: string,
    completed: boolean,
    status: number,
    priority: number,
    startDate: string,
    deadline: string
}

type PropsType = {
    title: string,
    todoListId: string,
    taskId: string,
    taskData: UpdateTaskModel,
    darkMode: boolean,
    tileColor?: string,

    taskDeleted?: (todoListId: string, taskId: string) => void,
    taskEdit: (todolistId: string, taskId: string, updateTaskModel: UpdateTaskModel) => void
}

const Task = (props: PropsType) => {
    const [isCompleted, setIsCompleted] = useState(props.taskData.status)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [editMode, setEditMode] = useState(false)
    const [taskTitle, setTaskTitle] = useState(props.title)

    const appTileColor = useSelector((state: RootState) => {return state.app.tileColor})

    const [tileColor, setTileColor] = useState(props.tileColor ? props.tileColor : appTileColor)

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if(props.tileColor)setTileColor(props.tileColor)
    }, [props.tileColor])

    const completeHandler = () => {
        if(!isCompleted) {
            setIsCompleted(1)
        const updateTaskModel: UpdateTaskModel = {
            title: props.taskData.title,
            description: props.taskData.description,
            completed: props.taskData.completed,
            deadline: props.taskData.deadline,
            priority: props.taskData.priority,
            startDate: props.taskData.startDate,
            status: 1
        }
        setTimeout(() => {
            props.taskEdit(props.todoListId, props.taskId, updateTaskModel)
        }, 300);
    }
        if(isCompleted) {
            setIsCompleted(0)
            const updateTaskModel: UpdateTaskModel = {
                title: props.taskData.title,
                description: props.taskData.description,
                completed: props.taskData.completed,
                deadline: props.taskData.deadline,
                priority: props.taskData.priority,
                startDate: props.taskData.startDate,
                status: 0
            }
            setTimeout(() => {
                props.taskEdit(props.todoListId, props.taskId, updateTaskModel)
            }, 300);
        }
    }

    const submitRenameHandler = (e: any) => {
        e.preventDefault()
        setEditMode(false)
        if(taskTitle !== props.title && taskTitle !== '/*settings*/') {
        const updateTaskModel: UpdateTaskModel = {
            title: taskTitle,
            description: props.taskData.description,
            completed: props.taskData.completed,
            deadline: props.taskData.deadline,
            priority: props.taskData.priority,
            startDate: props.taskData.startDate,
            status: props.taskData.status,
        }
        props.taskEdit(props.todoListId, props.taskId, updateTaskModel)
        }
    }

    const inputHandler = (e: any) => {
        setTaskTitle(e.target.value)
    }

    const handleRename = () => {
        setAnchorEl(null)
        setEditMode(true)
    }

    const handleDelete = () => {
        setAnchorEl(null)
        if(props.taskDeleted)props.taskDeleted(props.todoListId, props.taskId)
    }

    return (
    <div>
        <Stack className={`${classes.task} ${isCompleted && classes.taskCompleted}`} direction="row" spacing={1}
        sx={{border: `2px solid ${tileColor}`, backgroundColor: `${isCompleted ? tileColor : 'none'}`, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <div>
        {props.taskDeleted && <IconButton color={'inherit'}
            id="task-button"
            aria-controls={open ? 'task-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
        >
            <MoreVertIcon />
        </IconButton>}
                <Menu
                    id="task-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'task-button',
                    }}
                >
                    <MenuItem onClick={handleRename}><DriveFileRenameOutlineIcon /> Rename</MenuItem>
                    <MenuItem onClick={handleDelete}><DeleteIcon /> Delete task</MenuItem>
                </Menu>
            </div>
            <div>
                {!editMode ? <span>
                    <Stack direction="row" spacing={2}>
                        <Typography sx={{color: `${isCompleted ? (tileColor === 'white' ? 'black' : 'none'): tileColor}`, filter: props.title.startsWith('*') ? 'brightness(150%)' : 'none', fontWeight: props.title.startsWith('*') ? '900' : '300'}} className={`${classes.taskText} ${isCompleted && classes.taskCompletedText}`} variant="subtitle1" gutterBottom component="div">
                            {props.title} {props.taskData.description}
                        </Typography>
                    {!isCompleted ? <IconButton>
                        <CheckBoxOutlineBlankIcon htmlColor={tileColor} onClick={completeHandler}/>
                    </IconButton>
                    : <IconButton>
                        <CheckBoxIcon style={{transition: '0.2s'}} htmlColor={tileColor === 'white' ? 'black' : 'white'} onClick={completeHandler}/>
                    </IconButton>
                    }
                    </Stack></span>
                : 
                <div style={{color: 'inherit'}}>
                    <form onSubmit={submitRenameHandler} style={{display: 'flex', alignItems: 'center'}}>
                        <TextField multiline variant='standard' sx={{color: 'red'}} color='primary'  id="taskRename" inputProps={{ maxLength: 100, style: {color:'gray'}}} className={classes.inputText} value={taskTitle} autoFocus={true} onChange={inputHandler}/>
                        <IconButton onClick={submitRenameHandler}>
                            <SendIcon htmlColor={isCompleted ? 'white' : tileColor}/>
                        </IconButton>
                    </form>
                </div>
                }
            </div>
        </Stack>
    </div>
  )
}

export default Task