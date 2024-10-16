import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function DeleteVehicle() {
    const { id } = useParams(); // Extract the vehicle ID from the URL parameters
    const navigate = useNavigate();
    
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8077/Vehicle/${id}`) // Fetch the vehicle details by ID
            .then((response) => {
                setVehicle(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching the vehicle:', error);
                setError('Error fetching vehicle details.');
                setLoading(false);
            });
    }, [id]);

    const handleDelete = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
        if (confirmDelete) {
            axios
                .delete(`http://localhost:8077/Vehicle/${id}`) // Delete the vehicle by ID
                .then((response) => {
                    console.log('Vehicle deleted:', response.data);
                    navigate('/vehicles'); // Redirect to the vehicle list page after deletion
                })
                .catch((error) => {
                    console.error('Error deleting the vehicle:', error);
                    setError('Error deleting vehicle.');
                });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!vehicle) {
        return <div>No vehicle found.</div>;
    }

    return (
        <div className='p-4'>
            <h1 className='text-3xl my-8'>Delete Vehicle</h1>
            <div className='space-y-4'>
                <div>
                    <strong>Customer ID:</strong> {vehicle.cusID}
                </div>
                <div>
                    <strong>Register Number:</strong> {vehicle.Register_Number}
                </div>
                <div>
                    <strong>Make:</strong> {vehicle.Make}
                </div>
                <div>
                    <strong>Model:</strong> {vehicle.Model}
                </div>
                <div>
                    <strong>Year:</strong> {vehicle.Year}
                </div>
                <div>
                    <strong>Owner:</strong> {vehicle.Owner}
                </div>
                <div className='mt-4'>
                    <button 
                        onClick={handleDelete} 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteVehicle;
