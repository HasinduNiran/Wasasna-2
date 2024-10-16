import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../components/Spinner'; // Ensure you have this component
import BackButton from '../../components/BackButton'; // Ensure you have this component
import backgroundImage from '../../images/mee.jpg'; // Update path if needed
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/Footer';

function ReadOneVehicle() {
    const { id: Register_Number } = useParams();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState(null);
    const [serviceHistory, setServiceHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vehicleError, setVehicleError] = useState(null);
    const [serviceHistoryError, setServiceHistoryError] = useState(null);

    useEffect(() => {
        const fetchVehicleData = async () => {
            try {
                const vehicleResponse = await axios.get(`http://localhost:8077/Vehicle/${Register_Number}`);
                setVehicle(vehicleResponse.data);
            } catch (error) {
                console.error('Error fetching the vehicle:', error);
                setVehicleError('Error fetching vehicle details.');
            }
        };

        const fetchServiceHistory = async () => {
            try {
                const serviceHistoryResponse = await axios.get(`http://localhost:8077/ServiceHistory/${Register_Number}`);
                setServiceHistory(serviceHistoryResponse.data || []);
            } catch (error) {
                console.error('Error fetching the service history:', error);
                setServiceHistoryError('Error fetching service history.');
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await fetchVehicleData();
            await fetchServiceHistory();
            setLoading(false);
        };

        fetchData();
    }, [Register_Number]);

    if (loading) {
        return <Spinner />;
    }

    if (vehicleError) {
        return <div className='p-4 text-center text-red-500'>{vehicleError}</div>;
    }

    if (!vehicle) {
        return <div className='p-4 text-center'>No vehicle found.</div>;
    }

    return (
        <div className=''>
            <Navbar/>
            <div
                className="p-4 min-h-screen flex flex-col items-center bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <BackButton destination={`/vehicles/`} />
                <div className="w-full h-full flex justify-center items-center mb-6">
                    <h1 className="text-4xl font-bold text-white">Vehicle Details</h1>
                </div>
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg hover:shadow-lg">
                    {vehicle.image && (
                        <div className="relative">
                            <img
                                src={vehicle.image}
                                alt={vehicle.Register_Number}
                                className="w-full h-48 object-cover mx-auto"
                            />
                        </div>
                    )}
                    <div className="px-6 py-6 bg-white rounded-lg shadow-lg space-y-4">
                        <div className="text-2xl font-bold text-gray-800 border-b pb-2 border-gray-200">Vehicle Details</div>
                        <div className="flex flex-col space-y-2">
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                                <span>Register Number:</span>
                                <span className="font-medium text-gray-900">{vehicle.Register_Number}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                                <span>Make:</span>
                                <span className="font-medium text-gray-900">{vehicle.Make}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                                <span>Model:</span>
                                <span className="font-medium text-gray-900">{vehicle.Model}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                                <span>Year:</span>
                                <span className="font-medium text-gray-900">{vehicle.Year}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                                <span>Engine Details:</span>
                                <span className="font-medium text-gray-900">{vehicle.Engine_Details}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                                <span>Transmission Details:</span>
                                <span className="font-medium text-gray-900">{vehicle.Transmission_Details}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                                <span>Vehicle Color:</span>
                                <span className="font-medium text-gray-900">{vehicle.Vehicle_Color}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                                <span>Vehicle Features:</span>
                                <span className="font-medium text-gray-900">
                                    <ul className="list-disc pl-6">
                                        {vehicle.Vehicle_Features.map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))}
                                    </ul>
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                                <span>Condition Assessment:</span>
                                <span className="font-medium text-gray-900">{vehicle.Condition_Assessment}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                                <span>Owner:</span>
                                <span className="font-medium text-gray-900">{vehicle.Owner}</span>
                            </div>
                        </div>
                    </div>

                    {/* Conditionally render Service History section */}
                    {serviceHistoryError ? (
                        <div className='mt-4 text-red-500'>{serviceHistoryError}</div>
                    ) : (
                        serviceHistory.length > 0 && (
                            <>
                                <h2 className='text-2xl font-bold text-gray-800 border-b pb-2 border-gray-200 my-6'>Service History</h2>
                                <table className='min-w-full bg-white'>
                                    <thead>
                                        <tr>
                                            <th className='py-2 px-4 border-b border-gray-200'>Service Date</th>
                                            <th className='py-2 px-4 border-b border-gray-200'>Service History</th>
                                            <th className='py-2 px-4 border-b border-gray-200'>Service Employee</th>
                                            <th className='py-2 px-4 border-b border-gray-200'>Service Customer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {serviceHistory.map((service, index) => (
                                            <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
                                                <td className='py-2 px-4 border-b border-gray-200'>{service.Service_Date}</td>
                                                <td className='py-2 px-4 border-b border-gray-200'>{service.Service_History}</td>
                                                <td className='py-2 px-4 border-b border-gray-200'>{service.Allocated_Employee}</td>
                                                <td className='py-2 px-4 border-b border-gray-200'>{service.Customer_Name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )
                    )}

                    <div className='mt-4 flex gap-2'>
                        <Link 
                            to={`/vehicles/edit/${vehicle._id}`} 
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Edit
                        </Link>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default ReadOneVehicle;
