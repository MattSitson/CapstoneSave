import React, {useState, useEffect} from 'react';
import './createUser.css';
import Axios from 'axios'
import {useNavigate} from 'react-router-dom';


function CreateNewUser(){
    Axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    //Use state hooks to manage input fields
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('employee')

    useEffect(() => {

        Axios.get('http://localhost:3001/login').then((response)=> {
            if(response.data.loggedIn === false){
                navigate('/');
            }
        });
    
    }, []);

    const create = () => {
        Axios.post('http://localhost:3001/createNewUser', {
        Username: username,
        Password: password,
        FirstName: firstName,
        LastName: lastName,
        Role: role
    }).then((response) => {
        console.log(response);
        // Clear the state, which will also clear the input fields
        setUserName('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setRole('employee'); 
    }).catch((error) => {
        console.error('Error creating new user:', error);
    });
    };

    return(
        <div className='form'>
            <h1>Create User Account</h1>
            
            <label>Username: </label>
            <input
                type="text"
                name="username"
                value={username} // Controlled component
                onChange={(e) => setUserName(e.target.value)}
            />

            <label>Password: </label>
            <input
                type="text"
                name="password"
                value={password} // Controlled component
                onChange={(e) => setPassword(e.target.value)}
            />

            <label>First Name: </label>
            <input
                type="text"
                name="firstName"
                value={firstName} // Controlled component
                onChange={(e) => setFirstName(e.target.value)}
            />
            
            <label>Last Name: </label>
            <input
                type="text"
                name="lastName"
                value={lastName} // Controlled component
                onChange={(e) => setLastName(e.target.value)}
            />
            
            <label>Role: </label>
            <select 
                name="role" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
            </select>

            <button onClick={create}>Create</button>
        </div>
    );
}

export default CreateNewUser;