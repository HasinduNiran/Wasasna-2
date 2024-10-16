import React, { useState, useEffect } from 'react';
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import Swal from 'sweetalert2';
import CountUp from 'react-countup'; // Added import for CountUp
import jsPDF from 'jspdf'; // Added import for jsPDF
import 'jspdf-autotable'; // Added import for jsPDF autotable
import logo from '../../images/logo.png';

const ShowEmployeeSalary = () => {
    // State initialization
    const [employeeSalary, setEmployeeSalary] = useState([]);
    const [filteredSalaries, setFilteredSalaries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false); // Added darkMode state
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState(""); // Added searchQuery state
    const [isCustomerOpen, setIsCustomerOpen] = useState(false);
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
   
    // Styles for even and odd rows
    const styles = {
        tableRowEven: {
            backgroundColor: '#f9f9f9',
        },
        tableRowOdd: {
            backgroundColor: '#ffffff',
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

    // Initialize CountUp on mount for stats
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

    // Initial fetch of Employee Salary data
    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8077/EmployeeSalary')
            .then((response) => {
                console.log('API Response:', response.data);
                const data = response.data;
                if (Array.isArray(data)) {
                    setEmployeeSalary(data);
                    setFilteredSalaries(data);
                } else {
                    console.warn('Data is not an array:', data);
                    setEmployeeSalary([]);
                    setFilteredSalaries([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching employee salaries:', error);
                setEmployeeSalary([]);
                setFilteredSalaries([]);
                setLoading(false);
            });
    }, []);

    // Search functionality
    const handleSearch = () => {
        const query = searchQuery.toLowerCase();
        const filtered = employeeSalary.filter((employee) =>
            employee.EmpID.toLowerCase().includes(query) ||
            employee.employeeName.toLowerCase().includes(query) ||
            employee.fromDate.toLowerCase().includes(query) ||
            employee.toDate.toLowerCase().includes(query) ||
            String(employee.totalOThours).toLowerCase().includes(query) ||
            String(employee.totalOTpay).toLowerCase().includes(query) ||
            String(employee.BasicSalary).toLowerCase().includes(query) ||
            String(employee.TotalSalary).toLowerCase().includes(query)
        );
        setFilteredSalaries(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [searchQuery]);

    const generateReport = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString(); // Get the current date
    
        // Add custom title, subtitle, and date
        doc.setFontSize(28).setTextColor('red');
        doc.text("Wasana Auto Service", 60, 15); // Company name
        
        doc.setFontSize(20).setTextColor(0, 0, 0);
        doc.text("Employee Salary Report", 50, 25); // Report title
    
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
            head: [['ID', 'Name', 'From', 'To', 'Total OT Hours', 'Total OT Pay', 'Basic Salary', 'Total Salary']],
            body: filteredSalaries.map((employee, index) => [
                employee.EmpID,
                employee.employeeName,
                new Date(employee.fromDate).toLocaleDateString(), // Format date
                new Date(employee.toDate).toLocaleDateString(),   // Format date
                employee.totalOThours,
                employee.totalOTpay.toFixed(2),   // Format OT pay to 2 decimal places
                employee.BasicSalary.toFixed(2),  // Format basic salary to 2 decimal places
                employee.TotalSalary.toFixed(2),  // Format total salary to 2 decimal places
            ]),
            styles: { fontSize: 9 }, // Set font size for table
            headStyles: {
                fillColor: [31, 41, 55], // Dark gray header background
                textColor: [255, 255, 255], // White text color
                fontStyle: "bold",
            },
        });
    
        // Save the PDF with a file name including the date
        doc.save(`Employee-Salary-Report_${date}.pdf`);
    };
    

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8077/EmployeeSalary/${id}`)
                    .then(() => {
                        Swal.fire('Deleted!', 'The employee salary record has been deleted.', 'success');
                        setEmployeeSalary(employeeSalary.filter(e => e.EmpID !== id));
                        setFilteredSalaries(filteredSalaries.filter(e => e.EmpID !== id));
                    })
                    .catch((error) => {
                        Swal.fire('Error!', 'There was an issue deleting the record.', 'error');
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
                            onClick={toggleDarkMode}
                        >
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                        <button 
                            className="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                            onClick={generateReport}
                        >
                            Generate Report
                        </button>
                        <button class="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"  >
                                <Link to="/EmployeeSalary/create">Create Employee Salary</Link>
                             </button>
                    </div>
                </header>
    {/* Stats Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-6">
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
                </div>
                {/* Main Content */}
                <main className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-gray-200">Employee Salary List</div>
                        </div>
                        <div className="bg-white shadow-lg hover:shadow-xl rounded overflow-hidden">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="text-left p-2">Employee ID</th>
                                        <th className="text-left p-2">Name</th>
                                        <th className="text-left p-2">From</th>
                                        <th className="text-left p-2">To</th>
                                        <th className="text-left p-2">Total OT Hours</th>
                                        <th className="text-left p-2">Total OT Pay</th>
                                        <th className="text-left p-2">Basic Salary</th>
                                        <th className="text-left p-2">Total Salary</th>
                                        <th className="text-left p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSalaries.map((employee, index) => (
                                        <tr key={employee.EmpID} 
                                        className={index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : (darkMode ? 'bg-gray-800' : 'bg-white')}
                                        >
                                            <td className="p-2">{employee.EmpID}</td>
                                            <td className="p-2">{employee.employeeName}</td>
                                            <td className="p-2">{employee.fromDate}</td>
                                            <td className="p-2">{employee.toDate}</td>
                                            <td className="p-2">{employee.totalOThours}</td>
                                            <td className="p-2">{employee.totalOTpay}</td>
                                            <td className="p-2">{employee.BasicSalary}</td>
                                            <td className="p-2">{employee.TotalSalary}</td>
                                            <td className="p-2" style={styles.actionIcons}>
                                                <Link to={`/EmployeeSalary/edit/${employee._id}`} className="text-blue-500 hover:text-blue-700">
                                                    <AiOutlineEdit size={20} />
                                                </Link>
                                              <Link to={`/EmployeeSalary/delete/${employee._id}`} className="text-green-500 hover:text-green-700">
                                                    <MdOutlineDelete size={20} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ShowEmployeeSalary;
