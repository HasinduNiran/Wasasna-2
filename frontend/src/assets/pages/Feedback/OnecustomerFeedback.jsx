import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../../components/Spinner'; // Ensure Spinner component exists
import Swal from 'sweetalert2';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import backgroundImage from '../../images/mee.jpg'; // Ensure the path is correct
import Footer from '../footer/Footer';
import NavBar1 from '../Navbar/NavBar1';

const OneCustomerFeedback = () => {
    const { cusID } = useParams();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get(`http://localhost:8077/feedback/${cusID}`);
                setFeedbacks(response.data);
                if (response.data.length === 0) {
                    setError("No feedbacks found for this customer.");
                } else {
                    setError(null); // Clear error if feedbacks are found
                }
            } catch (error) {
                console.error(error);
                setError(" feedbacks not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, [cusID]);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8077/feedback/${id}`)
                    .then(() => {
                        setFeedbacks(feedbacks.filter(fb => fb._id !== id));
                        Swal.fire('Deleted!', 'Your feedback has been deleted.', 'success');
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire('Error!', 'There was an error deleting the feedback.', 'error');
                    });
            }
        });
    };

    const renderStars = (starRating) => {
        const totalStars = 5;
        return (
            <div className="flex">
                {Array.from({ length: totalStars }, (v, i) => i + 1).map((star) =>
                    star <= starRating ? (
                        <AiFillStar key={star} className="text-yellow-500" />
                    ) : (
                        <AiOutlineStar key={star} className="text-yellow-500" />
                    )
                )}
            </div>
        );
    };

    if (loading) {
        return <Spinner />; // Display spinner during loading
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar1 />
            <div
                className="flex-grow flex items-center justify-center p-4 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="bg-white max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-4 bg-blue-100 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">Feedbacks for Customer ID: {cusID}</h3>
                        <p className="mt-1 text-sm text-gray-600">Customer's feedback details are listed below.</p>
                    </div>
                    <div className="border-t border-gray-200">
                        {error ? (
                            <p className="px-6 py-5 text-red-500 text-center">{error}</p>
                        ) : (
                            <dl className="divide-y divide-gray-200">
                                {feedbacks.map((feedback, index) => (
                                    <div key={feedback._id} className={`py-5 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <div className="grid grid-cols-3 gap-4 px-6">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Name</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{feedback.name}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{feedback.email}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{feedback.phone_number}</dd>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 px-6 mt-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Employee</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{feedback.employee}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Message</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{feedback.message}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Star Rating</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {renderStars(feedback.star_rating)}
                                                </dd>
                                            </div>
                                        </div>

                                        <div className="flex justify-center items-center mt-5 space-x-4 border-t border-gray-200 pt-4">
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(feedback._id)}
                                            >
                                                <MdOutlineDelete className="inline-block text-lg" />
                                            </button>
                                            <Link to={`/feedback/edit/${feedback._id}`} className="text-yellow-600 hover:text-yellow-900">
                                                <AiOutlineEdit className="inline-block text-lg" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </dl>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OneCustomerFeedback;
