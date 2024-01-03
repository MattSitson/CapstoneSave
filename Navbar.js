import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'; // Import Axios for making HTTP requests

function Navbar() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        //Implement logout logic
        Axios.post('http://localhost:3001/logout')
            .then(() => {
                //Clears cookies then navigates back to login screen
                navigate('/');
            })
            .catch(error => {
                console.error('Logout failed:', error);
            });
    };

    return (
        <nav>
            <ul>
                <li onClick={() => handleNavigation('/home')}>Home</li>
                <li onClick={() => handleNavigation('/createUser')}>Create New User</li>
                <li onClick={() => handleNavigation('/tasks')}>Tasks</li>
                <li onClick={() => handleNavigation('/discussion')}>Discussion Forum</li>
                <li onClick={handleLogout} className="logout-button">Logout</li>
            </ul>
        </nav>
    );
}

export default Navbar;
