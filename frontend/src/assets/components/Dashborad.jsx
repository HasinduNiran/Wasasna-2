import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../images/logo.png"
const Dashboard = () => {
    const [isCustomerOpen, setIsCustomerOpen] = useState(false);
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true); // Define sidebarOpen


    return (
        <div className="w-full   rounded-lg shadow-md flex overflow-hidden relative bg-gradient-to-r from-gray-500 to-gray-800 h-screen">
            <input className="hidden" type="checkbox" id="mobileButton" />

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
                                    <span>Customer :</span>
                                </div>
                                <i className={`bx bx-chevron-${isCustomerOpen ? 'up' : 'down'} text-xl`}></i>
                            </li>
                            {isCustomerOpen && (
                                <ul className="ml-8">
                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/Customer">Customer Details</Link>
                                    </li>
                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/feedback">Feedback</Link>
                                    </li>
                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
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
                                    </li>
                                </ul>
                            )}

                            {/* Employee Details Dropdown */}
                            <li 
                                className="text-gray-400 hover:bg-gray-700 hover:text-white p-3 flex items-center justify-between cursor-pointer"
                                onClick={() => setIsEmployeeOpen(!isEmployeeOpen)}
                            >
                                <div className="flex items-center space-x-3">
                                    <i className="bx bx-id-card text-xl"></i>
                                    <span>Employee :</span>
                                </div>
                                <i className={`bx bx-chevron-${isEmployeeOpen ? 'up' : 'down'} text-xl`}></i>
                            </li>
                            {isEmployeeOpen && (
                                <ul className="ml-8">
                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/Employee">Employee Details</Link>
                                    </li>
                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/EmployeeAttendence">Employee Attendances</Link>
                                    </li>
                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/EmployeeSalary">Employee Salary</Link>
                                    </li>
                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/applicant">Applicant</Link>
                                    </li>
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
                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/Store">Store</Link>
                                    </li>
                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/vacancy">Vacancy</Link>
                                    </li>
                                </ul>
                            )}
                        </ul>
                    </nav>
                    <div className="p-3">
                        <button className="w-full flex items-center p-3 bg-gray-800 rounded hover:bg-gray-700">
                            <i className="bx bx-cog text-xl"></i>
                            <span className="ml-4">Settings</span>
                        </button>
                    </div>
                </aside>
            )}

            <div className="w-[90%] h-full p-4 flex flex-col ml-64 text-gray-100"> {/* Changed ml-[14%] to ml-64 */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <h2 className="text-2xl font-light">Sales Dashboard</h2>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gray-100 p-2 rounded-lg">
                            <ion-icon name="search-outline" className="text-gray-100"></ion-icon>
                            <input type="text" placeholder="Search" className="ml-2 bg-transparent outline-none text-gray-100" />
                        </div>

                        <div className="w-10 h-10 flex items-center justify-center text-red-800">
                            <ion-icon name="notifications-outline"></ion-icon>
                        </div>

                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="w-10 h-10 flex items-center justify-center text-red-800">
                                <ion-icon name="person-circle-outline"></ion-icon>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 h-full overflow-y-auto text-gray-100">
                    <div className="w-full md:w-[65%] flex flex-col gap-4">
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <img src="https://raw.githubusercontent.com/programmercloud/sales-dashboard/main/img/graph.png" alt="Graph" className="w-4/5 mx-auto" />
                            <a href="#" className="block text-center text-red-800 font-medium mt-2">See Details</a>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold">Top Site User</h2>
                                    <p className="text-gray-100">7 days</p>
                                </div>

                                <div className="flex md:flex-row flex-col items-center">
                                    <div className="w-full md:w-3/5"> {/* Corrected w-/5 to w-3/5 */}
                                        <div className="bg-gray-800 p-4 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <h4 className="text-gray-100">Name</h4>
                                                <p>Hasindu</p>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <h4 className="text-gray-100">Time</h4>
                                                <p>385</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <h4 className="text-gray-100">Post</h4>
                                                <p>Admin</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-2/5 mt-4 md:mt-0 flex justify-center">
                                        <img src="https://raw.githubusercontent.com/programmercloud/sales-dashboard/main/img/laptop.png" alt="Laptop" className="w-32" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col text-gray-100">
                                <h2 className="text-xl font-semibold">Vehicle</h2>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 bg-red-800 rounded-full"></span>
                                        <h4>Europe</h4>
                                        <p>79%</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                                        <h4>Asia</h4>
                                        <p>52%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-[28%] flex flex-col gap-4 text-gray-100">
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">Recent Service</h2>
                            <div className="flex items-center justify-between mt-4">
                                <div className="w-10 h-10 flex items-center justify-center text-red-800">
                                    <ion-icon name="logo-apple"></ion-icon>
                                </div>
                                <p>CBB-2048</p>
                                <p className="text-gray-100">$499</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="w-10 h-10 flex items-center justify-center text-red-800">
                                    <ion-icon name="logo-google"></ion-icon>
                                </div>
                                <p>GY-6841</p>
                                <p className="text-gray-100">$1249</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="w-10 h-10 flex items-center justify-center text-red-800">
                                    <ion-icon name="logo-microsoft"></ion-icon>
                                </div>
                                <p>KK-5841</p>
                                <p className="text-gray-100">$2399</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="w-10 h-10 flex items-center justify-center text-red-800">
                                    <ion-icon name="watch-outline"></ion-icon>
                                </div>
                                <p>GZ-6941</p>
                                <p className="text-gray-100">$500</p>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg shadow-md text-gray-100">
                            <h2 className="text-xl font-semibold">Weekly Plan</h2>
                            <div className="w-32 h-32 mx-auto bg-gray-800 border-8 border-red-800 rounded-full flex items-center justify-center text-red-800 text-2xl font-bold">
                                49%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
