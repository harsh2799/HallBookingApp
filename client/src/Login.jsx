import {React, useState, useContext} from 'react'
import {useCookies} from 'react-cookie'
import axios from 'axios'

const Login = ({updateUser}) => {
    const [username, setUsername] = useState("")
    const [password, setUserPassword] = useState("")
    const [cookies, setCookie] = useCookies(['access_token'])

    if (cookies.access_token) {
        updateUser(cookies.access_token);
    }
    

    const updateUserName = (e) => {
        setUsername(e.target.value);
    }

    const updateUserPassword = (e) => {
        setUserPassword(e.target.value);
    }

    const login = (e) => {
        axios.post("http://localhost:8000/login", {
            username: username,
            password: password
        }).then((response) => {

            let expires = new Date()
            expires.setTime(expires.getTime() + (3000 * 1000))
            setCookie('access_token', response.headers.get('Authorization'), { path: '/',  expires})
            console.log("Cookies Set");
            updateUser(response.headers.get('Authorization'));
            
        }
        , (err) => {
            console.log(err);
            window.location.reload();
        });
        e.preventDefault();
    }


  return (
    <>
        <div>Login</div>
        <input type='text' name="username" id="password" onChange={updateUserName}/>
        <input type="password" name="password" id="password" onChange={updateUserPassword}/>
        <button onClick={login}>Login</button>
    </>
  )
}

export default Login