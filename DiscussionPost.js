import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './DiscussionPost.css';

const DiscussionPost = () => {
    Axios.defaults.withCredentials = true;
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        Axios.get('http://localhost:3001/login').then((response) => {
            if (response.data.loggedIn === false) {
                navigate('/');
            } else {
                setCurrentUser(response.data.user[0]);
            }
        });

        Axios.get(`http://localhost:3001/discussionPost/${postId}`)
            .then(response => {
                setPost(response.data.post);
                setComments(response.data.comments);
            })
            .catch(error => console.error('Error fetching post and comments:', error));
    }, [postId, navigate]);

    const handleReplyClick = () => {
        navigate(`/addComment/${postId}`);
    };

    const handleBackToDiscussions = () => {
        navigate('/discussion');
    };

    const handleEditPost = () => {
        // Navigate to edit post page/component
        // navigate(`/editPost/${postId}`);
    };

    const handleDeletePost = () => {
        // Implement delete functionality
        // Axios.delete(`http://localhost:3001/deletePost/${postId}`).then(...);
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div className="discussion-post">
            <button onClick={handleBackToDiscussions} className="back-to-discussions-button">Back to Discussion Forum</button>
            <div className="main-post">
                <h1>{post.Title}</h1>
                <p className="post-meta">Posted by {post.Author} on {new Date(post.DatePosted).toLocaleDateString()}</p>
                <p className="post-content">{post.Content}</p>
                <div className="action-buttons">
                    {currentUser && currentUser.UserID === post.UserID && (
                        <div className="post-actions">
                            <button onClick={handleEditPost} className="edit-button">Edit</button>
                            <button onClick={handleDeletePost} className="delete-button">Delete</button>
                        </div>
                    )}
                    <button onClick={handleReplyClick} className="reply-button">Reply</button>
                </div>
            </div>
            <div className="comments">
                {comments.map(comment => (
                    <div key={comment.CommentID} className="comment">
                        <p className="comment-meta">Comment by {comment.Author} on {new Date(comment.DatePosted).toLocaleDateString()}</p>
                        <p className="comment-content">{comment.Content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscussionPost;
