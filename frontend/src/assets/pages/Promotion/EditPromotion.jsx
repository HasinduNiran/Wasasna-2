import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import img1 from '../../images/bg02.jpg';
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'
const EditPromotion = () => {
  const { id } = useParams(); // Get the promotion ID from the URL
  const navigate = useNavigate();
  
  const [promotion, setPromotion] = useState({
    title: "",
    description: "",
    discount: 0,
    includes: [],  // Services included in the promotion
    startDate: "",
    endDate: "",
    Percentage: 0, // Percentage discount field
  });
  
  const [services, setServices] = useState([]);  // All available services
  const [selectedServices, setSelectedServices] = useState([]);  // Services selected in the form
  const [totalAmount, setTotalAmount] = useState(0);  // Total price of selected services
  const [percentage, setPercentage] = useState(0);  // Percentage discount

  useEffect(() => {
    // Fetch promotion details by ID
    const fetchPromotion = async () => {
      try {
        const response = await axios.get(`http://localhost:8077/Promotion/${id}`);
        const promotionData = response.data;
        setPromotion({
          ...promotionData,
          Percentage: promotionData.Percentage || 0,
          discount: promotionData.discount || 0,
        });
        setSelectedServices(
          promotionData.includes.map(service => ({ name: service, price: 0 })) // Initialize selected services
        );
        setTotalAmount(promotionData.totalAmount || 0); // Set total amount from promotion data
        setPercentage(promotionData.Percentage || 0); // Set percentage from promotion data
      } catch (error) {
        console.error("Error fetching the promotion!", error);
      }
    };

    // Fetch available services
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:8077/service");
        setServices(response.data.data);
      } catch (error) {
        console.error("Error fetching services!", error);
      }
    };

    fetchPromotion();
    fetchServices();
  }, [id]);

  useEffect(() => {
    // Update total amount and discount when services or percentage change
    const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
    setTotalAmount(totalPrice);

    const discountedPrice = totalPrice - (totalPrice * (percentage / 100));
    setPromotion(prevPromotion => ({
      ...prevPromotion,
      discount: discountedPrice.toFixed(2),
    }));
  }, [selectedServices, percentage]);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion(prevPromotion => ({
      ...prevPromotion,
      [name]: value,
    }));
  };

  // Handle service selection and recalculate discount
  const handleServiceSelect = (serviceName, servicePrice) => {
    const updatedSelectedServices = selectedServices.some(service => service.name === serviceName)
      ? selectedServices.filter(service => service.name !== serviceName)
      : [...selectedServices, { name: serviceName, price: servicePrice }];

    setSelectedServices(updatedSelectedServices);
  };

  // Handle percentage input change
  const handlePercentageChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPercentage(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:8077/Promotion/${id}`, {
        ...promotion,
        includes: selectedServices.map(s => s.name),
        Percentage: percentage, // Ensure the percentage is included in the request
      });
      alert("Promotion updated successfully!");
      navigate('/Promotion'); // Redirect after successful update
    } catch (error) {
      console.error("Error updating the promotion!", error);
      alert("Failed to update promotion. Please try again.");
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
   
    form: {
      borderRadius: "30px",
      backgroundColor: "#1a1a1a",
      color: "#fff",
      maxWidth: "450px",
      padding: "20px",
      height: "auto",
     
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
    includeButton: {
      padding: "10px",
      margin: "5px",
      borderRadius: "10px",
      cursor: "pointer",
    },
  };

  return (
    <div className=""><Navbar/>
    <div style={styles.container}>
      <div style={styles.backButton}>
        <BackButton destination="/promotion" />
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Edit Promotion</h2>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={promotion.title}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={promotion.description}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* Includes Service Selection */}
        <div style={styles.flex}>
          <label>Includes:</label>
          <div>
            {services.map(service => (
              <button
                key={service._id}
                type="button"
                style={{
                  ...styles.includeButton,
                  backgroundColor: selectedServices.some(s => s.name === service.Servicename) ? 'blue' : 'gray',
                  color: selectedServices.some(s => s.name === service.Servicename) ? 'white' : 'black',
                }}
                onClick={() => handleServiceSelect(service.Servicename, service.Price)}
              >
                {service.Servicename} (${service.Price})
              </button>
            ))}
          </div>
        </div>

        <div style={styles.flex}>
          <input
            type="date"
            name="startDate"
            value={promotion.startDate.slice(0, 10)} // Convert to YYYY-MM-DD format
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="date"
            name="endDate"
            value={promotion.endDate.slice(0, 10)} // Convert to YYYY-MM-DD format
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* Percentage Input */}
        <label>Percentage:</label>
        <input
          type="number"
          placeholder="Percentage Discount"
          value={percentage}
          onChange={handlePercentageChange}
          style={styles.input}
        />

        {/* Discount Field */}
        <input
          type="number"
          placeholder="Discount"
          name="discount"
          value={promotion.discount}
          onChange={handleChange}
          required
          style={styles.input}
          readOnly // Auto-calculated field
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
          Submit
        </button>
      </form>
    </div>
    <Footer/>
    </div>
  );
};

export default EditPromotion;
