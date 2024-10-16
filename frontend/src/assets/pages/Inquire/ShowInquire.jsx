import React, { useState, useEffect } from 'react';
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import Swal from 'sweetalert2';
import CountUp from 'react-countup';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../images/logo.png';

const ShowInquire = () => {
    const [inquire, setInquire] = useState([]);
    const [filteredInquire, setFilteredInquire] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCustomerOpen, setIsCustomerOpen] = useState(false);
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:8077/Inquire')
            .then((response) => {
                setInquire(response.data.data);
                setFilteredInquire(response.data.data); // Initialize filtered inquiries
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, inquire]);

    const handleSearch = () => {
        const query = searchQuery.toLowerCase();
        const filtered = inquire.filter((inq) => {
            return (
                inq.Name.toLowerCase().includes(query) ||
                inq.Number.toLowerCase().includes(query) ||
                inq.Email.toLowerCase().includes(query) ||
                inq.ServiceType.toLowerCase().includes(query) ||
                inq.VehicleNumber.toLowerCase().includes(query) ||
                inq.Message.toLowerCase().includes(query)
            );
        });
        setFilteredInquire(filtered);
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
                axios.delete(`http://localhost:8077/Inquire/${id}`)
                    .then(() => {
                        setInquire(inquire.filter(inq => inq._id !== id));
                        setFilteredInquire(filteredInquire.filter(inq => inq._id !== id));
                        Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
                    })
                    .catch((error) => {
                        console.log(error);
                        Swal.fire('Error!', 'There was an error deleting the record.', 'error');
                    });
            }
        });
    };

    const maskPassword = (password) => {
        return '*'.repeat(password.length);
    };

    const generateReport = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString(); // Current date for the report
    
        // Define table columns for inquiry data
        const tableColumn = [
            'Name', 'Number', 'Email', 'Service Type', 'Vehicle Number', 'Message'
        ];
    
        // Map inquiry data to table rows
        const tableRows = filteredInquire.map(inq => [
            inq.Name,
            inq.Number,
            inq.Email,
            inq.ServiceType,
            inq.VehicleNumber,
            inq.Message
        ]);
    
        // Add report header and company details
        doc.setFontSize(28).setTextColor('red');
        doc.text("Wasana Auto Service", 60, 15); // Company name
    
        doc.setFontSize(20).setTextColor(0, 0, 0);
        doc.text("Inquire Report", 70, 25); // Report title
    
        doc.setFontSize(15).setTextColor(100, 100, 100);
        doc.text(`Report Generated Date: ${date}`, 65, 35); // Report date
    
        // Add company address or other details
        doc.setFontSize(12).setTextColor(150, 150, 150);
        doc.text("Wasana Auto Service, Colombo 4", 30, 45); // Company address
    
        // Add a separator line
        doc.text(
            "--------------------------------------------------------------------------------------------------",
            0,
            50
        );
    
        // Create and format the inquiries table
        doc.autoTable({
            startY: 55,
            margin: { left: 20, right: 20 }, // Set margins
            head: [tableColumn], // Table header
            body: tableRows, // Data rows
            styles: { fontSize: 9 }, // Font size for table
            headStyles: {
                fillColor: [31, 41, 55], // Dark gray header background
                textColor: [255, 255, 255], // White text
                fontStyle: "bold",
            },
        });
    
        // Save the PDF with a custom file name including the date
        doc.save(`Inquire_Report_${date}.pdf`);
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
                                <a href="/feedback" className="flex items-center space-x-3">
                                   <i className="bx bx-home-alt text-xl"></i>
                                      <span>Feedback</span>
                                      </a>
                                </li>


                                <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3 flex items-center space-x-3">
                                <a href="/Inquire" className="flex items-center space-x-3">
                                   <i className="bx bx-home-alt text-xl"></i>
                                      <span>Inquire</span>
                                      </a>
                                </li>
{/*                 
                Customer Details Dropdown */}
                <li 
                    className="text-gray-400 hover:bg-gray-700 hover:text-white p-3 flex items-center justify-between cursor-pointer"
                    onClick={() => setIsCustomerOpen(!isCustomerOpen)}
                >
                    {/* <div className="flex items-center space-x-3">
                        <i className="bx bx-user text-xl"></i>
                        <span>Customer :</span>
                    </div> */}
                    <i className={`bx bx-chevron-${isCustomerOpen ? 'up' : 'down'} text-xl`}></i>
                </li>
                {isCustomerOpen && (
                    <ul className="ml-8">
                        
                        <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                            <Link to="/feedback">Feedback</Link>
                        </li>
                       
                        <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                            <Link to="/Inquire">Inquire</Link>
                        </li>
                    </ul>
                )}

                {/* Employee Details Dropdown */}
              
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
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            className="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                            onClick={generateReport}
                        >
                            Generate Report
                        </button>
                        {/* Dark Mode Toggle Button */}
                        <button
                            className="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                            onClick={toggleDarkMode}
                        >
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                       
                    </div>

                    <div className="flex items-center space-x-4">
                        <i className="bx bx-bell text-xl"></i>
                        {/* <div className="flex items-center space-x-2">
                            <img
                                src="https://randomuser.me/api/portraits/men/11.jpg"
                                alt="user"
                                className="h-8 w-8 rounded-full"
                            />
                            <span>Inquire Admin</span>
                            <i className="bx bx-chevron-down text-xl"></i>
                        </div> */}
                    </div>
                </header>

                {/* Stats Section with Dark Mode */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
                    {/* <div className="flex flex-col items-center">
                        <h3 className="text-5xl font-extrabold text-dark-grey-900">
                            <CountUp id="countto1" end={250} />
                            +
                        </h3>
                        <p className="text-base font-medium text-dark-grey-600">Successful Projects</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h3 className="text-5xl font-extrabold text-dark-grey-900">
                            <CountUp id="countto2" end={1200} />
                            +
                        </h3>
                        <p className="text-base font-medium text-dark-grey-600">Happy Customers</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h3 className="text-5xl font-extrabold text-dark-grey-900">
                            <CountUp id="countto3" end={150} />
                            +
                        </h3>
                        <p className="text-base font-medium text-dark-grey-600">Employees</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h3 className="text-5xl font-extrabold text-dark-grey-900">
                            <CountUp id="countto4" end={350} />
                            +
                        </h3>
                        <p className="text-base font-medium text-dark-grey-600">Awards Won</p>
                    </div> */}
                </div>

                {/* Table Section with Dark Mode */}
                <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                    <h2 className="text-xl font-semibold mb-4">Inquiries</h2>
                    <table className={`min-w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Name</th>
                                <th className="px-4 py-2 border">Number</th>
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">Service Type</th>
                                <th className="px-4 py-2 border">Vehicle Number</th>
                                <th className="px-4 py-2 border">Message</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInquire.map((inq, index) => (
                                <tr
                                    key={inq._id}
                                    className={index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : (darkMode ? 'bg-gray-800' : 'bg-white')}
                                >
                                    <td className='border px-4 py-2'>{inq.Name}</td>
                                    <td className='border px-4 py-2'>{inq.Number}</td>
                                    <td className='border px-4 py-2'>{inq.Email}</td>
                                    <td className='border px-4 py-2'>{inq.ServiceType}</td>
                                    <td className='border px-4 py-2'>{inq.VehicleNumber}</td>
                                    <td className='border px-4 py-2'>{inq.Message}</td>
                                    <td className='border px-4 py-2 flex justify-center items-center space-x-2'>
                                        <Link to={`/Inquire/get/${inq._id}`} className="text-blue-500">
                                            <BsInfoCircle />
                                        </Link>
                                        {/* <Link to={`/Inquire/edit/${inq._id}`} className="text-yellow-600">
                                            <AiOutlineEdit />
                                        </Link> */}
                                        <button
                                            type="button"
                                            className="text-red-600"
                                            onClick={() => handleDelete(inq._id)}
                                        >
                                            <MdOutlineDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShowInquire;
