import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
import img1 from "../../images/bg02.jpg";
import BackButton from "../../components/BackButton";
import Navbar from "../Navbar/Navbar";
import Footer from "../footer/Footer";

function CreateServiceHistory() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [promotion, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [Email, setEmail] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [service, setService] = useState({
    cusID: "",
    Allocated_Employee: "",
    Vehicle_Number: "",
    Service_History: "",
    Service_Date: "",
    Milage: "",
    Email: "",
    Package: "",
    selectedServices: [],
    nextService: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          promotionsResponse,
          employeesResponse,
          servicesResponse,
          bookingsResponse,
          vehicleResponse,
        ] = await Promise.all([
          axios.get("http://localhost:8077/Promotion"),
          axios.get("http://localhost:8077/Employee"),
          axios.get("http://localhost:8077/service"),
          axios.get("http://localhost:8077/Booking"),
          axios.get("http://localhost:8077/Vehicle"),
        ]);

        setPackages(promotionsResponse.data);
        setEmployees(employeesResponse.data.data);
        setServices(servicesResponse.data.data);
        setBookings(bookingsResponse.data);
        setVehicles(vehicleResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setService((prev) => ({
        ...prev,
        selectedServices: checked
          ? [...prev.selectedServices, value]
          : prev.selectedServices.filter((item) => item !== value),
      }));
    } else {
      setService((prev) => ({ ...prev, [name]: value }));

      if (name === "Milage") {
        const milage = parseInt(value, 10);

        if (isNaN(milage) || milage <= 0) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Please enter a valid positive integer for mileage.",
            showConfirmButton: true,
          });
        } else {
          setService((prev) => ({ ...prev, nextService: milage + 5000 }));
        }
      }
    }
  };

  const handleVehicleSelect = (e) => {
    const selectedVehicleId = e.target.value;
    const selectedVehicle = vehicles.find(
      (vehicle) => vehicle.Register_Number === selectedVehicleId
    );

    if (selectedVehicle) {
      setService((prev) => ({
        ...prev,
        cusID: selectedVehicle.cusID,
        Vehicle_Number: selectedVehicleId,
        Customer_Name: selectedVehicle.Customer_Name,
        Customer_Email: selectedVehicle.Email,
        Milage: selectedVehicle.Milage,
        Package: selectedVehicle.selectedPackage,
        selectedServices: selectedVehicle.selectedServices || [],
        nextService: parseInt(selectedVehicle.Milage, 10) + 5000,
      }));
    }
  };

  const handlePackageChange = (e) => {
    const selectedPackage = e.target.value;
    setService((prev) => ({ ...prev, Package: selectedPackage }));
  };

  const sendEmailToCustomer = () => {
    const emailConfig = {
      serviceID: "service_3p901v6",
      templateID: "template_cwl7ahv",
      userID: "-r5ctVwHjzozvGIfg",
    };

    emailjs
    .send(
      emailConfig.serviceID,
      emailConfig.templateID,
      {
        to_email: service.Email,
        message: `Dear ${service.cusID}, 
  
        Thank you for using Wasana Service Management System.
        
        Vehicle Number: ${service.Vehicle_Number}
        Current Mileage: ${service.Milage} miles
        Next Service Due at: ${service.nextService} miles
  
        If you have any questions or need assistance, feel free to reach out to us.
  
        Best regards,
        Wasana Service Management Team`,
      },
      emailConfig.userID
    )
  
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Email Sent Successfully!",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Failed to send email.",
          text: error.message,
        });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (service.selectedServices.length === 0 && !service.Package) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Please select at least one service or a package.",
        showConfirmButton: true,
      });
      setLoading(false);
      return;
    }

    axios
      .post("http://localhost:8077/ServiceHistory", service)
      .then((response) => {
        navigate("/ServiceHistory");
        Swal.fire({
          icon: "success",
          title: "Service Created Successfully!",
          html: `Vehicle Number: ${service.Vehicle_Number}<br>
                Next Service: ${service.nextService}<br>
                Customer Email: ${service.Email}<br><br>
                Send Email to Customer?`,
          showCancelButton: true,
          confirmButtonText: "Yes, Send Email",
          cancelButtonText: "No, Close",
        }).then((result) => {
          if (result.isConfirmed) {
            sendEmailToCustomer();
          }
        });
      })
      .catch((error) => {
        console.error("Error creating service history:", error);
        setError("Error creating service history.");
        setLoading(false);
      });
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div className="mar">
          <BackButton destination="/ServiceHistory" />
        </div>
        <img src={img1} style={styles.image} alt="background" />
        <form style={styles.form} onSubmit={handleSubmit}>
          <h2 style={styles.title}>Add Service History</h2>

          <label>
            <select
              name="Vehicle_Number"
              value={service.Vehicle_Number}
              onChange={handleVehicleSelect}
              required
              style={styles.input}
            >
              <option value="">Select Vehicle Number</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle.Register_Number}>
                  {vehicle.Register_Number}
                </option>
              ))}
            </select>
          </label>

          <div style={styles.flex}>
            <label>
              <input
                type="text"
                name="Customer ID"
                placeholder="CusID"
                value={service.cusID}
                onChange={handleChange}
                required
                style={styles.input}
                readOnly
              />
            </label>

            <label>
              <input
                type="text"
                name="Email"
                placeholder="Email"
                value={service.Email}
                onChange={handleChange}
                required
                style={styles.input}
               
              />
            </label>

            <label>
              <select
                name="Allocated_Employee"
                value={service.Allocated_Employee}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee.employeeName}>
                    {employee.employeeName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={styles.flex}>
            <label>
              <input
                type="text"
                name="Service_History"
                placeholder="Service History"
                value={service.Service_History}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>
            <label>
              <input
                type="date"
                name="Service_Date"
                value={service.Service_Date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                max={new Date().toISOString().split("T")[0]}
                style={styles.input}
              />
            </label>
          </div>

          <div style={styles.flex}>
            <label>
              <input
                type="number"
                name="Milage"
                placeholder="Mileage"
                value={service.Milage}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>

            <select
              name="Package"
              value={service.Package}
              onChange={handlePackageChange}
              style={styles.input}
            >
              <option value="">Select Package</option>
              {promotion.map((packageItem) => (
                <option key={packageItem._id} value={packageItem.title}>
                  {packageItem.title}
                </option>
              ))}
            </select>

            <label>
              <input
                type="text"
                name="nextService"
                placeholder="Next Service"
                value={service.nextService}
                readOnly
                style={styles.input}
              />
            </label>
          </div>

          <div style={{ marginTop: "20px" }}>
            <label style={{ fontSize: "18px", marginBottom: "10px" }}>
              Includes:
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {services.map((serviceItem) => (
                <div key={serviceItem._id} style={{ flex: "1 1 45%" }}>
                  <input
                    type="checkbox"
                    id={serviceItem._id}
                    name="selectedServices"
                    value={serviceItem.Servicename}
                    checked={service.selectedServices.includes(
                      serviceItem.Servicename
                    )}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor={serviceItem._id}
                    style={{ marginLeft: "10px" }}
                  >
                    {serviceItem.Servicename} (${serviceItem.Price})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: '"Noto Sans", sans-serif',
  },
  form: {
    borderRadius: "30px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    maxWidth: "500px",
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
  error: {
    color: "red",
    fontSize: "0.875rem",
  },
  image: {
    borderRadius: "30px",
    maxWidth: "240px",
    padding: "0px",
    height: "680px",
    borderTopRightRadius: "0px",
    borderBottomRightRadius: "0px",
  },
  flex: {
    display: "flex",
    gap: "8px",
    marginTop: "15px",
  },
};

export default CreateServiceHistory;
