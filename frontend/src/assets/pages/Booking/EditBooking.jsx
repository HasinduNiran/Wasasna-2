import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../Navbar/Navbar";
import Footer from "../footer/Footer";
import img1 from "../../images/bg02.jpg";

const EditBooking = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
  const [booking, setBooking] = useState({
    Booking_Date: "",
    Customer_Name: "",
    Vehicle_Type: "",
    Vehicle_Number: "",
    Contact_Number: "",
    Email: "",
    selectedPackage: "",
    selectedServices: [],
  });

  const [promotion, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [error, setError] = useState(null);

  // Fetch booking details by ID
  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8077/Booking/${id}`);
        const data = response.data;
        setBooking({
          ...data,
          Booking_Date: new Date(data.Booking_Date).toISOString().split("T")[0], // Ensure correct date format
        });
        setSelectedServices(data.selectedServices);
      } catch (error) {
        console.error("Error fetching the booking details!", error);
        setError("Failed to fetch booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  // Fetch packages (promotions)
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get("http://localhost:8077/Promotion");
        setPackages(response.data);
      } catch (error) {
        setError("Failed to fetch promotions.");
        console.error("Error fetching promotions", error);
      }
    };
    fetchPromotions();
  }, []);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8077/service");
        setServices(response.data.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to fetch services.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking((prevBooking) => ({
      ...prevBooking,
      [name]: value,
    }));
  };

  const handlePackageChange = (e) => {
    setBooking((prevBooking) => ({
      ...prevBooking,
      selectedPackage: e.target.value,
    }));
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedServices((selectedServices) => [...selectedServices, value]);
    } else {
      setSelectedServices((selectedServices) =>
        selectedServices.filter((service) => service !== value)
      );
    }
  };

  const validateForm = () => {
    const { Booking_Date, Customer_Name, Contact_Number, Vehicle_Number } = booking;
    const today = new Date().toISOString().split("T")[0];
    const vehicleNumberPattern = /^[A-Z]{2,3}-\d{4}$/;
    const customerNamePattern = /^[A-Za-z\s]+$/;
    const contactNumberPattern = /^0\d{9}$/;

    if (Booking_Date < today) {
      Swal.fire("Error", "Booking date must be today or a future date.", "error");
      return false;
    }

    if (!customerNamePattern.test(Customer_Name)) {
      Swal.fire("Error", "Customer name cannot contain numbers or special characters.", "error");
      return false;
    }

    if (!contactNumberPattern.test(Contact_Number)) {
      Swal.fire("Error", "Contact number must be a 10-digit number starting with 0.", "error");
      return false;
    }

    if (!vehicleNumberPattern.test(Vehicle_Number)) {
      Swal.fire("Error", "Vehicle number must start with 1-3 letters followed by 4 digits.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updatedBooking = {
        ...booking,
        selectedServices,
      };
      await axios.put(`http://localhost:8077/Booking/${id}`, updatedBooking);
      Swal.fire("Success", "Booking updated successfully!", "success");
      navigate("/Booking");
    } catch (error) {
      console.error("Error updating the booking!", error);
      Swal.fire("Error", "Failed to update booking. Please try again.", "error");
    } finally {
      setLoading(false);
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
      maxWidth: "240px",
      padding: "0px",
      height: "695px",
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="">
      <Navbar />
      <div style={styles.container}>
        <img src={img1} style={styles.image} alt="car" />
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Edit Booking</h2>
          <div style={styles.flex}>
            <input
              type="date"
              name="Booking_Date"
              value={booking.Booking_Date}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="Customer_Name"
              value={booking.Customer_Name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.flex}>
            <input
              type="text"
              name="Vehicle_Type"
              value={booking.Vehicle_Type}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="Vehicle_Number"
              value={booking.Vehicle_Number}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.flex}>
            <input
              type="text"
              name="Contact_Number"
              value={booking.Contact_Number}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="email"
              name="Email"
              value={booking.Email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Package Selection */}
          <div style={styles.flex}>
            <label>Package</label>
            <select
              name="selectedPackage"
              value={booking.selectedPackage}
              onChange={handlePackageChange}
              style={styles.input}
            >
              <option value="">Select Package</option>
              {promotion.map((promotion) => (
                <option key={promotion._id} value={promotion.promotionName}>
                  {promotion.title}
                </option>
              ))}
            </select>
          </div>

          {/* Includes Service Selection */}
          <div style={{ marginTop: "20px" }}>
            <label style={{ fontSize: "18px", marginBottom: "10px" }}>Includes:</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {services.map((service) => (
                <div key={service._id} style={{ flex: "1 1 45%" }}>
                  <input
                    type="checkbox"
                    id={service._id}
                    name="selectedServices"
                    value={service.Servicename}
                    checked={selectedServices.includes(service.Servicename)} // Ensure checkbox is checked if selected
                    onChange={handleServiceChange}
                  />
                  <label htmlFor={service._id} style={{ marginLeft: "10px" }}>
                    {service.Servicename} (${service.Price})
                  </label>
                </div>
              ))}
            </div>
          </div>

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
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditBooking;
