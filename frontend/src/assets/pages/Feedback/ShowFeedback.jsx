import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from 'react-icons/md';
import { BsInfoCircle } from 'react-icons/bs';
import Swal from 'sweetalert2';
import CountUp from 'react-countup';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../images/logo.png';

const ShowFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        axios
            .get('http://localhost:8077/feedback')
            .then((response) => {
                setFeedbacks(response.data);
                setFilteredFeedbacks(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching feedbacks:', error);
                setError('Error fetching feedbacks.');
                setLoading(false);
            });
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:8077/feedback/${id}/status`, { status: newStatus });

            // Update the feedback list in the state
            setFeedbacks(feedbacks.map((feedback) =>
                feedback._id === id ? { ...feedback, status: newStatus } : feedback
            ));

            // Update the filtered feedback list if necessary
            setFilteredFeedbacks(filteredFeedbacks.map((feedback) =>
                feedback._id === id ? { ...feedback, status: newStatus } : feedback
            ));
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredFeedbacks = feedbacks.filter((feedback) => {
            return (
                feedback.cusID.toLowerCase().includes(query) ||
                feedback.name.toLowerCase().includes(query) ||
                feedback.email.toLowerCase().includes(query) ||
                feedback.phone_number.toLowerCase().includes(query) ||
                feedback.employee.toLowerCase().includes(query) ||
                feedback.message.toLowerCase().includes(query) ||
                feedback.status.toLowerCase().includes(query) ||
                String(feedback.star_rating).toLowerCase().includes(query)
            );
        });
        setFilteredFeedbacks(filteredFeedbacks);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            axios
                .delete(`http://localhost:8077/feedback/${id}`)
                .then(() => {
                    setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
                    setFilteredFeedbacks(filteredFeedbacks.filter(feedback => feedback._id !== id));
                })
                .catch((error) => {
                    console.error('Error deleting feedback:', error);
                    setError('Error deleting feedback.');
                });
        }
    };

    const generateReport = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();

        const tableColumn = [
            'Customer ID', 'Name', 'Email', 'Phone Number', 'Employee', 'Message', 'Star Rating'
        ];

        const tableRows = filteredFeedbacks.map(feedback => [
            feedback.cusID,
            feedback.name,
            feedback.email,
            feedback.phone_number,
            feedback.employee,
            feedback.message,
            feedback.star_rating
        ]);

        doc.setFontSize(28).setTextColor('red');
        doc.text("Wasana Auto Service", 60, 15);

        doc.setFontSize(20).setTextColor(0, 0, 0);
        doc.text("Feedback Report", 65, 25);

        doc.setFontSize(15).setTextColor(100, 100, 100);
        doc.text(`Report Generated Date: ${date}`, 65, 35);

        doc.setFontSize(12).setTextColor(150, 150, 150);
        doc.text("Wasana Auto Service, Colombo 4", 30, 45);

        doc.text(
            "---------------------------------------------------------------------------------------------------------------------------------------------",
            0,
            50
        );

        doc.autoTable({
            startY: 55,
            margin: { left: 20, right: 20 },
            head: [tableColumn],
            body: tableRows,
            styles: { fontSize: 9 },
            headStyles: {
                fillColor: [31, 41, 55],
                textColor: [255, 255, 255],
                fontStyle: "bold",
            },
        });

        doc.save(`Feedback_Report_${date}.pdf`);
    };

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            {/* Fixed Sidebar */}
            {sidebarOpen && (
                <aside className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white flex flex-col">
                    <div className="flex items-center justify-center h-16 bg-gray-800">
                        <img src={logo} alt="logo" style={{ width: '60px', height: '60px' }} />
                    </div>
                    <nav className="flex-1 overflow-y-auto">
                        <ul className="mt-2">

                            <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                <Link to="/feedback">Feedback</Link>
                            </li>
                            <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                                <Link to="/Inquire">Inquire</Link>
                            </li>
                        </ul>
                    </nav>
                    <div className="p-3">
                        <button className="w-full flex items-center p-3 bg-gray-800 rounded hover:bg-gray-700">
                            <i className="bx bx-cog text-xl"></i>
                            <Link to="/" className="ml-3">Logout</Link>
                        </button>
                    </div>
                </aside>
            )}

            {/* Main Content */}
            <div className="flex-1 ml-64 overflow-y-auto">
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
                            className="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full"
                            onClick={generateReport}
                        >
                            Generate Report
                        </button>
                        <button
                            className="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full"
                            onClick={toggleDarkMode}
                        >
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                        {/* <button className="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full">
                            <Link to="/feedback/create">Give Feedback</Link>
                        </button> */}
                    </div>
                </header>

                {/* Feedback Table */}
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Customer Feedbacks</h2>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="p-3">Customer ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Phone Number</th>
                                <th className="p-3">Employee</th>
                                <th className="p-3">Message</th>
                                <th className="p-3">Star Rating</th>
                                <th className="py-2 px-4">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFeedbacks.map((feedback, index) => (
                                <tr key={feedback._id} className={index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : (darkMode ? 'bg-gray-800' : 'bg-white')}>
                                    <td className="p-3 border-b">{feedback.cusID}</td>
                                    <td className="p-3 border-b">{feedback.name}</td>
                                    <td className="p-3 border-b">{feedback.email}</td>
                                    <td className="p-3 border-b">{feedback.phone_number}</td>
                                    <td className="p-3 border-b">{feedback.employee}</td>
                                    <td className="p-3 border-b">{feedback.message}</td>
                                    <td className="p-3 border-b">
                                        <CountUp start={0} end={feedback.star_rating} duration={1} />
                                    </td>
                                    <td className="p-3 border-b">
                                        <select
                                            value={feedback.status}
                                            onChange={(e) => handleStatusChange(feedback._id, e.target.value)}
                                            className={darkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">approved</option>
                                            <option value="declined">declined</option>
                                        </select>

                                    </td>
                                    <td className="p-3 border-b flex justify-around items-center">
                                        {/* <Link to={`/feedback/edit/${feedback._id}`} className="text-blue-500"><AiOutlineEdit /></Link> */}
                                        {/* <Link to={`/feedback/get/${feedback._id}`} className="text-green-500"><BsInfoCircle /></Link> */}
                                        <button onClick={() => handleDelete(feedback._id)} className="text-red-500"><MdOutlineDelete /></button>
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

export default ShowFeedback;
