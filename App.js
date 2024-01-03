import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import CreateUser from './pages/CreateNewUser';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateTask from './pages/CreateNewTask';
import Tasks from './pages/Tasks';
import EditTask from './pages/EditTask'; 
import MainDiscussion from './pages/MainDiscussion';
import CreatePost from './pages/CreatePost';
import DiscussionPost from './pages/DiscussionPost';
import CreateReply from './pages/CreateReply';

function App() {
  return (
    <Router>
      <RoutesWithNavbar />
    </Router>
  );
}

const RoutesWithNavbar = () => {
  const location = useLocation();
  const showNavBar = location.pathname !== '/';

  return (
    <>
      {showNavBar && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/createUser" element={<CreateUser />} />
        <Route path="/home" element={<Home />} />
        <Route path="/createTask" element={<CreateTask />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/editTask/:taskId" element={<EditTask />} /> 
        <Route path="/discussion" element={<MainDiscussion />} />
        <Route path="/discussionPost/:postId" element={<DiscussionPost />} />
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/addComment/:postId" element={<CreateReply />} />
        {/* Add more routes as needed */}
      </Routes>
    </>
  );
}

export default App;
