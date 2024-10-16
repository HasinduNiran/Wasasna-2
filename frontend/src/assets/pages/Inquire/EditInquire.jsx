import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import img1 from '../../images/bg02.jpg';
import BackButton from '../../components/BackButton';
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'

const EditInquire = () => {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Number, setNumber] = useState("");
  const [ServiceType, setServiceType] = useState("");
  const [Message, setMessage] = useState("");
  const [VehicleNumber, setVehicleNumber] = useState("");
  const [cusID, setcusID] = useState(null); // Initialize cusID with null to avoid errors on initial render

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Correctly use useParams()

  useEffect(() => {
    const fetchInquire = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8077/Inquire/${id}`);
        const inquire = response.data;
        setName(inquire.Name);
        setEmail(inquire.Email);
        setNumber(inquire.Number);
        setServiceType(inquire.ServiceType);
        setMessage(inquire.Message);
        setVehicleNumber(inquire.VehicleNumber);
        setLoading(false);
        setcusID(inquire.cusID);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchInquire();
  }, [id]);

  // No need for a separate fetchData function unless intended for different use
  useEffect(() => {
    if (cusID) {
      // Optional: fetchInquire(); // Uncomment if you want to refetch data on cusID change
    }
  }, [cusID]);

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
  

  const handleEditInquire = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = {
      Name,
      Email,
      Number,
      ServiceType,
      Message,
      VehicleNumber,
    };

    try {
      setLoading(true);
      await axios.put(`http://localhost:8077/Inquire/${id}`, data);
      setLoading(false);
      navigate(`/inquire/${cusID}`); // Correctly use cusID from useParams
    } catch (error) {
      setLoading(false);
      console.log('Error:', error);
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
    backButton: {
      marginBottom: "50%",
      marginLeft: "-80%",
      position: "absolute",
    },
    image: {
      borderRadius: "30px",
      maxWidth: "240px",
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

  return (
    <div className=''><Navbar/>
    <div style={styles.container}>
      
      <img src={img1} style={styles.image} alt="car" />
      <form onSubmit={handleEditInquire} style={styles.form}>
        <h2 style={styles.title}>Edit Inquire</h2>

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
          <select
            
            placeholder="Service Type"
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
      </form>
    </div>
    <Footer/>
    </div>
  );
};

export default EditInquire;
