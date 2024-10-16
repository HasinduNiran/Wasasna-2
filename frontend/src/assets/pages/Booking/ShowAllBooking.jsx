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

const ShowBooking = () => {
    // State initialization
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
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

    // Initial fetch of Booking data
    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:8077/Booking')
            .then((response) => {
                setBookings(response.data);
                setFilteredBookings(response.data); // Initialize filtered bookings
                setLoading(false);
            })
            .catch((error) => {
                console.error("There was an error fetching the bookings!", error);
                setLoading(false);
            });
    }, []);

    // Search functionality
   // Search functionality
   const handleSearch = () => {
    const filtered = bookings.filter((booking) => {
        const bookingId = booking.Booking_Id?.toLowerCase() || "";
        const customerName = booking.Customer_Name?.toLowerCase() || "";
        const email = booking.Email?.toLowerCase() || "";
        const vehicleNumber = booking.Vehicle_Number?.toLowerCase() || "";
        const vehicleType = booking.Vehicle_Type?.toLowerCase() || "";
        const contactNumber = booking.Contact_Number || ""; // No need for lowercase since it's a number
        const status = booking.status?.toLowerCase() || "";
        const selectedPackage = booking.selectedPackage?.toLowerCase() || "";
        const selectedServices = booking.selectedServices?.join(", ").toLowerCase() || "";

        return (
            bookingId.includes(searchQuery.toLowerCase()) ||
            customerName.includes(searchQuery.toLowerCase()) ||
            email.includes(searchQuery.toLowerCase()) ||
            vehicleNumber.includes(searchQuery.toLowerCase()) ||
            vehicleType.includes(searchQuery.toLowerCase()) ||
            contactNumber.includes(searchQuery.toLowerCase()) ||
            status.includes(searchQuery.toLowerCase()) ||
            selectedPackage.includes(searchQuery.toLowerCase()) ||
            selectedServices.includes(searchQuery.toLowerCase())
        );
    });

    setFilteredBookings(filtered);
};

    useEffect(() => {
        handleSearch();
    }, [searchQuery]);

    const generateBookingPDF = (bookings) => {
        const doc = new jsPDF(); // Initialize jsPDF document
        const tableColumn = [
            "Booking ID", "Booking Date", "Customer Name", "Vehicle Type", "Vehicle Number",
            "Contact Number", "Email", "Selected Package", "Selected Services", "Status"
        ]; // Define the columns for the PDF table
        const tableRows = [];
    
        // Loop through bookings and format the rows for the PDF
        bookings.forEach((booking) => {
            const data = [
                booking.Booking_Id,
                new Date(booking.Booking_Date).toLocaleDateString(),
                booking.Customer_Name,
                booking.Vehicle_Type,
                booking.Vehicle_Number,
                booking.Contact_Number,
                booking.Email,
                booking.selectedPackage,
                booking.selectedServices.join(", "), // Join services into a single string
                booking.status // Add booking status
            ];
            tableRows.push(data); // Add each booking's data as a row
        });
    
        const date = Date().split(" ");
        const dateStr = date[1] + "-" + date[2] + "-" + date[3]; // Format the current date
    
        // Add the report title with consistent font and color
        doc.setFontSize(28).setFont("Mooli", "bold").setTextColor('red');
        doc.text("Wasana Auto Service", 60, 15); // Set the main title
    
        // Add the report subtitle
        doc.setFont("helvetica", "normal").setFontSize(20).setTextColor(0, 0, 0);
        doc.text("Booking Report", 65, 25); // Adjusted positioning for the subtitle
    
        // Add the report generation date
        doc.setFont("times", "normal").setFontSize(15).setTextColor(100, 100, 100);
        doc.text(`Report Generated Date: ${dateStr}`, 65, 35); // Adjusted positioning for the date
    
        // Add the company address or relevant info
        doc.setFont("courier", "normal").setFontSize(12).setTextColor(150, 150, 150);
        doc.text("Wasana Auto Service, Colombo 4", 30, 45); // Company information
    
        // Add a separator line for better visual structure
        doc.setFont("courier", "normal").setFontSize(12).setTextColor(150, 150, 150);
        doc.text(
            "--------------------------------------------------------------------------------------------------",
            0,
            50
        );
    
        // Add the table for booking details with adjusted margins
        doc.autoTable({
            startY: 55, // Start the table after the header content
            margin: { left: 20, right: 20 }, // Add side margins for the table
            head: [tableColumn], // Table column headers
            body: tableRows, // Table rows (booking data)
            styles: { fontSize: 9 }, // General table font size
            headStyles: {
                fillColor: [31, 41, 55], // Header background color
                textColor: [255, 255, 255], // Header text color
                fontStyle: "bold", // Bold header
            },
        });
    
        // Save the generated PDF with the formatted date in the filename
        doc.save(`Booking-Report_${dateStr}.pdf`);
    };
    
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                await axios.delete(`http://localhost:8077/Booking/${id}`);
                setBookings(bookings.filter((booking) => booking._id !== id));
                setFilteredBookings(filteredBookings.filter((booking) => booking._id !== id));
                alert("Booking deleted successfully!");
            } catch (error) {
                console.error("There was an error deleting the booking!", error);
                alert("Failed to delete booking. Please try again.");
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:8077/Booking/${id}/status`, { status: newStatus });
            setBookings(bookings.map((booking) =>
                booking._id === id ? { ...booking, status: newStatus } : booking
            ));
            setFilteredBookings(filteredBookings.map((booking) =>
                booking._id === id ? { ...booking, status: newStatus } : booking
            ));
        } catch (error) {
            console.error("Error updating status", error);
        }
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
                            className="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-red-500 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                            onClick={() => generateBookingPDF(filteredBookings)}
                        >
                            Generate Report
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    </div>
                </header>

                {/* Table Section */}
                
                <section className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>

                    {loading ? (
                        <Spinner />
                    ) : error ? (
                        <p className="text-red-500">Error: {error}</p>
                    ) : (
                        <table className={`min-w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                            <thead>
                                <tr className="bg-gray-800 text-white">
                                    <th className="py-2 px-4">ID</th>
                                    <th className="py-2 px-4">Date</th>
                                    <th className="py-2 px-4">Customer</th>
                                    <th className="py-2 px-4">Vehicle Type</th>
                                    <th className="py-2 px-4">Vehicle Number</th>
                                    <th className="py-2 px-4">Contact Number</th>
                                    <th className="py-2 px-4">Email</th>
                                    <th className="py-2 px-4">Package</th>
                                    <th className="py-2 px-4">Services</th>
                                    <th className="py-2 px-4">Status</th>
                                    <th className="py-2 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
    {filteredBookings.length > 0 ? (
        filteredBookings.map((booking, index) => (
            <tr
                key={booking._id}
                className={index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : (darkMode ? 'bg-gray-800' : 'bg-white')}
            >
                <td className="py-2 px-4">{booking.Booking_Id}</td>
                <td className="py-2 px-4">{new Date(booking.Booking_Date).toLocaleDateString()}</td>
                <td className="py-2 px-4">{booking.Customer_Name}</td>
                <td className="py-2 px-4">{booking.Vehicle_Type}</td>
                <td className="py-2 px-4">{booking.Vehicle_Number}</td>
                <td className="py-2 px-4">{booking.Contact_Number}</td>
                <td className="py-2 px-4">{booking.Email}</td>
                <td className="py-2 px-4">{booking.selectedPackage}</td>
                <td className="py-2 px-4">{booking.selectedServices.join(', ')}</td>
                <td className="py-2 px-4">
                    <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className={darkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </td>
                <td className="py-2 px-4">
                    <div style={styles.actionIcons}>
                        <Link to={`/Booking/edit/${booking._id}`}>
                            <AiOutlineEdit className="text-blue-500" />
                        </Link>
                        <MdOutlineDelete
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleDelete(booking._id)}
                        />
                        <Link to={`/Booking/get/${booking._id}`}>
                            <BsInfoCircle className="text-green-500" />
                        </Link>
                    </div>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="10" className="py-4 px-4 text-center text-red-500">
                No bookings found.
            </td>
        </tr>
    )}
</tbody>

                        </table>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ShowBooking;
