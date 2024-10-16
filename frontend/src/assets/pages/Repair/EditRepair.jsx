import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from "../../components/BackButton";
import img1 from '../../images/bg02.jpg';
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'

const EditRepair = () => {
  const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [vehicleMake, setVehicleMake] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [vehicleNo, setVehicleNo] = useState("");
    const [repairDescription, setRepairDescription] = useState("");
    const [repairStatus, setRepairStatus] = useState("");
    const [Insuranceprovider, setInsuranceprovider] = useState("");
    const [Agent, setAgent] = useState("");

    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate(); // Use useNavigate hook
    const { id } = useParams();

    useEffect(() => {
      setLoading(true);
      axios.get(`http://localhost:8077/Repair/${id}`)
          .then((response) => {
            const repair = response.data;
            setCustomerName(repair.customerName);
            setCustomerEmail(repair.customerEmail);
            setCustomerPhone(repair.customerPhone);
            setVehicleMake(repair.vehicleMake);
            setVehicleModel(repair.vehicleModel);
            setVehicleNo(repair.vehicleNo);
            setRepairDescription(repair.repairDescription);
            setRepairStatus(repair.repairStatus);
            setInsuranceprovider(repair.Insuranceprovider);
            setAgent(repair.Agent);
            setLoading(false);
          }).catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });
}, [id]);
const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
};

const handleEditRepair = (e) => {
  e.preventDefault(); 
  const data = {
    customerName,
    customerEmail,
    customerPhone,
    vehicleMake,
    vehicleModel,
    vehicleNo,
    repairDescription,
    repairStatus,
    Insuranceprovider,
    Agent,
  };
  setLoading(true);
      
  axios
        .put(`http://localhost:8077/Repair/${id}`, data)
        .then(() => {
            setLoading(false);
            navigate('/Repair'); // Navigate to /Employee after successful save
        })
        .catch((error) => {
            setLoading(false);
            console.log(error);
        });
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
      marginBottom: "45%",
      marginLeft: "-80%",
      position: "absolute",
  },
  image: {
      borderRadius: "30px",
      maxWidth: "240px",
      padding: "0px",
      height: "692px",
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
      <div style={styles.backButton}>
          <BackButton destination="/repair" />
      </div>
      <img src={img1} style={styles.image} alt="car" />
      <form onSubmit={handleEditRepair} style={styles.form}>
          <h2 style={styles.title}>Create Repair</h2>
          <div style={styles.flex}>
          <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              style={styles.input}
          />
          <input
              type="email"
              placeholder="Customer Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
              style={styles.input}
          />
          </div>
          <div style={styles.flex}>

          <input
              type="text"
              placeholder="Customer Phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              style={styles.input}
          />
          <input
              type="text"
              placeholder="Vehicle Make"
              value={vehicleMake}
              onChange={(e) => setVehicleMake(e.target.value)}
              required
              style={styles.input}
          />
          </div>
          <div style={styles.flex}>
          <input
              type="text"
              placeholder="Vehicle Model"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              required
              style={styles.input}
          />
          <input
              type="text"
              placeholder="Vehicle Number"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              required
              style={styles.input}
          />
          </div>
          <div style={styles.flex}>
          <input
              type="text"
              placeholder="Repair Description"
              value={repairDescription}
              onChange={(e) => setRepairDescription(e.target.value)}
              required
              style={styles.input}
          />
          <input
              type="text"
              placeholder="Repair Status"
              value={repairStatus}
              onChange={(e) => setRepairStatus(e.target.value)}
              required
              style={styles.input}
          />
          </div>
          <div style={styles.flex}>
          <input
              type="text"
              placeholder="Insurance Provider"
              value={Insuranceprovider}
              onChange={(e) => setInsuranceprovider(e.target.value)}
              required
              style={styles.input}
          />
          <input
              type="text"
              placeholder="Agent"
              value={Agent}
              onChange={(e) => setAgent(e.target.value)}
              required
              style={styles.input}
          />
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
  <Footer/>
  </div>
);
};


export default EditRepair