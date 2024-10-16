import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import img1 from '../../images/bg02.jpg';
import NavBar1 from '../Navbar/NavBar1';
import Footer from '../footer/Footer';

const CreateInquire = () => {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Number, setNumber] = useState("");
  const [ServiceType, setServiceType] = useState("");
  const [Message, setMessage] = useState("");
  const [VehicleNumber, setVehicleNumber] = useState("");
  const { cusID } = useParams(); // Get customer ID from URL params

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const phonePattern = /^[0][0-9]{9}$/;
    const namePattern = /^[a-zA-Z\s]*$/;
    const emailPattern = /^[^\s@]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    const vehicleNumberPattern = /^(?=.*\d)([A-Za-z\d-]{1,8})$/; // Updated pattern to require at least one digit, and allow letters and hyphens, but max 10 characters
  
    if (!namePattern.test(Name) || Name.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Invalid Name",
        text: "Name can't contain numbers, special characters, or be empty.",
      });
      return false;
    }
  
    if (!emailPattern.test(Email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address. After '@', only letters are allowed.",
      });
      return false;
    }
  
    if (!phonePattern.test(Number)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Phone number should be a 10-digit number starting with 0.",
      });
      return false;
    }
  
    if (!ServiceType) {
      Swal.fire({
        icon: 'error',
        title: 'Service Type Not Selected',
        text: 'Please select a service type.',
      });
      return false;
    }
  
    if (!vehicleNumberPattern.test(VehicleNumber)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Vehicle Number",
        text: "Vehicle number must contain at least 4 digits up to 8. Don't keep space",
      });
      return false;
    }
  
    return true;
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = {
      Name,
      Email,
      Number,
      ServiceType,
      Message,
      VehicleNumber,
      cusID, // Include cusID in the data payload
    };

    setLoading(true);

    try {
      await axios.post("http://localhost:8077/Inquire", data);
      setLoading(false);
      navigate(`/ReadOneHome/${cusID}`); // Navigate to the customer's inquiries page
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit the inquiry.",
      });
    }
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
      maxWidth: "280px",
      padding: "0px",
      height: "658px",
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
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    title: {
      color: "#6c1c1d",
      fontSize: "30px",
      fontWeight: "600",
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
      width: "auto",
      cursor: "pointer",
      textDecoration: "none",
    },
    submitButtonHover: {
      backgroundColor: "#661003f5",
    },
    submitButton2: {
      border: "none",
      backgroundColor: "#6c1c1d",
      marginTop: "10px",
      marginLeft: "50%",
      outline: "none",
      padding: "10px",
      borderRadius: "10px",
      color: "#fff",
      fontSize: "16px",
      width: "auto",

      cursor: "pointer",
      textDecoration: "none",
    },
  };
  return (
    <div>
      <NavBar1 />
      <div style={styles.container}>
        <img src={img1} style={styles.image} alt="car" />
        <form onSubmit={handleSubmit} style={styles.form}>
          
          <h2 style={styles.title}>Create Inquire</h2>
         

          <input
            type="text"
            placeholder="Name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            value={Email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <div style={styles.flex}>
            <input
              type="text"
              placeholder="Number"
              value={Number}
              onChange={(e) => setNumber(e.target.value)}
              required
              style={styles.input}
            />
            <div>
              <select
                value={ServiceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
                style={styles.input}
              >
                <option value="" disabled>Select Service Type</option>
                <option value="Vehicle Service">Vehicle Service</option>
                <option value="Vehicle Repair">Vehicle Repair</option>
                <option value="Modification">Modification</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
          <input
            type="text"
            placeholder="Message"
            value={Message}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                setMessage(e.target.value);
              }
            }}
            required
            style={styles.input}
          />
          <p>{Message.length}/100</p>
          <input
            type="text"
            placeholder="Vehicle Number"
            value={VehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            required
            style={styles.input}
          />
          <button
            type="submit"
            style={styles.submitButton}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.submitButtonHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.submitButton.backgroundColor)
            }
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <Link to={`/inquire/${cusID}`} style={styles.submitButton2}>
          My Inquireis
          </Link>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateInquire;
