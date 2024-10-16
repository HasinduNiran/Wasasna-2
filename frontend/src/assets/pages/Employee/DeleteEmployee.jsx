import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteEmployee = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const handleDelete = () => {
        setLoading(true);
        axios.delete(`http://localhost:8077/Employee/${id}`)
            .then(() => {
                setLoading(false);
                navigate('/Employee'); // Redirect to the list page after deletion
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    const handleCancel = () => {
        navigate('/Employee'); // Navigate back without deleting
    };

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
            {loading ? (
                <p>Deleting employee...</p>
            ) : (
                <>
                    <p>Are you sure you want to delete this employee?</p>
                    <button onClick={handleDelete}>Yes</button>
                    <button onClick={handleCancel}>No</button>
                </>
            )}
        </div>
    );
}

export default DeleteEmployee;
