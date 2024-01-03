import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CreateNewTask.css'; // Reuse the CSS from CreateNewTask
import Axios from 'axios';

const EditTask = () => {
    Axios.defaults.withCredentials = true;
    const { taskId } = useParams();
    const navigate = useNavigate();

    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        Axios.get('http://localhost:3001/login').then((response)=> {
        if(response.data.loggedIn === false){
            navigate('/');
        }
        });

        Axios.get(`http://localhost:3001/tasks/${taskId}`)
            .then(response => {
                const taskData = response.data;
                setTaskName(taskData.TaskName);
                setDescription(taskData.Description);
                setAssignedTo(taskData.AssignedTo);
                setStartDate(taskData.StartDate.split('T')[0]);
                setEndDate(taskData.EndDate.split('T')[0]);
                setStatus(taskData.Status);
            })
            .catch(error => console.error('Error fetching task:', error));

        Axios.get('http://localhost:3001/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    }, [taskId, navigate]);

    const handleSave = (e) => {
        e.preventDefault();
        Axios.put(`http://localhost:3001/tasks/${taskId}`, {
            TaskName: taskName,
            Description: description,
            AssignedTo: assignedTo,
            StartDate: startDate,
            EndDate: endDate,
            Status: status
        }).then(response => {
            console.log('Task updated successfully');
            navigate('/tasks');
        }).catch(error => {
            console.error('Error updating task:', error);
        });
    };

    const navigateToTasks = () => {
        navigate('/tasks');
    };

    return (
        <div className="create-task-container">
            <div className="header">
                <h1>Edit Task</h1>
                <button onClick={navigateToTasks} className="back-to-tasks-btn">Back to Tasks</button>
            </div>
            <form onSubmit={handleSave}>
                <input
                    type="text"
                    placeholder="Task Name"
                    value={taskName}
                    onChange={e => setTaskName(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <label>Assigned To: </label>
                <select
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value)}
                >
                    {users.map(user => (
                        <option key={user.UserID} value={user.UserID}>
                            {user.FirstName} {user.LastName}
                        </option>
                    ))}
                </select>
                <label>Start Date: </label>
                <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                />
                <label>End Date: </label>
                <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Status"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                />
                <button type="submit">Save Task</button>
            </form>
        </div>
    );
};

export default EditTask;
