import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import EstimatePDFDocument from "./EstimatePDFDocument";
import Sidebar from "../../components/Sidebar";
import Fab from "@mui/material/Fab";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import { init, send } from "emailjs-com";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../../firebase";
import { pdf } from "@react-pdf/renderer";

const ShowOneEstimate = () => {
  const navigation = useNavigate();
  const [repairEstimate, setRepairEstimate] = useState({});
  const { id } = useParams();
  const [estimateList, setEstimateList] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadProgress2, setUploadProgress2] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);

  const storage = getStorage(app);
  init("jm1C0XkEa3KYwvYK0");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchRepairEstimate = async () => {
      try {
        const response = await axios.get(`http://localhost:8077/est/${id}`);
        setRepairEstimate(response.data);
        setEstimateList(response.data.estimateList);
      } catch (error) {
        console.error("Error fetching repair estimate:", error);
      }
    };

    fetchRepairEstimate();
  }, [id]); // Dependency array with `id` ensures effect runs when `id` changes

  const handleBackClick = () => {
    navigation(-1);
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

  const generateAndUploadPDF = async () => {
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
          // Track progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress2(progress);
        },
        (error) => {
          console.error("Error uploading PDF:", error);
        },
        async () => {
          // Get the download URL after upload completes
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setPdfUrl(downloadURL);

          // After successful PDF upload, send the email
          await sendEmail(downloadURL);
          Swal.fire("Success!", "The report has been sent.", "success");
        }
      );
    } catch (error) {
      console.error("Error generating or uploading PDF:", error);
    }
  };

  const sendEmail = async (downloadURL) => {
    const templateParams = {
      to_email: repairEstimate.agentEmail,
      vehicle_registration_number: repairEstimate.Register_Number,
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
  return (
    <div className={`flex ${darkMode ? "bg-gray-900 " : "bg-white "}`}>
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
              <PDFDownloadLink
                document={
                  <EstimatePDFDocument
                    repairEstimate={repairEstimate}
                    estimateList={estimateList}
                  />
                }
                fileName="repair_estimate.pdf"
                className="bg-lime-500 text-black text-xl px-4 py-2 rounded-md shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
              >
                {({ loading }) => (loading ? "Loading PDF..." : "Download PDF")}
              </PDFDownloadLink>
              <button
                type="button"
                onClick={handleEmailSent}
                className="bg-violet-500  text-black text-xl px-4 py-2 rounded-md mt-10 mb-10 ml-5 mr-10"
              >
                Send To Agent
              </button>
            </div>

            <div className="flex items-center space-x-4 mr-64">
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

        <div className=" pl-20 pr-20 pt-24">
          {/* Vehicle Information Section */}
          <section className="mb-8 bg-slate-200 p-0 rounded-2xl shadow-sm grid grid-cols-4">
            <div className="col-span-3 m-6">
              <h2 className="text-2xl font-bold mb-4">Vehicle Information</h2>
              <div className="grid grid-cols-2 gap-4 ">
                <div>
                  <strong>Vehicle No:</strong> {repairEstimate.Register_Number}
                </div>
                <div>
                  <strong>Engine:</strong> {repairEstimate.Engine_Details}
                </div>
                <div>
                  <strong>Model:</strong> {repairEstimate.Model}
                </div>
                <div>
                  <strong>Year:</strong> {repairEstimate.Year}
                </div>
                <div>
                  <strong>Make:</strong> {repairEstimate.Make}
                </div>
                <div>
                  <strong>Vehicle Color:</strong> {repairEstimate.Vehicle_Color}
                </div>
                <div>
                  <strong>Transmission:</strong>{" "}
                  {repairEstimate.Transmission_Details}
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <img
                className="rounded-r-2xl"
                src={repairEstimate.photoURL}
                style={{ width: "280px", height: "260px" }}
              />
            </div>
          </section>

          {/* Customer Information Section */}
          <section className="mb-8 bg-slate-200 p-6 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>CUS Id:</strong> {repairEstimate.cusID}
              </div>
              <div>
                <strong>First Name:</strong> {repairEstimate.firstName}
              </div>
              <div>
                <strong>Last Name:</strong> {repairEstimate.firstName}
              </div>
              <div>
                <strong>Email:</strong> {repairEstimate.email}
              </div>
              <div>
                <strong>Contact:</strong> {repairEstimate.phone}
              </div>
              <div>
                <strong>NIC:</strong> {repairEstimate.NIC}
              </div>
            </div>
          </section>

          {/* Insurance Information Section */}
          <section className="mb-8 bg-slate-200 p-6 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Insurance Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Insurance Provider:</strong>{" "}
                {repairEstimate.insuranceProvider}
              </div>
              <div>
                <strong>Agent Name:</strong> {repairEstimate.agentName}
              </div>
              <div>
                <strong>Agent Email:</strong> {repairEstimate.agentEmail}
              </div>
              <div>
                <strong>Agent Contact:</strong> {repairEstimate.agentContact}
              </div>
              <div>
                <strong>Description:</strong> {repairEstimate.shortDescription}
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
                  <td colSpan="3" className="py-2 px-4 text-right font-bold">
                    Subtotal:
                  </td>
                  <td className="py-2 px-4 font-bold">
                    {repairEstimate.totalAmount}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShowOneEstimate;
