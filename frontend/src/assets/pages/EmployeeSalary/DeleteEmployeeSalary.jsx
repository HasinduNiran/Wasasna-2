import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

const DeleteEmployeeSalary = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const handleDelete = () => {
        setLoading(true);
        axios.delete(`http://localhost:8077/EmployeeSalary/${id}`)
            .then(() => {
                setLoading(false);
                navigate('/EmployeeSalary');
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-red-600 mb-4 text-center">Delete Employee Salary</h1>
                <p className="text-gray-700 text-lg text-center mb-6">
                    Are you sure you want to delete this employee's salary record? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                    <button 
                        onClick={handleDelete} 
                        className={`${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                        } text-white font-bold py-2 px-6 rounded shadow transition-all duration-300`}
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                    <Link 
                        to={'/EmployeeSalary'} 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded shadow transition-all duration-300"
                    >
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default DeleteEmployeeSalary;
