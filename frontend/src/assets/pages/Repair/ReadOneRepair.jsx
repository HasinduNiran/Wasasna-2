import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import backgroundImage from '../../images/mee.jpg';
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'
const ReadOneRepair = () => {
  const { id } = useParams(); // Get the repair ID from the URL
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepair = async () => {
      try {
        const response = await axios.get(`http://localhost:8077/Repair/${id}`);
        setRepair(response.data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the repair!', error);
        setError('Error fetching repair.');
        setLoading(false);
      }
    };

    fetchRepair();
  }, [id]);

  if (loading) return <div className="text-xl font-bold text-center">Loading...</div>;
  if (error) return <div className="text-red-500 font-bold text-center">{error}</div>;
  if (!repair) return <div className="text-gray-500 text-center">No repair details found.</div>;

  return (
    <div className=''><Navbar/>
    <div 
      className="p-4 bg-cover bg-center min-h-screen flex flex-col items-center" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg hover:shadow-red-800 p-6 mt-[5%]">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Repair Details
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Name:</span>
            <span className="text-gray-600">{repair.customerName}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Email:</span>
            <span className="text-gray-600">{repair.customerEmail}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Phone:</span>
            <span className="text-gray-600">{repair.customerPhone}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Made:</span>
            <span className="text-gray-600">{repair.vehicleMake}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Model:</span>
            <span className="text-gray-600">{repair.vehicleModel}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Vehicle No:</span>
            <span className="text-gray-600">{repair.vehicleNo}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Description:</span>
            <span className="text-gray-600">{repair.repairDescription}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Status:</span>
            <span className="text-gray-600">{repair.repairStatus}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Insurance Provider:</span>
            <span className="text-gray-600">{repair.Insuranceprovider}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Agent:</span>
            <span className="text-gray-600">{repair.Agent}</span>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default ReadOneRepair;
