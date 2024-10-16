import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import backgroundImage from '../../images/mee.jpg'; // Ensure this path is correct
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'
const ReadOneVacancy = () => {
  // State initialization
  const [vacancy, setVacancy] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const { id } = useParams(); 

  // Fetch the vacancy data when the component mounts or when 'id' changes
  useEffect(() => {
    setLoading(true); 
    axios
      .get(`http://localhost:8077/vacancy/${id}`) 
      .then((response) => {
        setVacancy(response.data); 
        setLoading(false); 
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); 
      });
  }, [id]);

  // If the data is still loading, show a spinner
  if (loading) {
    return <Spinner />;
  }

  // If the vacancy data hasn't loaded yet, show a loading message
  if (!vacancy) {
    return <div className="text-gray-500 text-center">No vacancy found.</div>;
  }

  return (
    <div className=''><Navbar/>
    <div 
      className="p-4 bg-cover bg-center min-h-screen flex flex-col items-center" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <BackButton destination={`/vacancy/`} />
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 mt-[10%]">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Vacancy Details
        </h1>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Job ID:</span>
            <span className="text-gray-600">{vacancy._id}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Name:</span>
            <span className="text-gray-600">{vacancy.Name}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold w-48 text-gray-700">Job Description:</span>
            <span className="text-gray-600">{vacancy.Description}</span>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default ReadOneVacancy;
