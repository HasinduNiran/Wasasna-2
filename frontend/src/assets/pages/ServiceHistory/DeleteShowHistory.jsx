import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function DeleteShowHistory() {
    const { id } = useParams(); // Get the service history ID from the URL
    const navigate = useNavigate(); // Navigation hook to redirect after deletion

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(`http://localhost:8077/ServiceHistory/${id}`);
                setService(response.data);
            } catch (err) {
                console.error('Error fetching service history:', err);
                setError('Error fetching service history.');
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this service history?')) {
            try {
                await axios.delete(`http://localhost:8077/ServiceHistory/${id}`);
                navigate('/serviceHistory'); // Redirect to service history list page
            } catch (err) {
                console.error('Error deleting service history:', err);
                setDeleteError('Error deleting service history.');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!service) return <div>No service history found.</div>;

    return (
        <div className='p-4'>
            <h1 className='text-3xl my-8'>Delete Service History</h1>
            <div className='space-y-4'>
                <div>
                    <span className='font-semibold'>Customer ID:</span> {service.cusID}
                </div>
                <div>
                    <span className='font-semibold'>Customer Name:</span> {service.Customer_Name}
                </div>
                <div>
                    <span className='font-semibold'>Customer Email:</span> {service.Customer_Email}
                </div>
                <div>
                    <span className='font-semibold'>Allocated Employee:</span> {service.Allocated_Employee}
                </div>
                <div>
                    <span className='font-semibold'>Vehicle Number:</span> {service.Vehicle_Number}
                </div>
                <div>
                    <span className='font-semibold'>Service History:</span> {service.Service_History}
                </div>
                <div>
                    <span className='font-semibold'>Service Date:</span> {service.Service_Date}
                </div>
                <div>
                    <span className='font-semibold'>Mileage:</span> {service.Milage}
                </div>
                <div>
                    <span className='font-semibold'>Package:</span> {service.Package || 'N/A'}
                </div>
                <div>
                    <span className='font-semibold'>Selected Services:</span> {service.selectedServices.join(', ')}
                </div>
                <div>
                    <span className='font-semibold'>Booking ID:</span> {service.Booking_Id}
                </div>
                <div>
                    <span className='font-semibold'>Next Service Date:</span> {service.nextService}
                </div>

                {deleteError && <div className="text-red-500">{deleteError}</div>}

                <div className='mt-4 flex justify-between'>
                    <button
                        onClick={handleDelete}
                        className='px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600'
                    >
                        Confirm Delete
                    </button>
                    <button
                        onClick={() => navigate('/serviceHistory')}
                        className='px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600'
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteShowHistory;
