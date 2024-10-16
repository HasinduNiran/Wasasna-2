import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { motion } from "framer-motion"; // For animations
import NavBarC from "../../components/NavBarC";
import axios from "axios";
import BackGround from "../../images/wbg.jpeg";
import BackGround1 from "../../images/3dStore.jpg";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate
import Box from "@mui/material/Box";

const categories = [
  // ... (categories definition remains unchanged)
];

const StorePage = () => {
  const { cusID } = useParams();
  const [storeData, setStoreData] = useState([]);
  const [background, setBackground] = useState(BackGround);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackground((prevBackground) =>
        prevBackground === BackGround ? BackGround1 : BackGround
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchStoreData = async () => {
    try {
      const data = await axios.get("http://localhost:8077/Store");
      setStoreData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  useEffect(() => {
    if (cusID) {
      fetchStoreData(); // Call the fetchStoreData function
    }
  }, [cusID]);

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, { ...product, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    navigate(`/cart/${product.Name}`); // Navigate to the Cart page
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBarC />

      {/* Hero Section */}
      <div
        className="relative bg-center top-16 z-10 mb-20"
        style={{
          backgroundImage: `url(${background})`,
          height: "100vh",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-5xl font-bold">
            Welcome to Our Store
          </h1>
        </div>
      </div>

      <h2 className="text-3xl text-center font-semibold mb-8">Spareparts</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-8 mb-20">
        {storeData.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
            }}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 ease-in-out"
          >
            <Card
              className="bg-white"
              style={{
                fontFamily: "'Poppins', sans-serif",
                borderRadius: "15px",
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardMedia
                component="img"
                image={product.photoURL}
                alt={product.name}
                style={{ objectFit: "cover", height: "200px" }}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  style={{ fontWeight: "600" }}
                >
                  {product.Name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {product.Description}
                </Typography>
                <Typography
                  variant="h6"
                  className="font-bold mt-4"
                  style={{ color: "#6c1c1d", fontWeight: "700" }}
                >
                  ${product.Price}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className="mt-4"
                  fullWidth
                  style={{
                    backgroundColor: "#6c1c1d",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "600",
                    borderRadius: "8px",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#a32729")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#6c1c1d")
                  }
                  onClick={() => handleAddToCart(product)} // Add to cart and navigate
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 text-center">
        <p>&copy; 2024 Your Store. All rights reserved.</p>
      </div>
    </div>
  );
};

export default StorePage;
