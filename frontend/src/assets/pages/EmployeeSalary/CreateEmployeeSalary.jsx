import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import BackButton from "../../components/BackButton";
import img1 from '../../images/bg02.jpg';
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/Footer';

const CreateEmployeeSalary = () => {
  const [EmpID, setEmpID] = useState('');
  const [employeeName, setemployeeName] = useState('');
  const [fromDate, setfromDate] = useState('');
  const [toDate, settoDate] = useState('');
  const [totalOThours, settotalOThours] = useState('');
  const [totalOTpay, settotalOTpay] = useState('');
  const [BasicSalary, setBasicSalary] = useState('');
  const [TotalSalary, setTotalSalary] = useState('');
  const [employees, setEmployees] = useState([]);
  const [employeesAttendance, setEmployeesAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [includeEPF, setIncludeEPF] = useState(false); // EPF selection state
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // Fetch employee data
    axios.get('http://localhost:8077/Employee')
      .then((response) => {
        setEmployees(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    // Fetch attendance data
    axios.get('http://localhost:8077/EmployeeAttendence')
      .then((response) => {
        setEmployeesAttendance(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleEmpIDChange = (e) => {
    const selectedEmpID = e.target.value;
    setEmpID(selectedEmpID);

    const selectedEmp = employees.find((emp) => emp.EmpID === selectedEmpID);
    if (selectedEmp) {
      setemployeeName(selectedEmp.employeeName);
      setBasicSalary(selectedEmp.BasicSalary);
    }
  };

  // calculate total OT hours based on date range
  const calculateTotalOvertimeHours = () => {
    const filteredAttendance = employeesAttendance.filter(
      (attendance) =>
        attendance.EmpID === EmpID &&
        attendance.date >= fromDate &&
        attendance.date <= toDate
    );

    const totalOvertimeHours = filteredAttendance.reduce(
      (total, attendance) => total + attendance.OThours,
      0
    );

    settotalOThours(totalOvertimeHours);
  };

  // Calculate OT pay
  const calculatedTotalOTpay = () => {
    const calculatedOTpay = totalOThours * 585;
    settotalOTpay(calculatedOTpay);
  };

  // Calculate total salary with optional EPF deduction
  const calculatedTotalSalary = () => {
    let totalSalary = totalOTpay + parseFloat(BasicSalary);
    if (includeEPF) {
      const epfAmount = totalSalary * 0.08;
      totalSalary -= epfAmount;
    }
    setTotalSalary(totalSalary);
  };

  // Validations and form submission
  const handleSaveEmployeeSalary = (e) => {
    e.preventDefault();

    if (!EmpID || !employeeName || !fromDate || !toDate || !BasicSalary) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    if (toDate < fromDate) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '"toDate" must be after "fromDate".',
      });
      return;
    }

    calculateTotalOvertimeHours();
    calculatedTotalOTpay();
    calculatedTotalSalary();

    const data = {
      EmpID,
      employeeName,
      fromDate,
      toDate,
      totalOThours,
      totalOTpay,
      BasicSalary,
      TotalSalary,
    };

    setLoading(true);
    axios
      .post('http://localhost:8077/EmployeeSalary', data)
      .then(() => {
        setLoading(false);
        navigate('/EmployeeSalary');
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
        marginBottom: "50%",
        marginLeft: "-80%",
        position: "absolute",
    },
    image: {
        borderRadius: "30px",
        maxWidth: "240px",
        padding: "0px",
        height: "810px",
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
    <div>
      <Navbar />
      <div style={styles.container}>
        <BackButton destination={`/EmployeeSalary`} style={styles.backButton} />
        <img src={img1} style={styles.image} alt="car" />
        <form onSubmit={handleSaveEmployeeSalary} style={styles.form}>
          <h2 style={styles.title}>Add Employee Salary</h2>
          <div style={styles.flex}>
            <select
              value={EmpID}
              onChange={handleEmpIDChange}
              required
              style={styles.input}
            >
              <option value="">Select Employee ID</option>
              {employees.map((employee) => (
                <option key={employee.EmpID} value={employee.EmpID}>
                  {employee.EmpID}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Employee Name"
              value={employeeName}
              readOnly
              style={styles.input}
            />
          </div>
          <div style={styles.flex}>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setfromDate(e.target.value)}
              style={styles.input}
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => settoDate(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.flex}>
            <input
              type="text"
              placeholder="Total OT Hours"
              value={totalOThours}
              readOnly
              style={styles.input}
            />
            <button
              type="button"
              onClick={calculateTotalOvertimeHours}
              style={styles.submitButton}
            >
              Calculate Total OT Hours
            </button>
          </div>
          <div style={styles.flex}>
            <input
              type="text"
              placeholder="Basic Salary"
              value={BasicSalary}
              readOnly
              style={styles.input}
            />
          </div>
          <div style={styles.flex}>
            <input
              type="text"
              placeholder="OT Pay"
              value={totalOTpay}
              readOnly
              style={styles.input}
            />
            <button
              type="button"
              onClick={calculatedTotalOTpay}
              style={styles.submitButton}
            >
              Calculate OT Pay
            </button>
          </div>
          {/* <div style={styles.flex}>
            <label style={{ color: "#fff", paddingRight: "5px" }}>
              Include EPF:
            </label>
            <input
              type="checkbox"
              checked={includeEPF}
              onChange={() => setIncludeEPF(!includeEPF)}
            />
          </div> */}
          <div style={styles.flex}>
            <input
              type="text"
              placeholder="Total Salary"
              value={TotalSalary}
              readOnly
              style={styles.input}
            />
            <button
              type="button"
              onClick={calculatedTotalSalary}
              style={styles.submitButton}
            >
              Calculate Total Salary
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={styles.submitButton}
          >
            Save Employee Salary
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateEmployeeSalary;
