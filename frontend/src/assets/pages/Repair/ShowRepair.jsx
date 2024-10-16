import React, { useState, useEffect } from 'react';
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../images/logo.png';

const ShowRepair = () => {
    const [repairs, setRepairs] = useState([]);
    const [filteredRepairs, setFilteredRepairs] = useState([]);
    const [loading, setLoading] = useState(true); // Set loading to true initially
    const [error, setError] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCustomerOpen, setIsCustomerOpen] = useState(false);
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(prevDarkMode => !prevDarkMode);
    };

    const toggleSidebar = () => {
        setSidebarOpen(prevSidebarOpen => !prevSidebarOpen);
    };

    useEffect(() => {
        axios
            .get("http://localhost:8077/Repair")
            .then((response) => {
                const data = response.data;
                if (Array.isArray(data)) {
                    setRepairs(data);
                    setFilteredRepairs(data); // Set filtered repairs initially
                } else {
                    setRepairs([]);
                    setFilteredRepairs([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching repairs:", error);
                setError("Error fetching data.");
                setLoading(false);
            });
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        if (query) {
            const filtered = repairs.filter((repair) =>
                repair.customerName.toLowerCase().includes(query) ||
                repair.customerEmail.toLowerCase().includes(query) ||
                repair.vehicleMake.toLowerCase().includes(query) ||
                repair.vehicleModel.toLowerCase().includes(query) ||
                repair.vehicleNo.toLowerCase().includes(query) ||
                repair.repairStatus.toLowerCase().includes(query) ||
                repair.Insuranceprovider?.toLowerCase().includes(query) ||
                repair.Agent?.toLowerCase().includes(query)
            );
            setFilteredRepairs(filtered);
        } else {
            setFilteredRepairs(repairs);
        }
    };

    const generateReport = () => {
        try {
            const doc = new jsPDF();
            doc.text('Repair Report', 14, 16);

            const tableData = filteredRepairs.map(repair => [
                repair.customerName,
                repair.customerEmail,
                repair.customerPhone,
                repair.vehicleMake,
                repair.vehicleModel,
                repair.vehicleNo,
                repair.repairDescription,
                repair.repairStatus,
                repair.Insuranceprovider,
                repair.Agent
            ]);

            doc.autoTable({
                head: [['Customer Name', 'Email', 'Phone', 'Make', 'Model', 'Vehicle No', 'Description', 'Status', 'Insurance Provider', 'Agent']],
                body: tableData,
                startY: 30,
                margin: { horizontal: 10 },
                styles: { fontSize: 10 },
            });

            doc.save('repair_report.pdf');
        } catch (error) {
            console.error("Error generating report:", error);
            Swal.fire({
                title: 'Error',
                text: 'There was an error generating the report.',
                icon: 'error',
            });
        }
    };

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
                axios.delete(`http://localhost:8077/Repair/${id}`)
                    .then(() => {
                        setRepairs(repairs.filter(repair => repair._id !== id));
                        setFilteredRepairs(filteredRepairs.filter(repair => repair._id !== id));
                        Swal.fire(
                            'Deleted!',
                            'The repair record has been deleted.',
                            'success'
                        );
                    })
                    .catch(error => {
                        console.error('Error deleting repair:', error);
                        Swal.fire(
                            'Error!',
                            'There was an error deleting the repair record.',
                            'error'
                        );
                    });
            }
        });
    };

   

  
    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            {/* Sidebar */}
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="flex items-center justify-between bg-white h-16 px-4 shadow">
                    <div className="flex items-center">
                        <i className="bx bx-menu text-xl cursor-pointer" onClick={toggleSidebar}></i>
                        <input
                            type="search"
                            placeholder="Search..."
                            className="ml-4 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <button
                            className="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                            onClick={generateReport}
                        >
                            Generate Report
                        </button>
                        <button
                            className="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                            onClick={toggleDarkMode}
                        >
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                        <button class="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"  >
                                <Link to="/Repair/create">Add Repair</Link>
                             </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <i className="bx bx-bell text-xl"></i>
                        <div className="flex items-center space-x-2">
                            <img
                                src="https://randomuser.me/api/portraits/men/11.jpg"
                                alt="user"
                                className="h-8 w-8 rounded-full"
                            />
                            <span>Tom Cook</span>
                            <i className="bx bx-chevron-down text-xl"></i>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className={`flex-1 p-6 overflow-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>

                    <h2 className="text-2xl font-semibold mb-4">Repair Records</h2>

                    {filteredRepairs.length === 0 ? (
                        <p>No repairs found.</p>
                    ) : (
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-800 text-white">
                        <tr>
                                    <th className="py-2 px-4 border-b">Customer Name</th>
                                    <th className="py-2 px-4 border-b">Email</th>
                                    <th className="py-2 px-4 border-b">Phone</th>
                                    <th className="py-2 px-4 border-b">Make</th>
                                    <th className="py-2 px-4 border-b">Model</th>
                                    <th className="py-2 px-4 border-b">Vehicle No</th>
                                    <th className="py-2 px-4 border-b">Description</th>
                                    <th className="py-2 px-4 border-b">Status</th>
                                    <th className="py-2 px-4 border-b">Insurance Provider</th>
                                    <th className="py-2 px-4 border-b">Agent</th>
                                    <th className="py-2 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRepairs.map((repair,index) => (
                                    <tr key={repair._id}
                                    className={index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : (darkMode ? 'bg-gray-800' : 'bg-white')}
>
                                        <td className="py-2 px-4 border-b">{repair.customerName}</td>
                                        <td className="py-2 px-4 border-b">{repair.customerEmail}</td>
                                        <td className="py-2 px-4 border-b">{repair.customerPhone}</td>
                                        <td className="py-2 px-4 border-b">{repair.vehicleMake}</td>
                                        <td className="py-2 px-4 border-b">{repair.vehicleModel}</td>
                                        <td className="py-2 px-4 border-b">{repair.vehicleNo}</td>
                                        <td className="py-2 px-4 border-b">{repair.repairDescription}</td>
                                        <td className="py-2 px-4 border-b">{repair.repairStatus}</td>
                                        <td className="py-2 px-4 border-b">{repair.Insuranceprovider}</td>
                                        <td className="py-2 px-4 border-b">{repair.Agent}</td>
                                        <td className="py-2 px-4 border-b text-center flex-1">
                                        <td className="py-2 px-4 border-b text-center flex flex-row justify-center items-center space-x-2">
    <Link to={`/repair/${repair._id}`} className="text-blue-500 hover:underline">
        <BsInfoCircle />
    </Link>
    <Link to={`/edit-repair/${repair._id}`} className="text-green-500 hover:underline">
        <AiOutlineEdit />
    </Link>
    <button
        onClick={() => handleDelete(repair._id)}
        className="text-red-500 hover:underline"
    >
        <MdOutlineDelete />
    </button>
</td>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ShowRepair;
