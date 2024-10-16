import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import backgroundImage from '../../images/mee.jpg'; // Ensure this path is correct
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'
const ReadOnePromotion = () => {
  const { id } = useParams(); // Get the promotion ID from the URL
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await axios.get(`http://localhost:8077/Promotion/${id}`);
        setPromotion(response.data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the promotion!', error);
        setError('Error fetching promotion.');
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [id]);

  if (loading) return <div className="text-xl font-bold text-center">Loading...</div>;
  if (error) return <div className="text-red-500 font-bold text-center">{error}</div>;
  if (!promotion) return <div className="text-gray-500 text-center">No promotion found.</div>;

  return (
    <div className=''><Navbar/>
    <div 
      className="p-4 bg-cover bg-center min-h-screen flex flex-col items-center" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg hover:shadow-red-800 p-6 mt-[10%]">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Promotion Details
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Title:</span>
            <span className="text-gray-600">{promotion.title}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Description:</span>
            <span className="text-gray-600">{promotion.description}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Percentage:</span>
            <span className="text-gray-600">{promotion.Percentage}%</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Discount Price:</span>
            <span className="text-gray-600">Rs {promotion.discount}.00</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Start Date:</span>
            <span className="text-gray-600">{new Date(promotion.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">End Date:</span>
            <span className="text-gray-600">{new Date(promotion.endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default ReadOnePromotion;
