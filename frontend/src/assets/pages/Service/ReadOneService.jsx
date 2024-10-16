import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import backgroundImage from '../../images/mee.jpg';
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'
import BackButton from '../../components/BackButton'; // Assuming you have a BackButton component

const ReadOneService = () => {
  const [service, setService] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8077/Service/${id}`)
      .then((response) => {
        setService(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Spinner />; 
  }

  return (
    <div className=''>
      <Navbar />
      <div
        className="p-4 min-h-screen flex flex-col items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }} 
      >
               <div className="mar"><BackButton destination={`/service`}/></div>

        <div className="w-full h-full flex justify-center items-center mb-6">

        </div>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg hover:shadow-red-800">
          <div className="px-6 py-6 bg-white rounded-lg shadow-lg space-y-4">
            <div className="text-2xl font-bold text-gray-800 border-b pb-2 border-gray-200">Service Details</div>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                <span>Service Name:</span>
                <span className="font-medium text-gray-900">{service.Servicename}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                <span>Price:</span>
                <span className="font-medium text-gray-900">{service.Price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ReadOneService;
