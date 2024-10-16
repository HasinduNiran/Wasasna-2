import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import img1 from "../../images/bg02.jpg";
import BackButton from "../../components/BackButton";
import Navbar from "../Navbar/Navbar";
import Footer from "../footer/Footer";

function EditShowHistory() {
  const { id } = useParams(); // Get the id from route params
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [promotion, setPackages] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [service, setService] = useState({
    cusID: "",
    Customer_Name: "",
    Customer_Email: "",
    Allocated_Employee: "",
    Vehicle_Number: "",
    Service_History: "",
    Service_Date: "",
    Milage: "",
    Package: "",
    selectedServices: [],
    Booking_Id: "",
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
          vehicleResponse,
          serviceHistoryResponse,
        ] = await Promise.all([
          axios.get("http://localhost:8077/Promotion"),
          axios.get("http://localhost:8077/Employee"),
          axios.get("http://localhost:8077/service"),
          axios.get("http://localhost:8077/Vehicle"),
          axios.get(`http://localhost:8077/ServiceHistory/${id}`), // Fetch specific service history by ID
        ]);

        setPackages(promotionsResponse.data);
        setEmployees(employeesResponse.data.data);
        setServices(servicesResponse.data.data);
        setVehicles(vehicleResponse.data.data);
        setService(serviceHistoryResponse.data); // Pre-fill form with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleVehicleSelect = (e) => {
    const selectedVehicleId = e.target.value;
    const selectedVehicle = vehicles.find(
      (vehicle) => vehicle.Register_Number == selectedVehicleId
    );

    if (selectedVehicle) {
      setService((prev) => ({
        ...prev,
        cusID: selectedVehicle.cusID,
        Vehicle_Number: selectedVehicleId, // Update this according to your state key
        Customer_Name: selectedVehicle.Customer_Name,
        Customer_Email: selectedVehicle.Email,
        Milage: selectedVehicle.Milage,
        Package: selectedVehicle.selectedPackage,
        selectedServices: selectedVehicle.selectedServices || [],
        nextService: parseInt(selectedVehicle.Milage, 10) + 5000,
      }));
    }
  };

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
        const milage = parseInt(value, 10) || 0;
        setService((prev) => ({ ...prev, nextService: milage + 5000 }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(service.Customer_Name)) {
      setLoading(false);
      setError("Customer name cannot contain numbers or special characters.");
      return;
    }

    axios
      .put(`http://localhost:8077/ServiceHistory/${id}`, service) // PUT request to update service history
      .then((response) => {
        console.log("Service history updated:", response.data);
        navigate("/ServiceHistory"); // Redirect to the service history page after successful update
      })
      .catch((error) => {
        console.error("Error updating service history:", error);
        setError("Error updating service history.");
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
          <h2 style={styles.title}>Edit Service History</h2>

          <div style={styles.flex}>
            <label>
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
            </label>

            <label>
              <input
                type="text"
                name="Customer ID"
                placeholder="CusID"
                value={service.cusID}
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
                min={new Date().toISOString().split("T")[0]} // Set min date to today
                max={new Date().toISOString().split("T")[0]} // Set max date to today
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
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Package</option>
              {promotion.map((packageItem) => (
                <option key={packageItem._id} value={packageItem.title}>
                  {packageItem.title}
                </option>
              ))}
            </select>
          </div>

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

export default EditShowHistory;
