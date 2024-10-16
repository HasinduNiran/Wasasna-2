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

const ShowAllVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCustomerOpen, setIsCustomerOpen] = useState(false);
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
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
        setLoading(true);
        axios
            .get('http://localhost:8077/Vehicle') // Replace with your actual API endpoint
            .then((response) => {
                setVehicles(response.data.data);
                setFilteredVehicles(response.data.data); // Initialize filtered data
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = vehicles.filter((vehicle) =>
            vehicle.Register_Number.toLowerCase().includes(query) ||
            vehicle.Make.toLowerCase().includes(query) ||
            vehicle.Model.toLowerCase().includes(query) ||
            vehicle.Owner.toLowerCase().includes(query)
        );
        setFilteredVehicles(filtered);
    };

    useEffect(() => {
        handleSearch({ target: { value: searchQuery } });
    }, [searchQuery]);

    const generateReport = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString(); // Current date for the report
    
        // Define table columns for vehicle data
        const tableColumn = [
            "No", 
            "Register Number", 
            "Make", 
            "Model", 
            "Year", 
            "Engine Details", 
            "Transmission", 
            "Color", 
            "Owner"
        ];
    
        // Map vehicle data to table rows, with an index for the 'No' column
        const tableRows = filteredVehicles.map((vehicle, index) => [
            index + 1,
            vehicle.Register_Number,
            vehicle.Make,
            vehicle.Model,
            vehicle.Year,
            vehicle.Engine_Details,
            vehicle.Transmission_Details,
            vehicle.Vehicle_Color,
            vehicle.Owner,
        ]);
    
        // Add report header and company details
        doc.setFontSize(28).setTextColor('red');
        doc.text("Wasana Auto Service", 60, 15); // Company name
    
        doc.setFontSize(20).setTextColor(0, 0, 0);
        doc.text("Vehicle Report", 70, 25); // Report title
    
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
    
        // Create and format the vehicle table
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
        doc.save(`Vehicle_Report_${date}.pdf`);
    };
    

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`http://localhost:8077/Vehicle/${id}`)
                    .then((response) => {
                        if (response.status === 200) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success",
                            }).then(() => {
                                setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
                                setFilteredVehicles(filteredVehicles.filter(vehicle => vehicle._id !== id));
                            });
                        } else {
                            Swal.fire({
                                title: "Error!",
                                text: "Failed to delete item.",
                                icon: "error",
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Error deleting item:", error);
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to delete item.",
                            icon: "error",
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
                        <span>Customer :</span>
                    </div>
                    <i className={`bx bx-chevron-${isCustomerOpen ? 'up' : 'down'} text-xl`}></i>
                </li>
                {isCustomerOpen && (
                    <ul className="ml-8">
                       
                        <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                            <Link to="/ServiceHistory">Service History</Link>
                        </li>
                        
                        <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                            <Link to="/vehicles">Vehicle</Link>
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
                                <Link to="/vehicles/create">Add Vehicle</Link>
                             </button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <i className="bx bx-bell text-xl"></i>
                        <div className="flex items-center space-x-2">
                            <img
                                src="https://randomuser.me/api/portraits/men/1.jpg"
                                alt="User"
                                className="w-8 h-8 rounded-full"
                            />
                            <span>John Doe</span>
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
                {/* Content */}
                <main className={`p-6  overflow-y-scroll  ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`} style={{width:"100%"}}>
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-2 px-4 border-b">#</th>
                                <th className="py-2 px-4 border-b">Image</th>
                                <th className="py-2 px-4 border-b">Register Number</th>
                                <th className="py-2 px-4 border-b">Make</th>
                                <th className="py-2 px-4 border-b">Model</th>
                                <th className="py-2 px-4 border-b">Year</th>
                                <th className="py-2 px-4 border-b">Engine Details</th>
                                <th className="py-2 px-4 border-b">Transmission</th>
                                <th className="py-2 px-4 border-b">Color</th>
                                <th className="py-2 px-4 border-b">Owner</th>
                                <th className="py-2 px-4 border-b">Username</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVehicles.map((vehicle, index) => (
                                <tr key={vehicle._id} 
                                className={index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : (darkMode ? 'bg-gray-800' : 'bg-white')}
                                >
                                    <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                                    <td className='border px-4 py-2 text-left'>
        {vehicle.image ? (
            <img 
                src={vehicle.image} 
                alt={vehicle.Register_Number} 
                className='w-20 h-20 object-cover' 
                style={styles.image}
                onError={(e) => { e.target.src = '/path/to/default-image.jpg'; }} // Fallback to default image
            />
        ) : (
            <img 
                src='/path/to/default-image.jpg' 
                alt='Default' 
                className='w-20 h-20 object-cover' 
            />
        )}
    </td>
                                    <td className="py-2 px-4 border-b text-center">{vehicle.Register_Number}</td>
                                    <td className="py-2 px-4 border-b text-center">{vehicle.Make}</td>
                                    <td className="py-2 px-4 border-b text-center">{vehicle.Model}</td>
                                    <td className="py-2 px-4 border-b text-center">{vehicle.Year}</td>
                                    <td className="py-2 px-4 border-b text-center">{vehicle.Engine_Details}</td>
                                    <td className="py-2 px-4 border-b text-center">{vehicle.Transmission_Details}</td>
                                    <td className="py-2 px-4 border-b text-center">{vehicle.Vehicle_Color}</td>
                                    <td className="py-2 px-4 border-b text-center">{vehicle.Owner}</td>
                                    <td className="py-2 px-4 border-b text-center">{vehicle.cusID}</td>
                                    <td className="py-2 px-4 border-b text-center" style={styles.actionIcons}>
    <Link to={`/vehicles/${vehicle.Register_Number}`} title="View">
        <BsInfoCircle className="text-green-500 hover:text-green-700 text-xl" />
    </Link>
    <Link to={`/vehicles/edit/${vehicle._id}`} title="Edit">
        <AiOutlineEdit className="text-yellow-500 hover:text-yellow-700 text-xl" />
    </Link>
    <Link to={`/vehicles/delete/${vehicle._id}`} title="Delete">
        <MdOutlineDelete className="text-red-500 hover:text-red-700 text-xl" />
    </Link>
</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </div>
        </div>
    );
};

export default ShowAllVehicles;
