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

const ShowCustomer = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
            .get('http://localhost:8077/Customer')
            .then((response) => {
                const data = response.data;
                if (Array.isArray(data)) {
                    setCustomers(data);
                    setFilteredCustomers(data);
                } else {
                    console.warn('Data is not an array:', data);
                    setCustomers([]);
                    setFilteredCustomers([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching customer data:', error);
                setCustomers([]);
                setFilteredCustomers([]);
                setLoading(false);
            });
    }, []);

    const handleSearch = () => {
        const filtered = customers.filter((customer) =>
            customer.cusID.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.NIC.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCustomers(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [searchQuery]);

    const maskPassword = (password) => {
        return '•'.repeat(password.length);
    };

    const generateReport = () => {
        const doc = new jsPDF();
        const date = Date().split(" ");
        const dateStr = date[1] + "-" + date[2] + "-" + date[3];
    
        // Set Title Font and Color
        doc.setFontSize(28).setFont("Mooli", "bold").setTextColor('red');
        doc.text("Wasana Auto Service", 60, 25); // Adjusted Y position for better margin
    
        // Set Report Title Font and Position
        doc.setFont("helvetica", "normal").setFontSize(20).setTextColor(0, 0, 0);
        doc.text("Customer Details Report", 65, 35); // Adjusted Y position for better margin
    
        // Set Date Font and Position
        doc.setFont("times", "normal").setFontSize(15).setTextColor(100, 100, 100);
        doc.text(`Report Generated Date: ${dateStr}`, 65, 45); // Adjusted Y position for better margin
    
        // Address Section
        doc.setFont("courier", "normal").setFontSize(12).setTextColor(150, 150, 150);
        doc.text("Wasana Auto Service, Colombo 4", 30, 55); // Adjusted Y position for better margin
    
        // Separator Line
        doc.setFont("courier", "normal").setFontSize(12).setTextColor(150, 150, 150);
        doc.text(
            "--------------------------------------------------------------------------------------------------",
            0,
            60
        );
    
        // Adjusting startY for autoTable to avoid overlapping with previous content
        doc.autoTable({
            startY: 65, // Adjusted to ensure the table starts after the content above
            margin: { left: 20, right: 20 }, // Added margin for better spacing on the sides
            head: [['Customer ID', 'First Name', 'Last Name', 'NIC', 'Phone', 'Email']],
            body: filteredCustomers.map(customer => [
                customer.cusID,
                customer.firstName,
                customer.lastName,
                customer.NIC,
                customer.phone,
                customer.email
            ]),
        });
    
        // Save the PDF
        doc.save('customer-report.pdf');
    };
    

    const handleDelete = (id) => {
        // Implement delete functionality
    };

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
                                <a href="/Customer" className="flex items-center space-x-3">
                                   <i className="bx bx-home-alt text-xl"></i>
                                      <span>Customer Details</span>
                                      </a>
                                </li>


                                {/* <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3 flex items-center space-x-3">
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
                                </li> */}
                            {isCustomerOpen && (
                                <ul className="ml-8">
                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/Customer">Customer Details</Link>
                                    </li>
                                    {/* <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/feedback">Feedback</Link>
                                    </li>

                                    <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                        <Link to="/Inquire">Inquire</Link>
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
                        {/* <button class="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"  >
                            <Link to="/Customer/create">Create Customer</Link>
                        </button> */}
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

                {/* Stats Section with Dark Mode */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
                    <div className="flex flex-col items-center">
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
                    </div>
                </div>

                {/* Table Section with Dark Mode */}
                <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                    <h2 className="text-xl font-semibold mb-4">Customers</h2>
                    <table className={`min-w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Customer ID</th>
                                <th className="px-4 py-2 border">Image</th>
                                <th className="px-4 py-2 border">First Name</th>
                                <th className="px-4 py-2 border">Last Name</th>
                                <th className="px-4 py-2 border">NIC</th>
                                <th className="px-4 py-2 border">Phone</th>
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">Password</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer, index) => (
                                <tr
                                    key={customer._id}
                                    className={index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : (darkMode ? 'bg-gray-800' : 'bg-white')}
                                >

                                    <td className='border px-4 py-2'>{customer.cusID}</td>
                                    <td className='border px-4 py-2'>
                                        {customer.image && (
                                            <img src={customer.image} alt="Profile Pic" style={styles.image} />

                                        )}
                                    </td>
                                    <td className='border px-4 py-2'>{customer.firstName}</td>
                                    <td className='border px-4 py-2'>{customer.lastName}</td>
                                    <td className='border px-4 py-2'>{customer.NIC}</td>
                                    <td className='border px-4 py-2'>{customer.phone}</td>
                                    <td className='border px-4 py-2'>{customer.email}</td>
                                    <td className='border px-4 py-2'>{maskPassword(customer.password)}</td>
                                    <td className='border px-4 py-2 flex justify-center items-center space-x-2'>
                                        {/* <Link to={`/customer/${customer._id}`} className="text-blue-500">
                                            <BsInfoCircle />
                                        </Link> */}
                                        {/* <Link to={`/customer/edit/${customer._id}`} className="text-blue-500">
                                            <AiOutlineEdit />
                                        </Link> */}
                                        <Link to={`/customer/delete/${customer._id}`} className="text-blue-500">
                                            <MdOutlineDelete />
                                        </Link>
                                        {/* <button
                                            type="button"
                                            className="text-red-500"
                                            onClick={() => handleDelete(customer._id)}
                                        >
                                            <MdOutlineDelete />
                                        </button> */}
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

export default ShowCustomer;
