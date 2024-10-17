import { React, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { FcViewDetails } from "react-icons/fc";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../../firebase";
import Fab from "@mui/material/Fab";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Box from "@mui/material/Box";
import { init, send } from "emailjs-com";
import { PDFDocument, rgb } from "pdf-lib";
import { pdf } from "@react-pdf/renderer";
import EstimatePDFDocument from "./EstimatePDFDocument";

const RepairEstimate = () => {
  const [err, setErr] = useState([]);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sparepart, setSparepart] = useState({
    name: "",
    unitPrice: "",
    quantity: "",
  });
  const [estimateList, setEstimateList] = useState([]);
  const [vehicle, setVehicle] = useState({
    Register_Number: "",
    Engine_Details: "",
    Model: "",
    Year: "",
    Transmission_Details: "",
    Vehicle_Color: "",
    Make: "",
  });
  const [Register_Number, setVehicleNumber] = useState("");
  const [customer, setCustomer] = useState({
    cusID: "",
    firstName: "",
    NIC: "",
    phone: "",
    email: "",
  });
  const [insurance, setInsurance] = useState({
    insuranceProvider: "",
    agentName: "",
    agentEmail: "",
    agentContact: "",
    shortDescription: "",
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [errors, setErrors] = useState({
    Register_Number: "",
    Engine_Details: "",
    Model: "",
    Year: "",
    Transmission_Details: "",
    Vehicle_Color: "",
    Make: "",
    cusID: "",
    firstName: "",
    NIC: "",
    phone: "",
    email: "",
    insuranceProvider: "",
    agentName: "",
    agentEmail: "",
    agentContact: "",
    shortDescription: "",
  });
  const [descriptionWordCount, setDescriptionWordCount] = useState(100);
  const [uploadProgress2, setUploadProgress2] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);

  const storage = getStorage(app);
  init("jm1C0XkEa3KYwvYK0");

  const handleUpload = () => {
    const storage = getStorage();
    const storageRef = ref(storage, `customer_images/${photo.name}`);
    const uploadTask = uploadBytesResumable(storageRef, photo);

    setLoading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (uploadError) => {
        console.error("Error uploading image:", uploadError);
        Swal.fire("Upload Error", "Error uploading image.", "error");
        setLoading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Download URL:", downloadURL);
          setPhotoURL(downloadURL);
          setLoading(false);
        } catch (error) {
          console.error("Error getting download URL:", error);
          Swal.fire("URL Error", "Error getting the download URL.", "error");
          setLoading(false);
        }
      }
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSparepart((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgentChange = (e) => {
    const { name, value } = e.target;

    setInsurance((prew) => ({
      ...prew,
      [name]: value,
    }));
    const words = insurance.shortDescription.trim().split(/\s+/).length;
    if (words <= 100) {
      setDescriptionWordCount(100 - words);
    }
    console.log(insurance);
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;

    // Update vehicle state
    setVehicle((prevVehicle) => ({
      ...prevVehicle,
      [name]: value,
    }));

    // Required field validation
    if (value.trim() === "") {
      setErrors((prevState) => ({
        ...prevState,
        [name]: "This field is required.",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, [name]: "" }));

      // Specific field validation
      switch (name) {
        case "Year":
          if (value < 1900 || value > 2024) {
            setErrors((prevState) => ({
              ...prevState,
              Year: "Year must be between 1900 and 2024.",
            }));
          } else {
            setErrors((prevState) => ({ ...prevState, Year: "" }));
          }
          break;
        default:
          break;
      }
    }

    console.log(insurance); // Ensure this line has the correct reference; "insurance" is not defined in the provided code.
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prewww) => ({
      ...prewww,
      [name]: value,
    }));

    switch (name) {
      case "email":
        if (!value.match(/^(?:[A-Z]{3}-\d{4}|[A-Z]{2}-\d{4})$/)) {
          setErrors((prevState) => ({
            ...prevState,
            email: "Invalid email format.",
          }));
        } else {
          setErrors((prevState) => ({ ...prevState, email: "" }));
        }
        break;

      case "NIC":
        if (!value.match(/^\d{12}$/) && !value.match(/^\d{9}[vV]$/)) {
          setErrors((prevState) => ({
            ...prevState,
            NIC: "NIC must be either a 12-digit number or a 9-digit number followed by 'V'.",
          }));
        } else {
          setErrors((prevState) => ({ ...prevState, NIC: "" }));
        }
        break;

      case "phone":
        if (!value.match(/^\d{10}$/)) {
          setErrors((prevState) => ({
            ...prevState,
            phone: "Phone number must be 10 digits.",
          }));
        } else {
          setErrors((prevState) => ({ ...prevState, phone: "" }));
        }
        break;
    }
    console.log(customer);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setEstimateList((preList) => [...preList, sparepart]);
      setSparepart({ name: "", quantity: "", unitPrice: "" });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    if (errors.email) {
      setErr((prevErr) => [...prevErr, errors.email]);
    }
  }, [errors.email]);

  const calculateSubtotal = () => {
    return estimateList
      .reduce(
        (total, item) =>
          total + parseFloat(item.unitPrice * item.quantity || 0),
        0
      )
      .toFixed(2);
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleVehicleNumberChange = (e) => {
    const number = e.target.value;
    console.log(number);
    setVehicleNumber(number);
    setVehicle({
      Register_Number: number,
      Engine_Details: "",
      Model: "",
      Year: "",
      Transmission_Details: "",
      Vehicle_Color: "",
      Make: "",
    });
    fetchVehicleData(number);
  };

  const fetchVehicleData = async (number) => {
    try {
      const response1 = await axios.get(
        `http://localhost:8077/Vehicle/${number}`
      );
      setVehicle(response1.data);

      const response2 = await axios.get(
        `http://localhost:8077/Customer/${response1.data.cusID}`
      );
      setCustomer(response2.data);

      setError("");
    } catch (error) {
      console.error("Error fetching data:", error.message);

      setError("Vehicle Not Registered.");
      setVehicle({
        Register_Number: number,
        Engine_Details: "",
        Model: "",
        Year: "",
        Transmission_Details: "",
        Vehicle_Color: "",
        Make: "",
      });
      setCustomer({
        cusID: "",
        firstName: "",
        NIC: "",
        phone: "",
        email: "",
      });
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      "Year",
      "Register_Number",
      "Engine_Details",
      "Model",
      "Transmission_Details",
      "Vehicle_Color",
      "Make",
    ];

    for (let field of requiredFields) {
      // Check if the field exists and if it's a string before using trim()
      if (
        !vehicle[field] ||
        (typeof vehicle[field] === "string" && !vehicle[field].trim()) ||
        errors[field]
      ) {
        return false;
      }
    }

    return true;
  };

  const handleStoreToDB = async () => {
    try {
      // Calculate the total amount from the estimateList items
      const totalAmount = estimateList.reduce((sum, item) => {
        return sum + item.unitPrice * item.quantity;
      }, 0);

      // Merge the objects into one object, including totalAmount
      const requestBody = {
        ...vehicle,
        ...customer,
        ...insurance,
        photoURL,
        estimateList,
        totalAmount, // Add totalAmount to the request body
      };
      console.log(requestBody);
      // Remove the _id if it exists
      if (requestBody._id) {
        delete requestBody._id;
      }

      // Send the POST request with the merged object
      const res = await axios.post(
        "http://localhost:8077/est/add",
        requestBody
      );
      Swal.fire("Good job!", "Estimate Log Successfully Saved!", "success");
      navigate("/estlist");
      console.log(requestBody);
      console.log("photoUrl", photoURL); // Log the merged request body for debugging
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Fill All details correctly",
        icon: "error",
      });
      console.error("Error storing data to the database:", error);
    }
  };

  const handleEmailSent = async () => {
    try {
      // Confirm sending the email
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will send this estimate report",
        icon: "warning",
        fontFamily: "Montserrat, sans-serif",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, send it!",
      });

      if (result.isConfirmed) {
        // Generate and upload the PDF, and send the email afterwards
        await generateAndUploadPDF();
      }
    } catch (error) {
      console.error("Error sending report:", error);
      Swal.fire(
        "Error",
        "An error occurred while sending the report.",
        "error"
      );
    }
  };

  const sendEmail = async (downloadURL) => {
    const templateParams = {
      to_email: insurance.agentEmail,
      vehicle_registration_number: vehicle.Register_Number,
      repair_estimate_date: "2024/05/02", // Modify this dynamically if needed
      pdf_link: downloadURL,
    };

    try {
      await send(
        "service_fjpvjh9",
        "template_atolrdf",
        templateParams,
        "jm1C0XkEa3KYwvYK0"
      );
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const generateAndUploadPDF = async () => {
    const repairEstimate = {
      ...vehicle,
      ...customer,
      ...insurance,
    };
    try {
      const pdfBlob = await pdf(
        <EstimatePDFDocument
          repairEstimate={repairEstimate}
          estimateList={estimateList}
        />
      ).toBlob();

      const storageRef = ref(storage, `customer_images/${Date.now()}.pdf`);
      const uploadTask = uploadBytesResumable(storageRef, pdfBlob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track progress (optional)
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress2(progress);
        },
        (error) => {
          console.error("Error uploading PDF:", error);
        },
        async () => {
          // Step 4: Get the download URL after the upload completes
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setPdfUrl(downloadURL);
          console.log("File available at", downloadURL);

          await sendEmail(downloadURL);
          Swal.fire("Success!", "The report has been sent.", "success");
        }
      );
    } catch (error) {
      console.error("Error generating or uploading PDF:", error);
    }
  };

  return (
    <div
      className={`flex ${darkMode ? "bg-gray-900 " : "bg-white "}`}
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <style>{`
        .required::after {
          content: " *";
          color: red;
        }
        .requ::after {
          content: "   (maximum 100 words limit)";
          color: red;
        }
      `}</style>
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1">
        <div className="fixed min-w-full bg-white">
          <header className="flex items-center justify-between bg-white h-16 shadow mb-5">
            <Box sx={{ "& > :not(style)": { m: -2.8, mt: 1 } }}>
              <Fab
                color="primary"
                aria-label="add"
                onClick={toggleSidebar}
                sx={{ width: 60, height: 67 }}
              >
                {sidebarOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
              </Fab>
            </Box>
            <div className="flex items-center">
              <h2 className="ml-60 font-bold text-lg">
                Create New Estimate Report
              </h2>
            </div>

            <div className="flex items-center space-x-4 mr-64">
              <i className="bx bx-bell text-xl"></i>
              <div className="flex items-center space-x-2">
                <button
                  className="mt-1 ml-5 mr-10 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </button>
                <img
                  src="https://randomuser.me/api/portraits/men/11.jpg"
                  alt="user"
                  className="h-8 w-8 rounded-full"
                />
                <span>Tom Cook</span>
                <i className="bx bx-chevron-down text-xl"></i>
              </div>
            </div>
          </header>
        </div>
        {step === 1 && (
          <div className="pl-20 pt-10 pr-20">
            <form>
              <div className="mt-20 bg-slate-200 p-6 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-5">
                  Section 1: Vehicle Information
                </h2>
                <p>{error && <p className="text-red-500 mt-4">{error}</p>}</p>
                <div className="flex items-center justify-between mb-4 ">
                  <div className="flex flex-col w-1/3">
                    <label className="block text-gray-700 required">
                      Vehicle No:
                    </label>
                    <input
                      type="text"
                      name="Register_Number"
                      value={Register_Number}
                      onChange={handleVehicleNumberChange}
                      className={`border rounded-md p-2 mr-10 ${
                        errors.Register_Number
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      maxLength="8"
                      required
                    />
                    {!/^(?:[A-Z]{3}-\d{4}|[A-Z]{2}-\d{4})$/.test(
                      Register_Number
                    ) &&
                      Register_Number && (
                        <p className="text-red-500 text-xs mt-1">
                          Please enter a valid vehicle number
                        </p>
                      )}
                  </div>
                  <div className="flex flex-col w-1/3">
                    <label className="block text-gray-700 required">
                      Model:
                    </label>
                    {errors.Model && (
                      <p className="text-red-500 mt-1 text-xs">
                        {errors.Model}
                      </p>
                    )}
                    <input
                      type="text"
                      name="Model"
                      value={vehicle.Model}
                      onChange={handleVehicleChange}
                      className={`border rounded-md p-2 mr-10 ${
                        errors.Model ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                  </div>
                  <div className="flex flex-col w-1/3">
                    <label className="block text-gray-700 required">
                      Engine:
                    </label>
                    <input
                      type="text"
                      name="Engine_Details"
                      value={vehicle.Engine_Details}
                      onChange={handleVehicleChange}
                      className="border border-gray-300 rounded-md p-2 bg-gray-100"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col w-1/4">
                    <label className="block text-gray-700 required">
                      Make:
                    </label>
                    <input
                      type="text"
                      name="Make"
                      value={vehicle.Make}
                      onChange={handleVehicleChange}
                      className="border border-gray-300 rounded-md p-2 bg-gray-100 mr-10"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-1/4">
                    <label className="block text-gray-700 required">
                      Year:
                    </label>
                    {errors.Year && (
                      <p className="text-red-500 text-xs">{errors.Year}</p>
                    )}
                    <input
                      type="number"
                      name="Year"
                      maxLength="4"
                      min={1900}
                      max={2024}
                      step={1}
                      value={vehicle.Year}
                      onChange={handleVehicleChange}
                      className={`border rounded-md p-2 mr-10 ${
                        errors.Year ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                  </div>
                  <div className="flex flex-col w-1/5">
                    <label className="block text-gray-700 required">
                      Vehicle Color:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg h-10 p-1 bg-gray-100 mr-4">
                      {/* Color Picker Input */}
                      <input
                        type="color"
                        name="Vehicle_Color"
                        value={vehicle.Vehicle_Color}
                        onChange={handleVehicleChange}
                        className="h-9 p-1  bg-gray-100 " // Adjusted margin for better alignment
                        required
                      />
                      {/* Color Preview Box */}
                      <label>{vehicle.Vehicle_Color}</label>
                    </div>
                  </div>
                  <div className="flex flex-col w-1/4">
                    <label className="block text-gray-700 required">
                      Transmission Type:
                    </label>
                    <input
                      type="text"
                      name="Transmission_Details"
                      value={vehicle.Transmission_Details}
                      onChange={handleVehicleChange}
                      className="border border-gray-300 rounded-md p-2 bg-gray-100"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10 bg-slate-200 p-6 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-5">
                  Section 2: Customer Information
                </h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col mb-2 w-1/2">
                    <label className="block text-gray-700 required">
                      Cus ID:
                    </label>
                    <input
                      type="text"
                      name="cusID"
                      value={customer.cusID}
                      onChange={handleCustomerChange}
                      className="border border-gray-300 rounded-md p-2  bg-gray-100 mr-10"
                      required
                    />
                  </div>
                  <div className="flex flex-col mb-2 w-1/2">
                    <label className="block text-gray-700 required">
                      Name:
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={customer.firstName}
                      onChange={handleCustomerChange}
                      onKeyDown={(e) => {
                        if (
                          !/^[a-zA-Z\s]$/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "Tab"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="border border-gray-300 rounded-md p-2 bg-gray-100"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col mb-2 w-1/3">
                    <label className="block text-gray-700 required">
                      Email:
                    </label>
                    {errors.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                    <input
                      type="text"
                      name="email"
                      value={customer.email}
                      onChange={handleCustomerChange}
                      required
                      className={`border rounded-md p-2 mr-10 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col mb-2 w-1/3">
                    <label className="block text-gray-700 required">NIC:</label>
                    {errors.NIC && (
                      <p className="text-red-500 text-xs">{errors.NIC}</p>
                    )}
                    <input
                      type="text"
                      name="NIC"
                      value={customer.NIC}
                      onChange={handleCustomerChange}
                      className={`border rounded-md p-2 mr-10 ${
                        errors.NIC ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                      maxLength={12}
                    />
                  </div>
                  <div className="mflex flex-col mb-2 w-1/3">
                    <label className="block text-gray-700 required">
                      Phone:
                    </label>
                    {errors.phone && (
                      <p className="text-red-500 text-xs">{errors.phone}</p>
                    )}
                    <input
                      type="text"
                      name="phone"
                      value={customer.phone}
                      onChange={handleCustomerChange}
                      className={`border rounded-md p-2 mr-10 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-lime-500 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10"
                  disabled={!isFormValid()}
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="pl-20 pt-8 pr-20 ">
            <form>
              <div className="mt-20 bg-slate-200 p-6 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-4">
                  Section 3: Insurance Information
                </h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col w-1/2">
                    <label className="block text-gray-700 required">
                      Insurance Provider:
                    </label>
                    <input
                      type="text"
                      name="insuranceProvider"
                      value={insurance.insuranceProvider}
                      onChange={handleAgentChange}
                      className="border border-gray-300 rounded-md p-2 mr-10"
                      onKeyDown={(e) => {
                        if (
                          !/^[a-zA-Z\s]$/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "Tab"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      required
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="block text-gray-700 required">
                      Agent Name:
                    </label>
                    <input
                      type="text"
                      name="agentName"
                      value={insurance.agentName}
                      onChange={handleAgentChange}
                      className="border border-gray-300 rounded-md p-2 bg-gray-100"
                      onKeyDown={(e) => {
                        if (
                          !/^[a-zA-Z\s]$/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "Tab"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 required">
                  <div className="flex flex-col w-1/2">
                    <label className="block text-gray-700 required">
                      Agent Email:
                    </label>
                    <input
                      type="email"
                      name="agentEmail"
                      value={insurance.agentEmail}
                      onChange={handleAgentChange}
                      className="border border-gray-300 rounded-md p-2 bg-gray-100 mr-10"
                      required
                    />
                    {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(insurance.agentEmail) &&
                      insurance.agentEmail && (
                        <p className="text-red-500 text-xs mt-1">
                          Please enter a valid email address.
                        </p>
                      )}
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="block text-gray-700 required">
                      Contact Number:
                    </label>
                    <input
                      type="text"
                      name="agentContact"
                      value={insurance.agentContact}
                      onChange={handleAgentChange}
                      className="border border-gray-300 rounded-md p-2 bg-gray-100"
                      required
                    />
                    {!/^(\+94\d{9}|0\d{9})$/.test(insurance.agentContact) &&
                      insurance.agentContact && (
                        <p className="text-red-500 text-xs mt-1">
                          Please enter a valid phone number (e.g., +941111111111
                          or 0111111111).
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex flex-col mb-4">
                  <label className="block text-gray-700 mb-2 requ">
                    Description:
                  </label>
                  <textarea
                    name="shortDescription"
                    value={insurance.shortDescription}
                    onChange={handleAgentChange}
                    className="border border-gray-300 rounded-md p-2 h-32"
                    placeholder="Enter description here..."
                  />
                  <p className="text-sm text-red-500">
                    {descriptionWordCount} words remaining
                  </p>
                </div>
              </div>
              <div className="flex justify-center mb-4 mt-10">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-pink-600 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10 mr-10"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-lime-500 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10"
                >
                  Next
                </button>
              </div>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        )}

        {step === 3 && (
          <div className="pl-20 pt-8 pr-20 ">
            <form>
              <div className="mt-20 bg-slate-200 p-6 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-4">
                  Section 3: Insurance Information
                </h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col items-center mb-4">
                    <div className="flex flex-col mb-4">
                      <label className="block text-gray-700 mb-2">
                        Upload Photo:
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        className="border border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div className="flex flex-2 gap-5">
                      {photo && (
                        <div className="mb-4">
                          <h3 className="text-lg font-bold">Selected Photo:</h3>
                          <img
                            src={URL.createObjectURL(photo)}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-md mt-2"
                          />
                        </div>
                      )}
                      {photoURL && (
                        <div className="mb-4">
                          <h3 className="text-lg font-bold">Uploaded Photo:</h3>
                          <img
                            src={photoURL}
                            alt="Uploaded"
                            className="w-32 h-32 object-cover rounded-md mt-2"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center mb-4">
                      <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="bg-black text-white text-xl px-4 py-2 rounded-md mt-5"
                      >
                        {loading ? "Uploading..." : "Upload"}
                      </button>
                    </div>

                    {uploadProgress > 0 && (
                      <div className="w-full max-w-sm mt-4">
                        <div className="relative pt-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
                              Upload Progress
                            </span>
                            <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
                              {Math.round(uploadProgress)}%
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="relative flex items-center justify-center w-full">
                              <div className="w-full bg-gray-200 rounded">
                                <div
                                  className="bg-teal-600 text-xs leading-none py-1 text-center text-white rounded"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mb-4 mt-10">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-pink-600 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10 mr-10"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-lime-500 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="pl-20 pt-8 pr-20">
            <form onSubmit={handleOnSubmit}>
              <div className="mt-20 bg-slate-200 p-6 rounded-2xl shadow-sm">
                <h1 className="text-3xl font-bold mb-4">
                  Repair Estimate Calculator
                </h1>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col mb-4 w-1/2">
                    <label className="block text-gray-700 required">
                      Spare Part Name:
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2"
                      placeholder="Spare Part Name"
                      name="name"
                      value={sparepart.name}
                      onChange={handleOnChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col mb-4">
                    <label className="block text-gray-700 required">
                      Unit Price:
                    </label>
                    <input
                      type="number"
                      className="border border-gray-300 rounded-md p-2 w-2/3"
                      placeholder="Unit Price"
                      name="unitPrice"
                      value={sparepart.unitPrice}
                      onChange={handleOnChange}
                      required
                    />
                  </div>

                  <div className="flex flex-col mb-4">
                    <label className="block text-gray-700 required">
                      Quantity:
                    </label>
                    <input
                      type="number"
                      className="border border-gray-300 rounded-md p-2 w-2/3"
                      placeholder="Quantity"
                      name="quantity"
                      value={sparepart.quantity}
                      onChange={handleOnChange}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md"
                >
                  Add To List
                </button>
              </div>
            </form>
            <div className="mt-4">
              {estimateList.length <= 0 ? (
                <p>No list</p>
              ) : (
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">Unit Price</th>
                      <th className="py-2 px-4 border-b">Quantity</th>
                      <th className="py-2 px-4 border-b">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimateList.map((item, index) => (
                      <tr key={index} className="border-b text-center">
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4">{item.unitPrice}</td>
                        <td className="py-2 px-4">{item.quantity}</td>
                        <td className="py-2 px-4">
                          {item.quantity * item.unitPrice}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100">
                      <td
                        colSpan="3"
                        className="py-2 px-4 text-center font-bold"
                      >
                        Subtotal:
                      </td>
                      <td className="py-2 px-4 font-bold">
                        {calculateSubtotal()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={prevStep}
                className="bg-pink-600 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10 mr-10"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-lime-500 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10"
              >
                Genarate Summary
              </button>
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="p-8 min-h-screen">
            <div className="mt-20">
              {/* Vehicle Information Section */}
              <section className="mb-8 bg-slate-200 p-6 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Vehicle Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Vehicle No:</strong> {vehicle.Register_Number}
                  </div>
                  <div>
                    <strong>Engine:</strong> {vehicle.Engine_Details}
                  </div>
                  <div>
                    <strong>Model:</strong> {vehicle.Model}
                  </div>
                  <div>
                    <strong>Year:</strong> {vehicle.Year}
                  </div>
                  <div>
                    <strong>Make:</strong> {vehicle.Make}
                  </div>
                  <div>
                    <strong>Vehicle Color:</strong> {vehicle.Vehicle_Color}
                  </div>
                  <div>
                    <strong>Transmission:</strong>{" "}
                    {vehicle.Transmission_Details}
                  </div>
                </div>
              </section>

              {/* Customer Information Section */}
              <section className="mb-8 bg-slate-200 p-6 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-4">
                  Customer Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>CUS Id:</strong> {customer.cusID}
                  </div>
                  <div>
                    <strong>First Name:</strong> {customer.firstName}
                  </div>
                  <div>
                    <strong>Last Name:</strong> {customer.lastName}
                  </div>
                  <div>
                    <strong>Email:</strong> {customer.email}
                  </div>
                  <div>
                    <strong>Contact:</strong> {customer.phone}
                  </div>
                  <div>
                    <strong>NIC:</strong> {customer.NIC}
                  </div>
                </div>
              </section>

              {/* Insurance Information Section */}
              <section className="mb-8 bg-slate-200 p-6 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-4">
                  Insurance Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Insurance Provider:</strong>{" "}
                    {insurance.insuranceProvider}
                  </div>
                  <div>
                    <strong>Agent Name:</strong> {insurance.agentName}
                  </div>
                  <div>
                    <strong>Agent Email:</strong> {insurance.agentEmail}
                  </div>
                  <div>
                    <strong>Agent Contact:</strong> {insurance.agentContact}
                  </div>
                  <div>
                    <strong>Description:</strong> {insurance.shortDescription}
                  </div>
                </div>
              </section>

              {/* Estimate Table Section */}
              <section className="bg-slate-200 p-6 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Estimate Details</h2>
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">Unit Price</th>
                      <th className="py-2 px-4 border-b">Quantity</th>
                      <th className="py-2 px-4 border-b">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimateList.map((item, index) => (
                      <tr key={index} className="border-b text-center">
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4">{item.unitPrice}</td>
                        <td className="py-2 px-4">{item.quantity}</td>
                        <td className="py-2 px-4">
                          {item.quantity * item.unitPrice}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100">
                      <td
                        colSpan="3"
                        className="py-2 px-4 text-right font-bold"
                      >
                        Subtotal:
                      </td>
                      <td className="py-2 px-4 font-bold">
                        {calculateSubtotal()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-pink-600 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10 mr-10"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStoreToDB}
                  className="bg-violet-500 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10 mr-10"
                >
                  Save To Database
                </button>

                <button
                  type="button"
                  onClick={handleEmailSent}
                  className="bg-violet-500 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10 mr-10"
                >
                  Send To Agent
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairEstimate;
