import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import './LoginPage.css'; 
import Axios from 'axios'

function LoginPage() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const [loginStatus, setLoginStatus] = useState('');
    const navigate = useNavigate();
    Axios.defaults.withCredentials = true;

    const login = () => {
        Axios.post('http://localhost:3001/login', {
        Username: username,
        Password: password,
        }).then((response) => {
            
            if(response.data.message){
                setLoginStatus(response.data.message)
            }else{
                navigate('/home')
            }    
            
        }).catch((error) => {
        console.error('Error getting user:', error);
        });
        
    };

    useEffect(()=>{
        Axios.get('http://localhost:3001/login').then((response)=> {
            if(response.data.loggedIn == true){
                navigate('/home');
            }
        });
    }, []);

    return (
    <div className="login-page">
        <div className="login-form">
        <div className='Form'>
        <h2>Log In</h2>
        
            <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            />
            <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <p className='loginStatus'>{loginStatus}</p>
            <button onClick={login}>Log In</button>
        </div>    
        </div>
    </div>
);
}

export default LoginPage;
