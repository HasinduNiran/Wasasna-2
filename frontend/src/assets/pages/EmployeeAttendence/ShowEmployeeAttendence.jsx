import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import { BsInfoCircle } from 'react-icons/bs';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../images/logo.png';
import CountUp from 'react-countup';
const ShowEmployeeAttendence = () => {
    const [employeesAttendence, setEmployeesAttendence] = useState([]);
    const [filteredEmployeesAttendence, setFilteredEmployeesAttendence] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCustomerOpen, setIsCustomerOpen] = useState(false);
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);

    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:8077/EmployeeAttendence')
            .then((response) => {
                setEmployeesAttendence(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const filteredAttendence = employeesAttendence.filter((attendance) =>
            searchQuery === '' || attendance.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredEmployeesAttendence(filteredAttendence);
    }, [searchQuery, employeesAttendence]);

    const generateReport = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString(); // Get the current date
    
        // Add custom title, subtitle, and date
        doc.setFontSize(28).setTextColor('red');
        doc.text("Wasana Auto Service", 60, 15); // Company name
        
        doc.setFontSize(20).setTextColor(0, 0, 0);
        doc.text("Employee Attendance Report", 45, 25); // Report title
    
        doc.setFontSize(15).setTextColor(100, 100, 100);
        doc.text(`Report Generated Date: ${date}`, 65, 35); // Date of the report
    
        // Add address or other company details
        doc.setFontSize(12).setTextColor(150, 150, 150);
        doc.text("Wasana Auto Service, Colombo 4", 30, 45); // Company address
    
        // Add separator line
        doc.text(
            "--------------------------------------------------------------------------------------------------",
            0,
            50
        );
    
        // Generate the table data with a formatted header and content
        doc.autoTable({
            startY: 55,
            margin: { left: 20, right: 20 }, // Add side margins for the table
            head: [['No', 'EmpID', 'Employee Name', 'Date', 'In Time', 'Out Time', 'Worked Hours', 'OT Hours']],
            body: filteredEmployeesAttendence.map((attendance, index) => [
                index + 1,
                attendance.EmpID,
                attendance.employeeName,
                new Date(attendance.date).toLocaleDateString(), // Format date
                attendance.InTime,
                attendance.OutTime,
                attendance.WorkingHours,
                attendance.OThours,
            ]),
            styles: { fontSize: 9 }, // Set font size for table
            headStyles: {
                fillColor: [31, 41, 55], // Dark gray header background
                textColor: [255, 255, 255], // White text color
                fontStyle: "bold",
            },
        });
    
        // Save the PDF with a file name including the date
        doc.save(`Employee-Attendance-Report_${date}.pdf`);
    };
    
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`http://localhost:8077/EmployeeAttendence/${id}`)
                    .then(() => {
                        setEmployeesAttendence(employeesAttendence.filter((attendance) => attendance._id !== id));
                        Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
                    })
                    .catch((error) => {
                        console.error('Error deleting record:', error);
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



            <div className="flex-1 p-6">
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
                        <button class="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"  >
                            <Link to="/EmployeeAttendence/create">Create Employee Attendance</Link>
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

                
                    <div>
                      
                    <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-gray-800 text-white">
                    <tr>
                                    <th className="px-4 py-2 border">No</th>
                                    <th className="px-4 py-2 border">EmpID</th>
                                    <th className="px-4 py-2 border">Employee Name</th>
                                    <th className="px-4 py-2 border">Date</th>
                                    <th className="px-4 py-2 border">InTime</th>
                                    <th className="px-4 py-2 border">OutTime</th>
                                    <th className="px-4 py-2 border">Worked Hours</th>
                                    <th className="px-4 py-2 border">OT Hours</th>
                                    <th className="px-4 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployeesAttendence.map((attendance, index) => (
                                    <tr key={attendance._id}
                                    className={index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : (darkMode ? 'bg-gray-800' : 'bg-white')}
                                    >
                                        <td className="px-4 py-2 border">{index + 1}</td>
                                        <td className="px-4 py-2 border">{attendance.EmpID}</td>
                                        <td className="px-4 py-2 border">{attendance.employeeName}</td>
                                        <td className="px-4 py-2 border">{attendance.date}</td>
                                        <td className="px-4 py-2 border">{attendance.InTime}</td>
                                        <td className="px-4 py-2 border">{attendance.OutTime}</td>
                                        <td className="px-4 py-2 border">{attendance.WorkingHours}</td>
                                        <td className="px-4 py-2 border">{attendance.OThours}</td>
                                        <td className="px-4 py-2 border flex justify-around">
                                             <Link to={`/EmployeeAttendence/edit/${attendance._id}`}>
                                                <AiOutlineEdit className=' text-yellow-600' />
                                            </Link>
                                            <button onClick={() => handleDelete(attendance._id)}>
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
        </div>
    );
};

export default ShowEmployeeAttendence;
