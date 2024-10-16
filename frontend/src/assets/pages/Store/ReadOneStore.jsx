import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import backgroundImage from '../../images/mee.jpg'; // Ensure this path is correct
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'
const ReadOneStore = () => {
    const [store, setStore] = useState({});
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:8077/Store/${id}`)
            .then((response) => {
                setStore(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id]);

    return (
        <div className=''><Navbar/>
        <div 
            className="p-4 bg-cover bg-center min-h-screen flex flex-col items-center" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 mt-[10%]">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                    Store Details
                </h1>
                {loading ? (
                    <div className="text-xl font-bold text-center">Loading...</div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <span className="font-semibold w-48 text-gray-700">Name:</span>
                            <span className="text-gray-600">{store.Name}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold w-48 text-gray-700">Quantity:</span>
                            <span className="text-gray-600">{store.Quantity}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold w-48 text-gray-700">Price:</span>
                            <span className="text-gray-600">{store.Price}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <Footer/>
        </div>
    );
}

export default ReadOneStore;
