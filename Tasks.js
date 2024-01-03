import React, { useState, useEffect } from 'react';
import './Tasks.css';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const Tasks = () => {
    Axios.defaults.withCredentials = true;
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrderStartDate, setSortOrderStartDate] = useState('asc');
    const [sortOrderEndDate, setSortOrderEndDate] = useState('asc');
    const navigate = useNavigate();

    useEffect(() => {
        Axios.get('http://localhost:3001/login').then((response)=> {
            if(response.data.loggedIn === false){
                navigate('/');
            }
        });

        Axios.get('http://localhost:3001/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.error('Error fetching tasks:', error));
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleSortByStartDate = () => {
        const sortedTasks = [...tasks].sort((a, b) => {
            return sortOrderStartDate === 'asc'
                ? new Date(a.StartDate) - new Date(b.StartDate)
                : new Date(b.StartDate) - new Date(a.StartDate);
        });
        setTasks(sortedTasks);
        setSortOrderStartDate(sortOrderStartDate === 'asc' ? 'desc' : 'asc');
    };

    const handleSortByEndDate = () => {
        const sortedTasks = [...tasks].sort((a, b) => {
            return sortOrderEndDate === 'asc'
                ? new Date(a.EndDate) - new Date(b.EndDate)
                : new Date(b.EndDate) - new Date(a.EndDate);
        });
        setTasks(sortedTasks);
        setSortOrderEndDate(sortOrderEndDate === 'asc' ? 'desc' : 'asc');
    };

    const handleDelete = (taskId) => {
        Axios.delete(`http://localhost:3001/tasks/${taskId}`)
            .then(response => {
                setTasks(tasks.filter(task => task.TaskID !== taskId));
            })
            .catch(error => console.error('Error deleting task:', error));
    };

    const handleEdit = (taskId) => {
        navigate(`/editTask/${taskId}`);
    };

    const filteredTasks = tasks.filter(task =>
        task.TaskName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="tasks-container">
            <h1>Tasks</h1>
            <div className="search-and-sort-bar">
                <input
                    type="text"
                    placeholder="Search task names"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSortByStartDate}>Sort by Start Date</button>
                <button onClick={handleSortByEndDate}>Sort by End Date</button>
                <button onClick={() => navigate('/createTask')}>Create New Task</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Task ID</th>
                        <th>Task Name</th>
                        <th className='description'>Description</th>
                        <th>Assigned To</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th className='status'>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.map((task, index) => (
                        <tr key={index}>
                            <td>{task.TaskID}</td>
                            <td>{task.TaskName}</td>
                            <td className='description'>{task.Description}</td>
                            <td>{task.assignedUser}</td>
                            <td>{formatDate(task.StartDate)}</td>
                            <td>{formatDate(task.EndDate)}</td>
                            <td className='status'>{task.Status}</td>
                            <td>
                                <button onClick={() => handleEdit(task.TaskID)}>Edit</button>
                                <button onClick={() => handleDelete(task.TaskID)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tasks;
