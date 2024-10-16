import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert for error handling
import BackButton from '../../components/BackButton';
import img1 from '../../images/bg02.jpg';
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/Footer';
import { FaStar } from "react-icons/fa";

function EditFeedback() {
    const { id } = useParams(); // Get the feedback ID from the route parameters
    const navigate = useNavigate();
    const [starRating, setStarRating] = useState(0); // Start with 0 stars selected
    const [employees, setEmployees] = useState([]); // State to hold employee list

    const [feedback, setFeedback] = useState({
        cusID: '',
        name: '',
        email: '',
        phone_number: '',
        employee: '',
        message: '',
        star_rating: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch feedback details and employees
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get(`http://localhost:8077/feedback/${id}`);
                setFeedback(response.data);
                setStarRating(response.data.star_rating); // Set star rating from the fetched data
                setLoading(false);
            } catch (error) {
                console.error('Error fetching feedback:', error);
                setError('Error fetching feedback.');
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [id]);

    // Fetch employee options
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:8077/employee");
                const employees = response.data.data || [];
                const employeeOptions = employees.map((emp) => ({
                    value: emp.FirstName, // Ensure you're mapping the correct employee property
                    label: `${emp.employeeName}`, // Assuming employeeName is available
                }));
                setEmployees(employeeOptions); // Fixed: Use setEmployees instead of setEmployeeOptions
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeedback({
            ...feedback,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const feedbackToSubmit = {
            ...feedback,
            star_rating: starRating, // Include the updated star rating in the final submission
        };

        axios
            .put(`http://localhost:8077/feedback/${id}`, feedbackToSubmit)
            .then((response) => {
                console.log('Feedback updated:', response.data);
                navigate(`/feedback/get/${feedback.cusID}`); // Redirect after update
            })
            .catch((error) => {
                console.error('Error updating feedback:', error);
                setError('Error updating feedback.');
                setLoading(false);
            });
    };

    const handleStarClick = (index) => {
        const rating = index + 1;
        setStarRating(rating); // Update the local star rating
    };

    const handleStarHover = (index) => {
        setStarRating(index + 1); // Update star rating based on hover index
    };

    const renderStars = () => {
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                {[...Array(5)].map((_, index) => (
                    <FaStar
                        key={index}
                        className={index < starRating ? "star-filled" : "star-empty"}
                        onMouseOver={() => handleStarHover(index)}
                        onClick={() => handleStarClick(index)}
                        style={{
                            ...styles.star,
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
        backButton: {
          marginBottom: "50%",
          marginLeft: "-80%",
          position: "absolute",
        },
        image: {
          borderRadius: "30px",
          maxWidth: "240px",
          padding: "0px",
          height: "633px",
          borderTopRightRadius: "0px",
          borderBottomRightRadius: "0px",
        },
        form: {
          borderRadius: "30px",
          backgroundColor: "#1a1a1a",
          color: "#fff",
          maxWidth: "450px",
          padding: "20px",
          height: "auto",
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
        },
        title: {
          color: "#6c1c1d",
          fontSize: "30px",
          fontWeight: "600",
          paddingLeft: "30px",
          position: "relative",
          display: "flex",
          alignItems: "center",
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
        },
        flex: {
          display: "flex",
          gap: "8px",
          marginTop: "15px",
        },
        submitButton: {
          border: "none",
          backgroundColor: "#6c1c1d",
          marginTop: "10px",
          outline: "none",
          padding: "10px",
          borderRadius: "10px",
          color: "#fff",
          fontSize: "16px",
          width: "100%",
          cursor: "pointer",
        },
        submitButtonHover: {
          backgroundColor: "#661003f5",
        },
      };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className=''>
            <Navbar />
            <div style={styles.container}>
                
                <img src={img1} style={styles.image} alt="car" />
                <form onSubmit={handleSubmit} style={styles.form}>
                    <h2 style={styles.title}>Edit Feedback</h2>
                    <div style={styles.flex}>
                        <input
                            type="text"
                            name="cusID"
                            placeholder="Customer ID"
                            value={feedback.cusID}
                            onChange={handleChange}
                            readOnly
                            required
                            style={styles.input}
                        />
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={feedback.name}
                            onChange={handleChange}
                            readOnly
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.flex}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={feedback.email}
                            onChange={handleChange}
                            readOnly
                            required
                            style={styles.input}
                        />
                        <input
                            type="text"
                            name="phone_number"
                            placeholder="Phone Number"
                            value={feedback.phone_number}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.flex}>
                        {/* Employee selection dropdown */}
                        <select
                            name="employee"
                            value={feedback.employee}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        >
                            <option value="" disabled>Select Employee</option>
                            {employees.map((employee) => (
                                <option key={employee.value} value={employee.value}>
                                    {employee.label}
                                </option>
                            ))}
                        </select>
                        <div>
                            <label>Star Rating</label>
                            <div>{renderStars()}</div>
                        </div>
                    </div>
                
                    <textarea
                        name="message"
                        placeholder="Message"
                        maxLength={100}
                        value={feedback.message}
                        onChange={handleChange}
                        required
                        style={{ ...styles.input, height: '100px' }}
                    />
                    <p>Upto 100 characters</p>
                    <button
                        type="submit"
                        style={styles.submitButton}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = styles.submitButtonHover.backgroundColor)
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor)
                        }
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default EditFeedback;
