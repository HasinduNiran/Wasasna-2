import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import Swal from "sweetalert2";
import CountUp from "react-countup";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../images/logo.png";

const ShowStore = () => {
  const [store, setStore] = useState([]);
  const [filteredStore, setFilteredStore] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8077/Store")
      .then((response) => {
        console.log("API Response:", response.data);
        const data = response.data;
        if (Array.isArray(data)) {
          setStore(data);
          setFilteredStore(data); // Initialize filtered data
        } else {
          console.warn("Data is not an array:", data);
          setStore([]);
          setFilteredStore([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching store data:", error);
        setStore([]);
        setFilteredStore([]);
        setLoading(false);
      });
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = store.filter(
      (item) =>
        item.Name.toLowerCase().includes(query) ||
        item.Quantity.toString().includes(query) ||
        item.Price.toString().includes(query)
    );
    setFilteredStore(filtered);
  };

  useEffect(() => {
    handleSearch({ target: { value: searchQuery } });
  }, [searchQuery]);

  const generateReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString(); // Current date for the report

    // Define table columns for store items
    const tableColumn = ["Name", "Quantity", "Price"];

    // Map store data to table rows
    const tableRows = filteredStore.map(item => [
        item.Name,
        item.Quantity,
        item.Price
    ]);

    // Add report header and company details
    doc.setFontSize(28).setTextColor('red');
    doc.text("Wasana Auto Service", 60, 15); // Company name

    doc.setFontSize(20).setTextColor(0, 0, 0);
    doc.text("Store Report", 75, 25); // Report title

    doc.setFontSize(15).setTextColor(100, 100, 100);
    doc.text(`Report Generated Date: ${date}`, 65, 35); // Report date

    // Add company address or other details
    doc.setFontSize(12).setTextColor(150, 150, 150);
    doc.text("Wasana Auto Service, Colombo 4", 30, 45); // Company address

    // Add a separator line
    doc.text(
        "--------------------------------------------------------------------------------------------------",
        0,
        50
    );

    // Create and format the store table
    doc.autoTable({
        startY: 55,
        margin: { left: 20, right: 20 }, // Set margins
        head: [tableColumn], // Table header
        body: tableRows, // Data rows
        styles: { fontSize: 9 }, // Font size for table
        headStyles: {
            fillColor: [31, 41, 55], // Dark gray header background
            textColor: [255, 255, 255], // White text
            fontStyle: "bold",
        },
    });

    // Save the PDF with a custom file name including the date
    doc.save(`Store_Report_${date}.pdf`);
};


  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
          <div className="flex items-center justify-center h-16 bg-gray-800">
            <img
              src={logo}
              alt="logo"
              style={{ width: "60px", height: "60px" }}
            />
          </div>
          <nav className="flex-1">
            <ul className="mt-2"></ul>
          </nav>
          <div className="p-3">
          <button className="w-full flex items-center p-3 bg-gray-800 rounded hover:bg-gray-700">
                <i className="bx bx-cog text-xl"></i>
                <li className="text-gray-400 hover:bg-gray-700 hover:text-white p-3">
                            <Link to="/">Logout</Link>
                        </li>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white h-16 px-4 shadow">
          <div className="flex items-center">
            <i
              className="bx bx-menu text-xl cursor-pointer"
              onClick={toggleSidebar}
            ></i>
            <input
              type="search"
              placeholder="Search..."
              className="ml-4 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button
              className="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
              onClick={generateReport}
            >
              Generate Report
            </button>
            <button
              className="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
              onClick={toggleDarkMode}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button class="mt-1 ml-3 inline-block px-8 py-2.5 text-white bg-gray-800 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md">
              <Link to="/Store/create">Add Store</Link>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <i className="bx bx-bell text-xl"></i>
            <div className="flex items-center space-x-2">
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
          <div className="flex flex-col items-center">
            <h3 className="text-5xl font-extrabold text-dark-grey-900">
              <CountUp id="countto4" end={350} />+
            </h3>
            <p className="text-base font-medium text-dark-grey-600">
              Awards Won
            </p>
          </div>
        </div>
        {/* Main Content */}
        <main
          className={`p-6  overflow-y-scroll max-w-7xl ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <h1 className="text-2xl font-semibold mb-4">Store List</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStore.map((item, index) => (
                  <tr
                    key={item._id}
                    className={
                      index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <img src={item.photoURL} className="w-40 rounded-2xl" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.Name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.Quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.Price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div style={styles.actionIcons}>
                        <Link to={`/Store/${item._id}`}>
                          <BsInfoCircle className="text-2xl text-green-800" />
                        </Link>
                        <Link to={`/Store/edit/${item._id}`}>
                          <AiOutlineEdit className="text-2xl text-yellow-600" />
                        </Link>
                        <Link to={`/Store/delete/${item._id}`}>
                          <MdOutlineDelete className="text-2xl text-red-600" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShowStore;
