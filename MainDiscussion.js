import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MainDiscussion.css';

const MainDiscussion = () => {
    Axios.defaults.withCredentials = true;
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const navigate = useNavigate();

    useEffect(() => {
        Axios.get('http://localhost:3001/login').then((response)=> {
        if(response.data.loggedIn === false){
            navigate('/');
        }
        });

        const fetchData = async () => {
            try {
                const response = await Axios.get('http://localhost:3001/discussionPosts', {
                    params: { search: searchTerm, sort: sortOrder },
                });
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchData();
    }, [searchTerm, sortOrder]);

    return (
        <div className="main-discussion">
            <h1>Discussion Posts</h1>
            <div className="search-sort-container">
                <input 
                    type="text" 
                    placeholder="Search posts..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="sort-button">
                    Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
                <button onClick={() => navigate('/createPost')} className="create-post-button">Create New Post</button>
            </div>
            {posts.map(post => (
                <div key={post.PostID} className="post" onClick={() => navigate(`/discussionPost/${post.PostID}`)}>
                    <h3>{post.Title}</h3>
                    <p>Posted on: {new Date(post.DatePosted).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
};

export default MainDiscussion;
