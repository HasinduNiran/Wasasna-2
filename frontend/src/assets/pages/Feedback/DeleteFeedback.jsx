import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function DeleteFeedback() {
    const { id } = useParams(); // Get the feedback ID from the route parameters
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8077/feedback/${id}`) // Adjust the API endpoint as necessary
            .then((response) => {
                setFeedback(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching feedback:', error);
                setError('Error fetching feedback.');
                setLoading(false);
            });
    }, [id]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            axios
                .delete(`http://localhost:8077/feedback/${id}`) // Adjust the API endpoint as necessary
                .then(() => {
                    alert('Feedback deleted successfully.');
                    navigate('/feedbacks'); // Redirect to the feedback list or another page after deletion
                })
                .catch((error) => {
                    console.error('Error deleting feedback:', error);
                    setError('Error deleting feedback.');
                });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    if (!feedback) return <div>No feedback found.</div>;

    return (
        <div className="container">
    <style>{`
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        
        p {
            font-size: 18px;
            margin-bottom: 20px;
        }
        
        button {
            background-color: #f44336;
            color: white;
            padding: 10px 20px;
            margin: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            font-size: 16px;
        }
        
        button:hover {
            background-color: #d32f2f;
        }
        
        .cancel-button {
            background-color: #9e9e9e;
        }
        
        .cancel-button:hover {
            background-color: #757575;
        }
    `}</style>
            <h1 className='text-3xl my-8'>Delete Feedback</h1>
            <div className='space-y-4'>
                <div>
                    <strong>Customer ID:</strong> {feedback.cusID}
                </div>
                <div>
                    <strong>Name:</strong> {feedback.name}
                </div>
                <div>
                    <strong>Email:</strong> {feedback.email}
                </div>
                <div>
                    <strong>Phone Number:</strong> {feedback.phone_number}
                </div>
                <div>
                    <strong>Employee:</strong> {feedback.employee}
                </div>
                <div>
                    <strong>Message:</strong> {feedback.message}
                </div>
                <div>
                    <strong>Star Rating:</strong> {feedback.star_rating}
                </div>
                <div>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                        Delete Feedback
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteFeedback;
