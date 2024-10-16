import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import img1 from "../../images/bg02.jpg";
import Swal from "sweetalert2";
import Navbar1 from "../Navbar/NavBar1";
import Footer from "../footer/Footer";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const CreateBooking = () => {
  const navigate = useNavigate();
  const { cusID } = useParams();
  const [disabledDates, setDisabledDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [pastBooks, setPastBooks] = useState([]);
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get("http://localhost:8077/Promotion");
        const response2 = await axios.get("http://localhost:8077/Booking");

        setPackages(response.data); // Assuming promotion data contains packages
        setPastBooks(response2.data);

        const bookedDates = response2.data.reduce((acc, bk) => {
          const date = dayjs(bk.Booking_Date).format("YYYY-MM-DD");
          acc[date] = acc[date] ? acc[date] + 1 : 1;
          return acc;
        }, {});

        setDisabledDates(bookedDates);
      } catch (error) {
        setError("Failed to fetch promotions or bookings.");
        console.error("Error fetching promotions or bookings", error);
      }
    };

    fetchPromotions();
  }, []);

  // Fetch services from API
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8077/service")
      .then((response) => {
        setServices(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (cusID) {
      fetchData();
    }
  }, [cusID]);

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

  const validateForm = () => {
    const {
      Booking_Date,
      Customer_Name,
      Contact_Number,
      Vehicle_Number,
      Email,
    } = booking;

    const today = new Date().toISOString().split("T")[0];
    const vehicleNumberPattern = /^[A-Z]{2,3}-\d{4}$/;
    const customerNamePattern = /^[A-Za-z\s]+$/;
    const contactNumberPattern = /^0\d{9}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (Booking_Date < today) {
      Swal.fire(
        "Error",
        "Booking date must be today or a future date.",
        "error"
      );
      return false;
    }

    if (!customerNamePattern.test(Customer_Name)) {
      Swal.fire(
        "Error",
        "Customer name cannot contain numbers or special characters.",
        "error"
      );
      return false;
    }

    if (!contactNumberPattern.test(Contact_Number)) {
      Swal.fire(
        "Error",
        "Contact number must be a 10-digit number starting with 0.",
        "error"
      );
      return false;
    }

    if (!vehicleNumberPattern.test(Vehicle_Number)) {
      Swal.fire(
        "Error",
        "Vehicle number must start with 1-3 letters followed by 4 digits.",
        "error"
      );
      return false;
    }

    if (!emailPattern.test(Email)) {
      Swal.fire("Error", "Please enter a valid email address.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const requestBody = {
        ...booking,
        Booking_Date: selectedDate ? selectedDate.format("YYYY-MM-DD") : "",
        selectedServices,
      };
      await axios.post("http://localhost:8077/Booking", requestBody);

      Swal.fire("Success", "Booking created successfully!", "success");
      navigate(`/ReadOneHome/${cusID}`);

      console.log(selectedServices);
      console.log(requestBody); // Redirect to the bookings list after creation
    } catch (error) {
      console.error("There was an error creating the booking!", error);
      Swal.fire(
        "Error",
        "Failed to create booking. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch customer data if cusID exists
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8077/Customer/${cusID}`
      );
      setBooking(response.data); // Update booking state with fetched data
    } catch (error) {
      console.error("There was an error fetching data!", error);
      Swal.fire("Error", "Failed to fetch data. Please try again.", "error");
    }
  };

  const shouldDisableDate = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    return disabledDates[formattedDate] >= 4; // Disable the date if it has 4 or more bookings
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

  return (
    <div className="">
      <Navbar1 />
      <div style={styles.container}>
        <img src={img1} style={styles.image} alt="car" />
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Create Booking</h2>
          <div style={styles.flex}>
            <div className="rounded-lg">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  shouldDisableDate={shouldDisableDate}
                  disablePast
                  sx={{
                    backgroundColor: "#333",
                    borderRadius: "10px",
                    marginTop: "20px",
                    border: "1px solid rgba(105, 105, 105, 0.397)",
                  }}
                />
              </LocalizationProvider>
            </div>

            <input
              type="text"
              name="Customer_Name"
              placeholder="Customer Name"
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
              placeholder="Vehicle Type"
              value={booking.Vehicle_Type}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="Vehicle_Number"
              placeholder="Vehicle Number"
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
              placeholder="Contact Number"
              value={booking.Contact_Number}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="email"
              name="Email"
              placeholder="Email"
              value={booking.Email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

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
                <option key={promotion._id} value={promotion.title}>
                  {promotion.title}
                </option>
              ))}
            </select>
          </div>

          {/* Includes Service Selection */}
          <div style={{ marginTop: "20px" }}>
            <label style={{ fontSize: "18px", marginBottom: "10px" }}>
              Includes:
            </label>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {services.map((service) => (
                <div key={service._id} style={{ flex: "1 1 45%" }}>
                  <input
                    type="checkbox"
                    id={service._id}
                    name="selectedServices"
                    value={service.Servicename}
                    onChange={(e) =>
                      setSelectedServices([
                        ...selectedServices,
                        service.Servicename,
                      ])
                    }
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
      <Footer />
    </div>
  );
};

export default CreateBooking;
