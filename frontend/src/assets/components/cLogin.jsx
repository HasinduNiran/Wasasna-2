import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>Welcome to the Login Page</h1>
    </header>
  );
}

function CLogin() {
  const [cusID, setCusID] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  

  const onLogin = async (e) => {
    e.preventDefault();
    const credentials = { cusID, password };

    if (cusID === 'customer' && password === 'customer123') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome back!",
        showConfirmButton: false,
        timer: 2000,
      });

      localStorage.setItem('cusID', cusID);

      navigate('/Customer');
      return; 
    }

    if (cusID === 'manager' && password === 'manager123') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome back!",
        showConfirmButton: false,
        timer: 2000,
      });

      localStorage.setItem('cusID', cusID);

      navigate('/inquire');
      return; 
    }

    // New condition for Applicant
    if (cusID === 'Applicant' && password === 'Applicant1234') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome back, Applicant Manager!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate('/applicant');
      return;
    }

    if (cusID === 'Store' && password === 'Store1234') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome back, Store Manager!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate('/Store');
      return;
    }

    // New condition for Employee
    if (cusID === 'Employee' && password === 'Employee1234') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome back, Employee Manager!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate('/employee');
      return;
    }

    // New condition for Promotion
    if (cusID === 'Promotion' && password === 'Promotion1234') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome back, Promotion Manager!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate('/Promotion');
      return;
    }
    // New condition for Vacancy
    if (cusID === 'Vacancy' && password === 'Vacancy1234') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome back, Vacancy Manager!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate('/vacancy');
      return;
    }
    // New condition for Booking
    if (cusID === 'Booking' && password === 'Booking1234') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome back, Booking Manager!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate('/Booking');
      return;
    }

    // New condition for Customer
    if (cusID === 'Customer' && password === 'Customer1234') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome back, Customer Manager!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate('/Customer');
      return;
    }

    if (cusID === 'Repair' && password === 'Repair1234') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome back, Customer Manager!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate('/EstList');
      return;
    }


    // New condition for Service Manager
    if (cusID === 'Service' && password === 'Service1234') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome back, Service Manager!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate('/service');
      return;
    }

    // New condition for Operation Manager
    if (cusID === 'Operation' && password === 'Operation1234') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome back, Operation Manager!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate('/ServiceHistory');
      return;
    }

    try {
      const response = await axios.post("http://localhost:8077/customer/cLogin", credentials);
      const userData = response.data;

      if (userData) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Welcome back, ${userData.firstName}!`,
          showConfirmButton: false,
          timer: 2000,
        });

        navigate(`/ReadOneHome/${cusID}`);
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Invalid credentials",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Login failed",
        text: error.response?.data?.message || error.message,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Login</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <form onSubmit={onLogin} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="cusID"
                    name="cusID"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Customer ID"
                    value={cusID}
                    onChange={(e) => setCusID(e.target.value)}
                  />
                  <label
                    htmlFor="cusID"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Customer ID
                  </label>
                </div>
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="password"
                    name="password"
                    type="password"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <button
                    type="submit"
                    className="bg-red-800 text-white rounded-md px-2 py-1"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="w-full flex justify-center mt-4">
            <button className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">

              <Link to="/Customer/create">Create the New Account</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CLogin;
