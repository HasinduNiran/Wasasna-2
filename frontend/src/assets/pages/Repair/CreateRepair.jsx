import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import BackButton from "../../components/BackButton";
import img1 from '../../images/bg02.jpg';
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'
const CreateRepair = () => {
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [vehicleMake, setVehicleMake] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [vehicleNo, setVehicleNo] = useState("");
    const [repairDescription, setRepairDescription] = useState("");
    const [repairStatus, setRepairStatus] = useState("");
    const [insuranceProvider, setInsuranceProvider] = useState("");
    const [agent, setAgent] = useState("");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for customerName
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(customerName)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Name',
                text: 'Customer name cannot contain numbers or special characters.',
            });
            return;
        }

        // Validation for customerPhone
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(customerPhone)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Phone number should have 10 digits and must start with 0.',
            });
            return;
        }

        // Validation for vehicleNo
        const vehicleNoRegex = /^[a-zA-Z]{1,3}\d{4}$/;
        if (!vehicleNoRegex.test(vehicleNo)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Vehicle Number',
                text: 'Vehicle number must start with 1 to 3 letters and contain exactly 4 numbers.',
            });
            return;
        }

        const data = {
            customerName,
            customerEmail,
            customerPhone,
            vehicleMake,
            vehicleModel,
            vehicleNo,
            repairDescription,
            repairStatus,
            insuranceProvider,
            agent
        };

        setLoading(true);
        try {
            await axios.post('http://localhost:8077/Repair', data);
            setLoading(false);
            navigate('/Repair');
        } catch (error) {
            setLoading(false);
            console.error('Error:', error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to submit the form. Please check your inputs and try again.',
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
        <div className=""><Navbar/>
        <div style={styles.container}>
            <div style={styles.backButton}>
                <BackButton destination="/repair" />
            </div>
            <img src={img1} style={styles.image} alt="car" />
            <form onSubmit={handleSubmit} style={styles.form}>
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
                        value={insuranceProvider}
                        onChange={(e) => setInsuranceProvider(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Agent"
                        value={agent}
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
}

export default CreateRepair;
