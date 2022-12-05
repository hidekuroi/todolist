import { Button, Input, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setApikey } from '../../api/APIKey'
import { login } from '../../redux/authReducer'

const Login = () => {
    const [emailText, setLoginText] = useState('')
    const [passwordText, setPasswordText] = useState('')
    const [captchaText, setCaptchaText] = useState('')

    const dispatch = useDispatch()

    const emailHandler = (e: any) => {
        let newText = e.target.value
        setLoginText(newText)
    }

    const passwordHandler = (e: any) => {
        let newText = e.target.value
        setPasswordText(newText)
    }

    const captchaHandler = (e: any) => {
        let newText = e.target.value
        setCaptchaText(newText)
    }

    const submitHandler = (e: any) => {
        e.preventDefault()
        let form = {
            email: e.target[0].value,
            password: e.target[2].value
        }
        dispatch(login(form))
    }

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{margin: 'auto', marginTop: '10vh'}}>
            <h1>Sign In:</h1>
            <div>
                <form action="" onSubmit={submitHandler}>
                    <div><TextField color="secondary" type='email' placeholder="Email" value={emailText} onChange={emailHandler}></TextField></div>
                    <div><TextField color="secondary" type='password' placeholder="Password" value={passwordText} onChange={passwordHandler}></TextField></div>
                    <br />
                    <div><Button variant="contained" color="secondary" type="submit">Sign In</Button></div>

                    <div style={{marginTop: '15px', fontStyle: 'italic', color: 'gray'}}>
                        <p>{'Братанчи, зарегаться если чё тут: '}</p>
                        <p>{'https://social-network.samuraijs.com/signUp'}</p>
                    </div>
                    {/* <div><Input></Input></div>  value={inputText} onChange={inputHandler}*/}
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login