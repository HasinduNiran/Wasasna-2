import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import backgroundImage from '../../images/mee.jpg'; // Ensure this path is correct

import Footer from '../footer/Footer';
import NavBar1 from '../Navbar/NavBar1';

const OneCustomerInquire = () => {
    const { cusID } = useParams();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const response = await axios.get(`http://localhost:8077/inquire/${cusID}`);
                setInquiries(response.data);
                if (response.data.length === 0) {
                    setError("No inquiries found for this customer.");
                } else {
                    setError(null); // Clear the error if inquiries are found
                }
            } catch (error) {
                console.error(error);
                setError("Not found inquiries.");
            } finally {
                setLoading(false);
            }
        };
        fetchInquiries();
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
                axios.delete(`http://localhost:8077/inquire/${id}`)
                    .then(() => {
                        setInquiries(inquiries.filter(inq => inq._id !== id));
                        Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire('Error!', 'There was an error deleting the record.', 'error');
                    });
            }
        });
    };

    if (loading) {
        return <Spinner />;
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
                        <h3 className="text-xl font-semibold text-gray-800">Inquiries for Customer ID: {cusID}</h3>
                        <p className="mt-1 text-sm text-gray-600">Customer's inquiry details are listed below.</p>
                    </div>
                    <div className="border-t border-gray-200">
                        {error ? (
                            <p className="px-6 py-5 text-red-500 text-center">{error}</p>
                        ) : (
                            <dl className="divide-y divide-gray-200">
                                {inquiries.map((inq, index) => (
                                    <div key={inq._id} className={`py-5 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <div className="grid grid-cols-3 gap-4 px-6">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Name</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{inq.Name}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Number</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{inq.Number}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{inq.Email}</dd>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 px-6 mt-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Service Type</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{inq.ServiceType}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Vehicle Number</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{inq.VehicleNumber}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Message</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{inq.Message}</dd>
                                            </div>
                                        </div>

                                        <div className="flex justify-center items-center mt-5 space-x-4 border-t border-gray-200 pt-4">
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(inq._id)}
                                            >
                                                <MdOutlineDelete className="inline-block text-lg" />
                                            </button>
                                            <Link to={`/Inquire/edit/${inq._id}`} className="text-yellow-600 hover:text-yellow-900">
                                                <AiOutlineEdit className="inline-block text-lg" />
                                            </Link>
                                            {/* Uncomment if you want to add details view */}
                                            {/* <Link to={`/Inquire/get/${inq._id}`} className="text-blue-600 hover:text-blue-900">
                                                <BsInfoCircle className="inline-block text-lg" />
                                            </Link> */}
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

export default OneCustomerInquire;
