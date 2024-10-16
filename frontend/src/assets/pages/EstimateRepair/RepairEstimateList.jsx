import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import CountUp from "react-countup";
import logo from "../../images/logo.png";
import Sidebar from "../../components/Sidebar";
import Fab from "@mui/material/Fab";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Box from "@mui/material/Box";

const RepairEstimateList = () => {
  const navigate = useNavigate();
  const [repairEstimate, setRepareEstimate] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredEstimate, setFilteredEstimate] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const numbers = document.querySelectorAll("[countTo]");
    numbers.forEach((number) => {
      const ID = number.getAttribute("id");
      const value = number.getAttribute("countTo");
      let countUp = new CountUp(ID, value);
      if (number.hasAttribute("data-decimal")) {
        const options = {
          decimalPlaces: 1,
        };
        countUp = new CountUp(ID, value, options);
      }
      if (!countUp.error) {
        countUp.start();
      } else {
        console.error(countUp.error);
        number.innerHTML = value;
      }
    });
  }, []);

  useEffect(() => {
    const fetchRepairEstimateLogs = async () => {
      try {
        const fetchData = await axios.get("http://localhost:8077/est");
        setRepareEstimate(fetchData.data);
      } catch (error) {
        console.error("Error fetching repair estimates:", error);
      }
    };
    fetchRepairEstimateLogs();
  }, []);

  const handleNavigate = (id) => {
    navigate(`/EstOne/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this Estimate Log",
        icon: "warning",
        fontFamily: "Montserrat, sans-serif",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:8077/est/del/${id}`);
        setRepareEstimate(repairEstimate.filter((rep) => rep._id !== id));
        Swal.fire("Deleted!", "The Estimate Log has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting Estimate Log:", error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the Estimate Log.",
        "error"
      );
    }
  };

  const handleUpdate = (id) => {
    navigate(`/EstUpd/${id}`);
  };

  useEffect(() => {
    const serchResult = repairEstimate.filter((item) =>
      item.Register_Number.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredEstimate(serchResult);
  }, [searchValue, repairEstimate]);

  const styles = {
    tableRowEven: {
      backgroundColor: "#f9f9f9",
    },
    tableRowOdd: {
      backgroundColor: "#ffffff",
    },
    image: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
    },
    actionIcons: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
    },
  };

  return (
    <div className={`flex ${darkMode ? "bg-gray-900 " : "bg-white "}`}>
      <Sidebar isOpen={sidebarOpen} />

      <main className="flex-1">
        <div
          className={`fixed min-w-full ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
          }`}
        >
          <header
            className={`flex ${
              sidebarOpen ? "mr-64" : ""
            }  h-16 shadow mb-5 min-w-full`}
          >
            <Box sx={{ "& > :not(style)": { m: -2.8, mt: 2 } }}>
              <Fab
                color="primary"
                aria-label="add"
                onClick={toggleSidebar}
                sx={{ width: 60, height: 67 }}
              >
                {sidebarOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
              </Fab>
            </Box>
            <div className={`flex items-center ml-10`}>
              <a
                href="/est"
                className="bg-violet-500 text-black mt-1 ml-2 inline-block px-8 py-2.5 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md mr-5"
                style={{ marginLeft: "auto" }}
              >
                Make New Estimate
              </a>
              <input
                type="text"
                placeholder="Enter Vehicle Number"
                className="ml-20 bg-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div className="flex">
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
          {/* Stats Section with Dark Mode */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-6 ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
            }`}
          >
            <div className="flex flex-col items-center">
              <h3 className="text-5xl font-extrabold text-dark-grey-900">
                <CountUp id="countto1" end={250} />+
              </h3>
              <p className="text-base font-medium text-dark-grey-600">
                Successful Projects
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-5xl font-extrabold text-dark-grey-900">
                <CountUp id="countto2" end={1200} />+
              </h3>
              <p className="text-base font-medium text-dark-grey-600">
                Happy Customers
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-5xl font-extrabold text-dark-grey-900">
                <CountUp id="countto3" end={150} />+
              </h3>
              <p className="text-base font-medium text-dark-grey-600">
                Employees
              </p>
            </div>
          </div>
        </div>
        <div className="p-10 mt-48">
          {filteredEstimate.map((rep) => (
            <section
              key={rep._id}
              className="mb-8 bg-slate-200 p-0 rounded-2xl shadow-sm cursor-pointer grid grid-cols-4 gap-4"
              style={{ height: "220px" }}
              onClick={() => handleNavigate(rep._id)}
            >
              <div className="col-span-1">
                <img
                  className="rounded-l-2xl object-cover"
                  src={rep.photoURL}
                  style={{
                    width: "190px",
                    height: "220px",
                  }}
                  alt="Report Image"
                />
              </div>
              <div className="col-span-3 m-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Report Id:</strong> {rep._id}
                  </div>
                  <div>
                    <strong>Vehicle Reg No:</strong> {rep.Register_Number}
                  </div>
                  <div>
                    <strong>Customer Name:</strong> {rep.firstName}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {new Date(rep.createdAt).toLocaleDateString()}
                  </div>

                  <div className="mt-4 flex">
                    <button
                      type="button"
                      className="bg-pink-600 text-black text-xl px-4 py-2 rounded-md mr-4"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click event from bubbling up
                        handleDelete(rep._id);
                      }}
                    >
                      Delete
                    </button>

                    <button
                      type="button"
                      className="bg-lime-500 text-black text-xl px-4 py-2 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click event from bubbling up
                        handleUpdate(rep._id);
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RepairEstimateList;
