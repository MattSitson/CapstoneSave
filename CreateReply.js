import React, { useState } from 'react';
import Axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './CreateReply.css'; // Make sure to create this CSS file

const CreateReply = () => {
    Axios.defaults.withCredentials = true;
    const { postId } = useParams();
    const [reply, setReply] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post(`http://localhost:3001/addComment/${postId}`, { reply }) // Adjust this URL to your backend endpoint
            .then(() => {
                setReply('');
                navigate(`/discussionPost/${postId}`);
            })
            .catch(error => console.error('Error creating reply:', error));
    };

    return (
        <div className="create-reply-container">
            <button onClick={() => navigate(`/discussionPost/${postId}`)} className="back-button">Back to Post</button>
            <h1>Create Comment</h1>
            <form onSubmit={handleSubmit} className="reply-form">
                <label>
                    Comment:
                </label>
                <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Your reply"></textarea>
                <button type="submit" className="submit-button">Create Comment</button>
            </form>
        </div>
    );
};

export default CreateReply;
