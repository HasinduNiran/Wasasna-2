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

const ShowApplicant = () => {
    // State initialization
    const [applicants, setApplicants] = useState([]);
    const [filteredApplicants, setFilteredApplicants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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

    // Initial fetch of Applicant data
    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:8077/applicant")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setApplicants(response.data);
                    setFilteredApplicants(response.data); // Set initial filtered applicants
                } else {
                    console.error("Unexpected response format:", response.data);
                    setApplicants([]); // Fallback to an empty array
                    setFilteredApplicants([]); // Fallback to an empty array
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching applicants:", error);
                setLoading(false);
                setApplicants([]); // Fallback to an empty array in case of error
                setFilteredApplicants([]); // Fallback to an empty array in case of error
            });
    }, []);

    // Search functionality
    const handleSearch = () => {
        const filtered = applicants.filter((applicant) =>
            applicant.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            applicant.LastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            applicant.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            applicant.Number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            applicant.JobType.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredApplicants(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [searchQuery]);
    const generateApplicantPDF = (applicants) => {
        const doc = new jsPDF(); // Initialize jsPDF document
        const tableColumn = [
            "No", "First Name", "Last Name", "Number", "Email", "Job Type"
        ]; // Define the columns for the PDF table
        const tableRows = [];

        // Loop through applicants and format the rows for the PDF
        applicants.forEach((applicant, index) => {
            const data = [
                index + 1,
                applicant.FirstName,
                applicant.LastName,
                applicant.Number,
                applicant.Email,
                applicant.JobType,
            ];
            tableRows.push(data); // Add each applicant's data as a row
        });

        const date = Date().split(" ");
        const dateStr = date[1] + "-" + date[2] + "-" + date[3]; // Format the current date

        // Set the title of the report
        doc.setFontSize(28).setFont("Mooli", "bold").setTextColor('red');
        doc.text("Wasana Auto Service", 60, 15); // Set the main title

        // Set report subtitle
        doc.setFont("helvetica", "normal").setFontSize(20).setTextColor(0, 0, 0);
        doc.text("Applicant Report", 65, 25); // Adjusted positioning

        // Add report generation date
        doc.setFont("times", "normal").setFontSize(15).setTextColor(100, 100, 100);
        doc.text(`Report Generated Date: ${dateStr}`, 65, 35); // Adjusted positioning

        // Add the company address or relevant info
        doc.setFont("courier", "normal").setFontSize(12).setTextColor(150, 150, 150);
        doc.text("Wasana Auto Service, Colombo 4", 30, 45);

        // Add a separator line for better visual structure
        doc.setFont("courier", "normal").setFontSize(12).setTextColor(150, 150, 150);
        doc.text(
            "--------------------------------------------------------------------------------------------------",
            0,
            50
        );

        // Add the table for applicant details
        doc.autoTable({
            startY: 55, // Start the table after the header content
            margin: { left: 20, right: 20 }, // Add side margins for the table
            head: [tableColumn], // Table column headers
            body: tableRows, // Table rows (applicant data)
            styles: { fontSize: 9 }, // General table font size
            headStyles: {
                fillColor: [31, 41, 55], // Header background color
                textColor: [255, 255, 255], // Header text color
                fontStyle: "bold", // Bold header
            },
        });

        // Save the generated PDF with the formatted date in the filename
        doc.save(`Applicant-Report_${dateStr}.pdf`);
    };



    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8077/applicant/${id}`)
                    .then(response => {
                        if (response.status === 200) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "The applicant has been deleted.",
                                icon: "success"
                            }).then(() => {
                                // Refresh the applicants after successful deletion
                                setApplicants(applicants.filter(applicant => applicant._id !== id));
                                setFilteredApplicants(filteredApplicants.filter(applicant => applicant._id !== id)); // Update filtered applicants
                            });
                        } else {
                            Swal.fire({
                                title: "Error!",
                                text: "Failed to delete applicant.",
                                icon: "error"
                            });
                        }
                    })
                    .catch(error => {
                        console.error("Error deleting applicant:", error);
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to delete applicant.",
                            icon: "error"
                        });
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
                                    {/* <span>Customer :</span> */}
                                </div>
                                <i className={`bx bx-chevron-${isCustomerOpen ? 'up' : 'down'} text-xl`}></i>
                            </li>
                            {/* {isCustomerOpen && (
                           // <ul className="ml-8">
                           //     <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                           //         <Link to="/Customer">Customer Details</Link>
                           //     </li>
                           //     <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                           //         <Link to="/feedback">Feedback</Link>
                           //     </li>
                           //     <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                           //         <Link to="/ServiceHistory">Service History</Link>
                           //     </li>
                           //     <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                           //         <Link to="/Repair">Repair</Link>
                           //     </li>
                           //     <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                           //         <Link to="/vehicles">Vehicle</Link>
                           //     </li>
                           //     <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                           //         <Link to="/Inquire">Inquire</Link>
                           //     </li>
                           // </ul>
                       )} */}

                            {/* Employee Details Dropdown */}
                            <li
                                className="text-gray-400 hover:bg-gray-700 hover:text-white p-3 flex items-center justify-between cursor-pointer"
                                onClick={() => setIsEmployeeOpen(!isEmployeeOpen)}
                            >
                                <div className="flex items-center space-x-3">
                                    <i className="bx bx-id-card text-xl"></i>
                                    {/* <span>Employee :</span> */}
                                </div>
                                <i className={`bx bx-chevron-${isEmployeeOpen ? 'up' : 'down'} text-xl`}></i>
                            </li>
                            {/* {isEmployeeOpen && (
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
                       )} */}

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
                                        <Link to="/applicant">Applicant</Link>
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
                        <button class="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                            onClick={() => generateApplicantPDF(filteredApplicants)}
                        >
                            Generate Report
                        </button>
                        <button class="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"  >
                            <Link to="/applicant/create">Create Applicant</Link>
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

                {/* Table Section */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-gray-200">Applicant List</div>

                    </div>
                    <div className="bg-white shadow-lg hover:shadow-xl rounded overflow-hidden">
                        <table className="table table-auto min-w-full leading-normal">
                            <thead className="uppercase font-semibold text-xs text-gray-600 bg-gray-200">
                                <tr>
                                    <th className="text-left p-2">#</th>
                                    
                                    <th className="text-left p-2">First Name</th>
                                    <th className="text-left p-2">Last Name</th>
                                    <th className="text-left p-2">Number</th>
                                    <th className="text-left p-2">Email</th>
                                    <th className="text-left p-2">Job Type</th>
                                    <th className="text-left p-2">Cv</th>
                                    <th className="text-left p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplicants.map((applicant, index) => (
                                    <tr key={applicant._id} className="h-8" style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                                        <td className="p-2">{index + 1}</td>
                                     
                                        <td className="p-2">{applicant.FirstName}</td>
                                        <td className="p-2">{applicant.LastName}</td>
                                        <td className="p-2">{applicant.Number}</td>
                                        <td className="p-2">{applicant.Email}</td>
                                        <td className="p-2">{applicant.JobType}</td>
                                        {applicant.image && (
                                            <p>
                                                <strong>CV:</strong>{' '}
                                                <a href={applicant.image} target="_blank" rel="noopener noreferrer">
                                                    View CV
                                                </a>
                                            </p>
                                        )}
                                        <td className="p-2">
                                            <div style={styles.actionIcons}>
                                                <Link to={`/applicant/get/${applicant._id}`} className="text-green-800">
                                                    <BsInfoCircle />
                                                </Link>
                                                {/* <Link to={`/applicant/edit/${applicant._id}`} className="text-blue-500 hover:text-blue-700">
                                                    <AiOutlineEdit />
                                                </Link> */}
                                                <button
                                                    type="button"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleDelete(applicant._id)}
                                                >
                                                    <MdOutlineDelete />
                                                </button>
                                            </div>
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

export default ShowApplicant;
