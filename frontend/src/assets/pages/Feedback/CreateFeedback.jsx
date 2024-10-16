import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import img1 from '../../images/bg02.jpg';
import NavBar1 from '../Navbar/NavBar1';
import Footer from '../footer/Footer';
import { FaStar } from "react-icons/fa";

function CreateFeedback() {
    const navigate = useNavigate();
    const { cusID } = useParams();
    const [cussID, setcussID] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhone] = useState("");
    const [employee, setEmployee] = useState("");
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [message, setMessage] = useState("");
    const [starRating, setStarRating] = useState(0); // For star rating
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch customer data by cusID
    useEffect(() => {
        console.log("cusID from URL:", cusID); // Debug log
    
        if (cusID) {
            setLoading(true);
            axios
                .get(`http://localhost:8077/customer/${cusID}`)
                .then((response) => {
                    const data = response.data;
                    setcussID(data.cusID);
                    setName(`${data.firstName} ${data.lastName}`);
                    setEmail(data.email);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.error("Error fetching customer data:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Unable to fetch customer data.",
                        icon: "error",
                    });
                });
        }
    }, [cusID]);

    // Fetch employee options
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:8077/employee");
                const employees = response.data.data || [];
                const employeeOptions = employees.map((emp) => ({
                    value: emp.FirstName,
                    label: `${emp.employeeName} `,
                }));
                setEmployeeOptions(employeeOptions);
            } catch (error) {
                console.error("Error fetching employees:", error);
                Swal.fire({
                    title: "Error",
                    text: "Unable to fetch employee data. Please try again.",
                    icon: "error",
                });
            }
        };

        fetchEmployees();
    }, []);

    const validateForm = () => {
        const phoneNumberRegex = /^0\d{9}$/;
        const nameRegex = /^[A-Za-z\s]+$/;

        if (!phoneNumberRegex.test(phone_number)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Phone number must contain exactly 10 digits and start with 0.',
            });
            return false;
        }

        if (!nameRegex.test(name)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Name',
                text: 'Name cannot contain numbers or special characters.',
            });
            return false;
        }

        if (message.length > 100) {
            Swal.fire({
                icon: 'error',
                title: 'Message too long',
                text: 'Message cannot exceed 100 characters.',
            });
            return false;
        }

        if (starRating === 0) { // Check if star rating is not selected
            Swal.fire({
                icon: 'error',
                title: 'No Star Rating',
                text: 'Please provide a star rating before submitting your feedback.',
            });
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 

        if (!validateForm()) {
            return;
        }

        const feedbackData = {
            cusID,
            name,
            email,
            phone_number,
            employee,
            message,
            star_rating: starRating,
        };

        setLoading(true);
        axios
            .post("http://localhost:8077/feedback", feedbackData)
            .then(() => {
                setLoading(false);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Feedback submitted successfully!",
                    showConfirmButton: true,
                    timer: 2000,
                });
                navigate(`/Readonehome/${cusID}`);
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error submitting feedback:", error);
                Swal.fire({
                    title: "Error",
                    text: "An error occurred while submitting feedback.",
                    icon: "error",
                });
            });
    };

    const handleStarClick = (index) => {
        setStarRating(index + 1);
    };

    const renderStars = () => {
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                {[...Array(5)].map((_, index) => (
                    <FaStar
                        key={index}
                        className={index < starRating ? "star-filled" : "star-empty"}
                        onClick={() => handleStarClick(index)}
                        style={{
                            color: index < starRating ? "yellow" : "gray",
                            height: "25px", width: "25px",
                        }}
                    />
                ))}                   
            </div>
        );
    };

    const styles = {
        container: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "20px",
            fontFamily: '"Noto Sans", sans-serif',
        },
        image: {
            borderRadius: "30px",
            maxWidth: "240px",
            padding: "0px",
            height: "725px",
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
          },
        form: {
            borderRadius: "30px",
            backgroundColor: "#1a1a1a",
            color: "#fff",
            maxWidth: "550px",
            padding: "20px",
            height: "auto",
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
        },
        input: {
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid rgba(105, 105, 105, 0.397)",
            borderRadius: "10px",
            fontSize: "1rem",
            padding: "15px 8px",
            outline: "0",
            width: "100%",
            marginTop: "20px",
            marginBottom: "20px",
        }, submitContainer: {
            display: "flex",
            justifyContent: "space-between", // Align buttons on the same line
            marginTop: "20px",
        }, 
        submitButton: {
            border: "none",
            backgroundColor: "#6c1c1d",
            outline: "none",
            padding: "10px",
            borderRadius: "10px",
            color: "#fff",
            fontSize: "16px",
            width: "48%", // Set width for both buttons to align properly
            cursor: "pointer",
        },
        linkButton: {
            textDecoration: "none",
            backgroundColor: "#6c1c1d",
            color: "#fff",
            padding: "10px",
            borderRadius: "10px",
            fontSize: "16px",
            width: "48%", // Set width for both buttons to align properly
            textAlign: "center",
        },
        label: {
            color: '#fff',
            fontSize: '18px',
            marginBottom: '10px',
        },
    };

    return (
        <div>
            <NavBar1 />
            <div style={styles.container}>
            <img src={img1} style={styles.image} alt="car" />
            <form onSubmit={handleSubmit} style={styles.form}>
                    <h2 style={{ color: "#6c1c1d", fontSize: "30px", fontWeight: "600" }}>Create Feedback</h2>
                    <input
                        type="text"
                        value={name}
                        readOnly
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                        placeholder="Name"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        readOnly
                        placeholder="Email"
                    />
                    <input
                        type="text"
                        value={phone_number}
                        onChange={(e) => setPhone(e.target.value)}
                        style={styles.input}
                        placeholder="Phone Number"
                    />
                    <select
                        value={employee}
                        onChange={(e) => setEmployee(e.target.value)}
                        style={styles.input}
                    >
                        <option value="" disabled>Select an employee</option>
                        {employeeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <label style={styles.label}>Star Rating:</label>
                    {renderStars()}
                    
                    <textarea
                        value={message}
                        maxLength={100}
                        onChange={(e) => setMessage(e.target.value)}
                        style={styles.input}
                        placeholder="Message"
                        required
                    />
                    <p>Upto 100 Charcters</p>
                    <div style={styles.submitContainer}>
                        <button type="submit" style={styles.submitButton}>
                            Submit Feedback
                        </button>
                        <Link to={`/feedback/get/${cusID}`}
                                 style={styles.linkButton}>
                            View My Feedbacks
                        </Link>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default CreateFeedback;
