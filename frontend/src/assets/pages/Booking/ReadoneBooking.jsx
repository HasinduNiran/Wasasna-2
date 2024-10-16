import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import backgroundImage from '../../images/mee.jpg'; // Ensure this path is correct

const ReadOneBooking = () => {
  const { id } = useParams(); // Get the booking ID from the URL
  const [booking, setBooking] = useState(null);
  const [typewriterText, setTypewriterText] = useState(""); // State for typewriter effect

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:8077/Booking/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error("There was an error fetching the booking!", error);
      }
    };

    fetchBooking();
  }, [id]);

  useEffect(() => {
    const words = ["Booking Details"];
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

  if (!booking) {
    return <p>Loading booking details...</p>;
  }

  return (
    <div 
      className="p-4 bg-cover bg-center min-h-screen flex flex-col items-center" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg hover:shadow-red-800 mt-[10%]">
        <div className="px-6 py-6 space-y-4">
          <div className="text-2xl font-bold text-gray-800 border-b pb-2 border-gray-200">{typewriterText}</div>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
              <span>Booking ID:</span>
              <span className="font-medium text-gray-900">{booking.Booking_Id}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
              <span>Booking Date:</span>
              <span className="font-medium text-gray-900">{new Date(booking.Booking_Date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
              <span>Customer Name:</span>
              <span className="font-medium text-gray-900">{booking.Customer_Name}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
              <span>Vehicle Type:</span>
              <span className="font-medium text-gray-900">{booking.Vehicle_Type}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
              <span>Vehicle Number:</span>
              <span className="font-medium text-gray-900">{booking.Vehicle_Number}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
              <span>Contact Number:</span>
              <span className="font-medium text-gray-900">{booking.Contact_Number}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
              <span>Email:</span>
              <span className="font-medium text-gray-900">{booking.Email}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
              <span>Selected Package:</span>
              <span className="font-medium text-gray-900">{booking.selectedPackage}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
              <span>Selected Services:</span>
              <span className="font-medium text-gray-900">{booking.selectedServices.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadOneBooking;
