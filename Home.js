import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './Home.css'; 
 
const Home = () => {
  Axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:3001/login').then((response)=> {
      if(response.data.loggedIn === false){
          navigate('/');
      }
      });

    Axios.get('http://localhost:3001/mytasks', { withCredentials: true })
        .then(response => {
            setTasks(response.data);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
  }, []);

  const calendarEvents = tasks.map(task => ({
      title: task.TaskName,
      start: task.StartDate,
      end: task.EndDate
  }));

  const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="home-page">
        <div className="tasks-section">
            <h2>My Tasks</h2>
            <table>
                <thead>
                    <tr>
                        <th>Task Name</th>
                        <th>Description</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.TaskID}>
                            <td>{task.TaskName}</td>
                            <td>{task.Description}</td>
                            <td>{formatDate(task.StartDate)}</td>
                            <td>{formatDate(task.EndDate)}</td>
                            <td>{task.Status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="calendar-section">
            <h2>Calendar</h2>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
            />
        </div>
    </div>
  );
};

export default Home;
