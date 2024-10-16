import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import backgroundImage from '../../images/mee.jpg'; // Ensure this path is correct
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'
const ReadOneEmployee = () => {
  const { id } = useParams(); // Get the employee ID from the URL
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typewriterText, setTypewriterText] = useState(""); // State for typewriter effect

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:8077/Employee/${id}`);
        setEmployee(response.data);
      } catch (error) {
        console.error("There was an error fetching the employee!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  useEffect(() => {
    const words = ["Employee Details"];
    let i = 0;
    let j = 0;
    let currentWord = "";
    let isDeleting = false;

    function type() {
      currentWord = words[i];
      if (isDeleting) {
        setTypewriterText(currentWord.substring(0, j - 1));
        j--;
        if (j === 0) {
          isDeleting = false;
          i++;
          if (i === words.length) {
            i = 0;
          }
        }
      } else {
        setTypewriterText(currentWord.substring(0, j + 1));
        j++;
        if (j === currentWord.length) {
          isDeleting = true;
        }
      }
      setTimeout(type, 300);
    }

    type();
  }, []);

  if (loading) {
    return <p>Loading employee details...</p>;
  }

  if (!employee) {
    return <p>Employee not found.</p>;
  }

  return (
    <div className=''><Navbar/>
    <div 
      className="p-4 bg-cover bg-center min-h-screen flex flex-col items-center" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg hover:shadow-red-800 mt-[10%] p-6">
        <div className="text-2xl font-bold text-gray-800 border-b pb-2 border-gray-200 mb-4">
          {typewriterText}
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
            <span className="font-bold">Emp ID:</span>
            <span className="text-gray-900">{employee.EmpID}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
            <span className="font-bold">Employee Name:</span>
            <span className="text-gray-900">{employee.employeeName}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
            <span className="font-bold">DOB:</span>
            <span className="text-gray-900">{employee.DOB}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
            <span className="font-bold">NIC:</span>
            <span className="text-gray-900">{employee.NIC}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
            <span className="font-bold">Address:</span>
            <span className="text-gray-900">{employee.Address}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
            <span className="font-bold">Basic Salary:</span>
            <span className="text-gray-900">{employee.BasicSalary}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
            <span className="font-bold">Contact No:</span>
            <span className="text-gray-900">{employee.ContactNo}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
            <span className="font-bold">Email:</span>
            <span className="text-gray-900">{employee.Email}</span>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default ReadOneEmployee;
