import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import backgroundImage from '../../images/mee.jpg'; // Ensure this path is correct
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'
const ReadOneFeedback = () => {
    const { id } = useParams(); // Get the feedback ID from the route parameters
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [typewriterText, setTypewriterText] = useState(""); // State for typewriter effect

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get(`http://localhost:8077/feedback/${id}`); // Adjust the API endpoint as necessary
                setFeedback(response.data);
            } catch (error) {
                console.error('Error fetching feedback:', error);
                setError('Error fetching feedback.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [id]);

    useEffect(() => {
        const words = ["Feedback Details"];
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

    if (loading) return <div className="text-xl font-bold text-center">Loading...</div>;
    if (error) return <div className="text-red-500 font-bold text-center">{error}</div>;
    if (!feedback) return <div className="text-gray-500 text-center">No feedback found.</div>;

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
                    <div className="flex items-center">
                        <span className="font-semibold w-36 text-gray-700">Customer ID:</span>
                        <span className="text-gray-600">{feedback.cusID}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-36 text-gray-700">Name:</span>
                        <span className="text-gray-600">{feedback.name}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-36 text-gray-700">Email:</span>
                        <span className="text-gray-600">{feedback.email}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-36 text-gray-700">Phone Number:</span>
                        <span className="text-gray-600">{feedback.phone_number}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-36 text-gray-700">Employee:</span>
                        <span className="text-gray-600">{feedback.employee}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-36 text-gray-700">Message:</span>
                        <span className="text-gray-600">{feedback.message}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-36 text-gray-700">Star Rating:</span>
                        <span className="text-gray-600">{feedback.star_rating}</span>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default ReadOneFeedback;
