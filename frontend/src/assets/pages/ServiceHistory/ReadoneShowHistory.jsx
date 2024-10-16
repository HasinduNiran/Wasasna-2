import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../../images/mee.jpg'; // Ensure this path is correct
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'
function ReadoneShowHistory() {
    const { id } = useParams(); // Get the service history ID from the URL
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div className="text-xl font-bold text-center">Loading...</div>;
    if (error) return <div className="text-red-500 font-bold text-center">{error}</div>;
    if (!service) return <div className="text-gray-500 text-center">No service history found.</div>;

    return (
        <div className=''><Navbar/>
        <div 
            className="p-4 bg-cover bg-center min-h-screen flex flex-col items-center" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                    Service History Details
                </h1>
                <div className="space-y-4">
                <div className="flex items-center">
                        <span className="font-semibold w-48 text-gray-700">Vehicle Number:</span>
                        <span className="text-gray-600">{service.Vehicle_Number}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-48 text-gray-700">Customer ID:</span>
                        <span className="text-gray-600">{service.cusID}</span>
                    </div>
                 
                    <div className="flex items-center">
                        <span className="font-semibold w-48 text-gray-700">Allocated Employee:</span>
                        <span className="text-gray-600">{service.Allocated_Employee}</span>
                    </div>

                    <div className="flex items-center">
                        <span className="font-semibold w-48 text-gray-700">Service History:</span>
                        <span className="text-gray-600">{service.Service_History}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-48 text-gray-700">Service Date:</span>
                        <span className="text-gray-600">{new Date(service.Service_Date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-48 text-gray-700">Mileage:</span>
                        <span className="text-gray-600">{service.Milage}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-48 text-gray-700">Package:</span>
                        <span className="text-gray-600">{service.Package || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-48 text-gray-700">Selected Services:</span>
                        <span className="text-gray-600">{service.selectedServices.join(', ')}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-48 text-gray-700">Next Service Date:</span>
                        <span className="text-gray-600">{service.nextService}</span>
                    </div>
                    <div className="mt-4 text-center">
                        <Link to="/serviceHistory" className="text-blue-500 hover:underline">
                            Back to Service History
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </div>
    );
}

export default ReadoneShowHistory;
