import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateNewTask.css';
import Axios from 'axios';

const CreateNewTask = () => {
    Axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        Axios.get('http://localhost:3001/login').then((response) => {
            if (response.data.loggedIn === false) {
                navigate('/');
            }
        });

        Axios.get('http://localhost:3001/users').then((response) => {
            setUsers(response.data);
            if (response.data.length > 0) {
                setAssignedTo(response.data[0].UserID);
            }
        }).catch((error) => console.error('Error fetching users:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3001/createNewTask', {
            TaskName: taskName,
            Description: description,
            AssignedTo: assignedTo,
            StartDate: startDate,
            EndDate: endDate,
            Status: status
        }).then((response) => {
            console.log(response);
            // Clear the form fields
            setTaskName('');
            setDescription('');
            setAssignedTo(users.length > 0 ? users[0].UserID : ''); // Reset to the first user or an empty string
            setStartDate('');
            setEndDate('');
            setStatus('');
        }).catch((error) => {
            console.error('Error creating new task:', error);
        });
    };
    

    const navigateToTasks = () => {
        navigate('/tasks');
    };

    return (
        <div className="create-task-container">
            <div className="header">
                <h1>Create New Task</h1>
                <button onClick={navigateToTasks} className="back-to-tasks-btn">Back to Tasks</button>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Task Name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label>Assigned To:</label>
                <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                >
                    {users.map((user) => (
                        <option key={user.UserID} value={user.UserID}>
                            {user.FirstName} {user.LastName}
                        </option>
                    ))}
                </select>
                <label>Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
                <button type="submit">Create Task</button>
            </form>
        </div>
    );
};

export default CreateNewTask;
