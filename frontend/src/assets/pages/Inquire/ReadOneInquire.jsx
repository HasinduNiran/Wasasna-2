import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import backgroundImage from '../../images/mee.jpg'; // Ensure this path is correct
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'
const ReadOneInquire = () => {
  const [inquire, setInquire] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8077/Inquire/${id}`)
      .then((response) => {
        setInquire(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching inquiry:', error);
        setError('Error fetching inquiry.');
        setLoading(false);
      });
  }, [id]);

  const handleReply = () => {
    const email = inquire.Email;
    const subject = 'Reply to your inquiry';
    const body = 'Dear Customer,\n\nThank you for reaching out. \n\n\n\n\nBest regards,\nWasana Service Center';

    // Open Gmail with pre-filled fields using mailto
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) return <div className="text-xl font-bold text-center">Loading...</div>;
  if (error) return <div className="text-red-500 font-bold text-center">{error}</div>;
  if (!inquire) return <div className="text-gray-500 text-center">No inquiry found.</div>;

  return (
    <div className=''>
      {/* <Navbar /> */}
      <div
        className="p-4 bg-cover bg-center min-h-screen flex flex-col items-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg hover:shadow-red-800 mt-[10%] p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Show Inquiry
          </h1>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-semibold w-48 text-gray-700">Name:</span>
              <span className="text-gray-600">{inquire.Name}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-48 text-gray-700">Number:</span>
              <span className="text-gray-600">{inquire.Number}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-48 text-gray-700">Email:</span>
              <span className="text-gray-600">{inquire.Email}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-48 text-gray-700">Service Type:</span>
              <span className="text-gray-600">{inquire.ServiceType}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-48 text-gray-700">Vehicle Number:</span>
              <span className="text-gray-600">{inquire.VehicleNumber}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-48 text-gray-700">Message:</span>
              <span className="text-gray-600">{inquire.Message}</span>
            </div>

            {/* Reply Button */}
            <button
              onClick={handleReply}
              className="mt-6 px-4 py-2 bg-green-500 text-white font-bold rounded shadow hover:bg-green-600"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReadOneInquire;
