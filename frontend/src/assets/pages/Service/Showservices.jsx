import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import Swal from 'sweetalert2';
import CountUp from 'react-countup'; // Added import for CountUp
import jsPDF from 'jspdf'; // Added import for jsPDF
import 'jspdf-autotable'; // Added import for jsPDF autotable
import logo from '../../images/logo.png';
const ShowService = () => {

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [isCustomerOpen, setIsCustomerOpen] = useState(false);
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const styles = {
        tableRowEven: {
            backgroundColor: '#f9f9f9',

        },
        tableRowOdd: {
            backgroundColor: '#ffffff',
        },
        image: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
        },
        actionIcons: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    useEffect(() => {
        const numbers = document.querySelectorAll("[countTo]");

        numbers.forEach((number) => {
            const ID = number.getAttribute("id");
            const value = number.getAttribute("countTo");
            let countUp = new CountUp(ID, value);

            if (number.hasAttribute("data-decimal")) {
                const options = {
                    decimalPlaces: 1,
                };
                countUp = new CountUp(ID, value, options);
            }

            if (!countUp.error) {
                countUp.start();
            } else {
                console.error(countUp.error);
                number.innerHTML = value;
            }
        });
    }, []);
    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:8077/Service')
            .then((response) => {
                setServices(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error.message);
                setLoading(false);
            });
    }, []);


    const handleDeleteService = (id) => {
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
                axios.delete(`http://localhost:8077/Service/${id}`)
                    .then(response => {
                        if (response.status === 200) {
                            Swal.fire('Deleted!', 'Service has been deleted.', 'success');
                            setServices(services.filter(service => service._id !== id)); // Remove the deleted service
                        }
                    })
                    .catch(error => {
                        Swal.fire('Error!', 'Failed to delete the service.', 'error');
                    });
            }
        });
    };

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            {/* Top Navbar */}
            {sidebarOpen && (
                <aside className="w-64 bg-gray-800 text-white flex flex-col">
                    <div className="flex items-center justify-center h-16 bg-gray-800">
                        <img src={logo} alt="logo" style={{ width: '60px', height: '60px' }} />
                    </div>
                    <nav className="flex-1">
                        <ul className="mt-2">
                            <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3 flex items-center space-x-3">
                                <a href="/dashborad" className="flex items-center space-x-3">
                                    <i className="bx bx-home-alt text-xl"></i>
                                    <span>Dashboard</span>
                                </a>
                            </li>

                            {/* Customer Details Dropdown */}
                            <li
                                className="text-gray-400 hover:bg-gray-700 hover:text-white p-3 flex items-center justify-between cursor-pointer"
                                onClick={() => setIsCustomerOpen(!isCustomerOpen)}
                            >
                                <div className="flex items-center space-x-3">
                                    <i className="bx bx-user text-xl"></i>
                                    <span>Service Pacakge :</span>
                                </div>
                                <i className={`bx bx-chevron-${isCustomerOpen ? 'up' : 'down'} text-xl`}></i>
                            </li>
                            {isCustomerOpen && (
                                <ul className="ml-8">
                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/Promotion">Service promotion</Link>
                                    </li>
                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/Service">Service</Link>
                                    </li>
                                    {/* <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                            <Link to="/ServiceHistory">Service History</Link>
                        </li>
                        <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                            <Link to="/Repair">Repair</Link>
                        </li>
                        <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                            <Link to="/vehicles">Vehicle</Link>
                        </li>
                        <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                            <Link to="/Inquire">Inquire</Link>
                        </li> */}
                                </ul>
                            )}




                            {/* Company Details Dropdown */}
                            <li
                                className="text-gray-400 hover:bg-gray-700 hover:text-white p-3 flex items-center justify-between cursor-pointer"
                                onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                            >
                                <div className="flex items-center space-x-3">
                                    <i className="bx bx-id-card text-xl"></i>
                                    <span>Company :</span>
                                </div>
                                <i className={`bx bx-chevron-${isCompanyOpen ? 'up' : 'down'} text-xl`}></i>
                            </li>
                            {isCompanyOpen && (
                                <ul className="ml-8">
                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/Promotion">Promotion</Link>
                                    </li>
                                    {/* <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                            <Link to="/Store">Store</Link>
                        </li>
                        <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                            <Link to="/vacancy">Vacancy</Link>
                        </li> */}
                                </ul>
                            )}
                        </ul>
                    </nav>
                    <div className="p-3">
                        <button className="w-full flex items-center p-3 bg-gray-800 rounded hover:bg-gray-700">
                            <i className="bx bx-cog text-xl"></i>
                            <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                <Link to="/">Logout</Link>
                            </li>
                        </button>
                    </div>
                </aside>
            )}

            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="flex items-center justify-between bg-white h-16 px-4 shadow">
                    <div className="flex items-center">
                        <i className="bx bx-menu text-xl cursor-pointer" onClick={toggleSidebar}></i>

                        <button
                            className="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                            onClick={toggleDarkMode}
                        >
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>

                        <button class="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"  >
                            <Link to="/service/create">Add Service</Link>
                        </button>
                    </div>
                </header>

                Main Content
                {/* Stats Section */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-6">
                    <div className="flex flex-col items-center">
                        <h3 className="text-5xl font-extrabold text-dark-grey-900">
                            <CountUp id="countto1" end={250} />
                            +
                        </h3>
                        <p className="text-base font-medium text-dark-grey-600">Successful Projects</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h3 className="text-5xl font-extrabold text-dark-grey-900">
                            $<CountUp id="countto2" end={12} />
                            m
                        </h3>
                        <p className="text-base font-medium text-dark-grey-600">Annual Revenue Growth</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h3 className="text-5xl font-extrabold text-dark-grey-900">
                            <CountUp id="countto3" end={2600} />
                            k+
                        </h3>
                        <p className="text-base font-medium text-dark-grey-600">Global Partners</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h3 className="text-5xl font-extrabold text-dark-grey-900">
                            <CountUp id="countto4" end={18000} />
                            +
                        </h3>
                        <p className="text-base font-medium text-dark-grey-600">Daily Website Visitors</p>
                    </div>
                </div> */}
                <main className="flex-1 p-6">

                    <div className="bg-white shadow-lg hover:shadow-xl rounded overflow-hidden">
                        <table className="table-auto min-w-full leading-normal">
                            <thead className="bg-gray-200 text-gray-600 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="text-left p-2">Service Name</th>
                                    <th className="text-left p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map(service => (
                                    <tr key={service._id}>
                                        <td className="p-2">{service.Servicename}</td>
                                        <td className="p-2 flex space-x-2">
                                            <Link
                                                to={`/Service/edit/${service._id}`}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                                            >
                                                <AiOutlineEdit />
                                            </Link>
                                            <Link
                                                to={`/Service/get/${service._id}`}
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                                            >
                                                <BsInfoCircle />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteService(service._id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                            >
                                                <MdOutlineDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default ShowService;
