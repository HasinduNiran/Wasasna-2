import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
import BackButton from "../../components/BackButton";
import img1 from '../../images/bg02.jpg';
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/Footer';

const CreatePromotion = () => {
  const [promotion, setPromotion] = useState({
    title: "",
    description: "",
    discount: '',
    includes: [],
    startDate: "",
    endDate: "",
    Percentage: 0,
  });
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]); // Added customer state
  const navigate = useNavigate();

  // Fetch services from API
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8077/service')
      .then((response) => {
        setServices(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
        setLoading(false);
      });

    // Fetch customers from API
    axios.get('http://localhost:8077/customer')
      .then((response) => {
        setCustomers(response.data);
        console.log(response.data) // Store fetched customers
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: value,
    }));
  };

  const handleServiceSelect = (serviceName, servicePrice) => {
    let updatedSelectedServices = [];

    if (selectedServices.some(service => service.name === serviceName)) {
      updatedSelectedServices = selectedServices.filter(service => service.name !== serviceName);
    } else {
      updatedSelectedServices = [...selectedServices, { name: serviceName, price: servicePrice }];
    }

    setSelectedServices(updatedSelectedServices);

    const totalPrice = updatedSelectedServices.reduce((sum, service) => sum + service.price, 0);
    setTotalAmount(totalPrice);

    const discountedPrice = totalPrice - (totalPrice * (percentage / 100));

    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      discount: discountedPrice.toFixed(2),
    }));
  };

  const handlePercentageChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPercentage(value);

    const discountedPrice = totalAmount - (totalAmount * (value / 100));
    setPromotion((prevPromotion) => ({
      ...prevPromotion,
      Percentage: value,
      discount: discountedPrice.toFixed(2),
    }));
  };



  const sendPromotionEmail = (promotion) => {

    const emailConfig = {
      serviceID: "service_3p901v6",
      templateID: "template_cwl7ahv",
      userID: "-r5ctVwHjzozvGIfg",
    };

    customers.forEach((customer) => {
      console.log(`Sending email to ${customer.email}...`);
      emailjs
        .send(
          emailConfig.serviceID,
          emailConfig.templateID,
          {
            to_email: `${customer.email}`,
            subject: `New Promotion: ${promotion.title}`,
            message: `
              Hello ${customer.firstName},
              
              We are excited to announce a new promotion:
              - Promotion Title: ${promotion.title}
              - Percentage: ${promotion.Percentage}% off
              - Description: ${promotion.description}
              - Valid Until: ${promotion.endDate}
              
              Don't miss out! Take advantage of this offer before it expires.

              Best regards,
              Wasana Service centere
            `,
          },
          emailConfig.userID
        )
        .then(() => {
          console.log(`Email sent successfully to ${customer.email}`);
        })
        .catch((error) => {
          console.error(`Error sending email to ${customer.email}:`, error);
        });
    });

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Promotion emails sent to all customers!",
      showConfirmButton: true,
      timer: 2000,
    });
  };

  const handleSendPromotionEmails = (promotion) => {
    Swal.fire({
      title: "Send Promotion Emails?",
      text: "Do you want to send this promotion to all customers?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, send it",
      cancelButtonText: "No, skip",
    }).then((result) => {
      if (result.isConfirmed) {
        sendPromotionEmail(promotion);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8077/Promotion', {
        ...promotion,
        includes: selectedServices.map(s => s.name),
        Percentage: percentage
      });

      Swal.fire({
        title: "Success!",
        text: "Promotion added successfully.",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          handleSendPromotionEmails(promotion);
        }
      });

      setPromotion({
        title: "",
        description: "",
        discount: '',
        includes: [],
        startDate: "",
        endDate: "",
        Percentage: 0,
      });
      setSelectedServices([]);
      setTotalAmount(0);
      setPercentage(0);
      navigate('/Promotion');
    } catch (error) {
      console.error("There was an error creating the promotion!", error);
      Swal.fire({
        title: "Error",
        text: "Failed to create promotion. Please try again.",
        icon: "error",
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
    <div className=""><Navbar />
      <div style={styles.container}>
        <div style={styles.backButton}>
          <BackButton destination="/promotion" />
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Create Promotion</h2>
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
                    backgroundColor: selectedServices.some(s => s.name === service.Servicename) ? 'red' : 'gray',
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
              min={new Date().toISOString().split("T")[0]} // Set the min attribute to today
            />
            <input
              type="date"
              name="endDate"
              value={promotion.endDate.slice(0, 10)} // Convert to YYYY-MM-DD format
              onChange={handleChange}
              required
              style={styles.input}
              // Set the min value of endDate to be one day after startDate or today + 1 day
              min={promotion.startDate
                ? new Date(new Date(promotion.startDate).setDate(new Date(promotion.startDate).getDate() + 1))
                  .toISOString().split("T")[0]
                : new Date(new Date().setDate(new Date().getDate() + 1))
                  .toISOString().split("T")[0]}
            />
          </div>


          <div style={styles.flex}>
            <label>Percentage:</label>
            <input
              type="number"
              placeholder="Percentage Discount"
              value={percentage}
              onChange={handlePercentageChange}
              style={styles.input}
            />


            <input
              type="number"
              placeholder="Discount"
              name="discount"
              value={promotion.discount}
              onChange={handleChange}
              required
              style={styles.input}
              readOnly
            />
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
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePromotion;
