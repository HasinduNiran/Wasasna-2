import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import img1 from '../../images/bg02.jpg';
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/Footer';

const EditEmployeeSalary = () => {
  const [EmpID, setEmpID] = useState('');
  const [employeeName, setemployeeName] = useState('');
  const [fromDate, setfromDate] = useState('');
  const [toDate, settoDate] = useState('');
  const [totalOThours, settotalOThours] = useState('');
  const [totalOTpay, settotalOTpay] = useState('');
  const [BasicSalary, setBasicSalary] = useState('');
  const [TotalSalary, setTotalSalary] = useState('');

  const [employeesAttendence, setEmployeesAttendence] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [includeEPF, setIncludeEPF] = useState(false); // State to track EPF selection


  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8077/EmployeeSalary/${id}`)
      .then((response) => {
        setEmpID(response.data.EmpID);
        setemployeeName(response.data.employeeName)
        setfromDate(response.data.fromDate)
        settoDate(response.data.toDate);
        settotalOThours(response.data.totalOThours)
        settotalOTpay(response.data.totalOTpay)

        setBasicSalary(response.data.BasicSalary)
        setTotalSalary(response.data.TotalSalary)

        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        alert('An error happened. Please Chack console');
        console.log(error);
      });
  }, [])



  // calculate total OT hours
  const calculateTotalOvertimeHours = () => {
    const filteredAttendance = employeesAttendence.filter(
      (attendance) =>
        attendance.EmpID === EmpID &&
        attendance.date >= fromDate &&
        attendance.date <= toDate
    );

    const totalOvertimeHours = filteredAttendance.reduce(
      (total, attendance) => total + attendance.OThours,
      0
    );

    // Set the total overtime hours state
    settotalOThours(totalOvertimeHours);
  };


  // Calculate totalOTpay and totalWorkedpay
  const calculatedTotalOTpay = () => {
    const calculatedTotalOTpay = totalOThours * 585;
    settotalOTpay(calculatedTotalOTpay);
  };


  // Calculate totalSalary including EPF if selected
  const calculatedTotalSalary = () => {
    let totalSalary = totalOTpay + parseFloat(BasicSalary); // Convert BasicSalary to float
    if (includeEPF) {
      // Include EPF, 8%
      const epfAmount = totalSalary * 0.08;
      totalSalary -= epfAmount;
    }
    setTotalSalary(totalSalary);
  };

  const handleEditEmployeeSalary = () => {

    // Check if essential fields are empty
    if (!EmpID || !employeeName || !fromDate || !toDate || !BasicSalary || !TotalSalary) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    // Check if toDate is before fromDate
    if (toDate < fromDate) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'The "toDate" must be after the "fromDate".',
      });
      return;
    }

    // Check if totalOThours and totalWorkedhours are numeric
    if (isNaN(totalOThours)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter valid numeric values for total OT hours ',
      });
      return;
    }


    const MAX_OHOURS = 48;
    // Check if totalOThours and totalWorkedhours are within a valid range
    if (totalOThours < 0 || totalOThours > MAX_OHOURS) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Total OT hours  must be between 0 and 24 hours.',
      });
      return;
    }

    // Validating fromDate
    const fDate = new Date(fromDate);
    const fcurrentDate = new Date();
    if (fDate > fcurrentDate) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'DOB cannot be a future date.',
      });
      return;
    }

    // Validating toDate
    const tDate = new Date(toDate);
    const tcurrentDate = new Date();
    if (tDate > tcurrentDate) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'DOB cannot be a future date.',
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
      TotalSalary
    };
    setLoading(true);
    axios
      .put(`http://localhost:8077/EmployeeSalary/${id}`, data)
      .then(() => {
        setLoading(false);
        //enqueueSnackbar('EmployeeSalary Edited successfully', { variant: 'success' });
        navigate('EmployeeSalary');
      })
      .catch((error) => {
        setLoading(false);
        // alert('An error happened. Please Chack console');
        //enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:8077/EmployeeAttendence')
      .then((response) => {
        setEmployeesAttendence(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

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
        height: "700px",
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
        <form onSubmit={handleEditEmployeeSalary} style={styles.form}>
          <h2 style={styles.title}>Edit Employee Salary</h2>
          <div style={styles.flex}>
            {/* <input
              type='text'
              value={EmpID}
              onChange={(e) => setEmpID(e.target.value)}
              style={styles.input}
              
            /> */}
        
            <input
              type='text'
              value={employeeName}
              onChange={(e) => setemployeeName(e.target.value)}
              style={styles.input}
              readOnly
            />
          </div>
          <div style={styles.flex}>
            <input
              type='Date'
              value={fromDate}
              onChange={(e) => setfromDate(e.target.value)}
              style={styles.input}
            />
        
            <input
              type='Date'
              value={toDate}
              onChange={(e) => settoDate(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.flex}>
            <input
              type='text'
              value={totalOThours}
              onChange={(e) => settotalOThours(e.target.value)}
              style={styles.input}
              readOnly
            />

            <button style={styles.submitButton} onClick={calculateTotalOvertimeHours}>
              Calculate Total OT Hours
            </button>
          
            <input
              type='text'
              value={totalOTpay}
              onChange={(e) => settotalOTpay(e.target.value)}
              style={styles.input}
              readOnly
            />
            <button style={styles.submitButton} onClick={calculatedTotalOTpay}>
              Calculate Total OT Pay
            </button>
            </div>
            <div style={styles.flex}>
            <input
              type='text'
              value={BasicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              style={styles.input}
              readOnly
            />
          </div>
          <div style={styles.flex}>
            <input
              type='text'
              value={TotalSalary}
              onChange={(e) => setTotalSalary(e.target.value)}
              style={styles.input}
              readOnly
            />
            <button style={styles.submitButton} onClick={calculatedTotalSalary}>
              Calculate Total Salary
            </button>
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

export default EditEmployeeSalary;
