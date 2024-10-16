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
import Box from "@mui/material/Box";

const categories = [
  {
    id: 1,
    title: "Electronics",
    products: [
      {
        id: 2,
        name: "Spareparts",
        price: "$999",
        description: "Powerful laptop for all your work needs.",
        imgUrl: "https://via.placeholder.com/200",
      },
    ],
  },
  {
    id: 2,
    title: "Furniture",
    products: [
      {
        id: 1,
        name: "Sofa",
        price: "$499",
        description: "Comfortable and stylish sofa.",
        imgUrl: "https://via.placeholder.com/200",
      },
      {
        id: 2,
        name: "Dining Table",
        price: "$299",
        description: "Elegant dining table for family meals.",
        imgUrl: "https://via.placeholder.com/200",
      },
    ],
  },
];

const Store = () => {
  const [storeData, setStoreData] = useState([]);
  const [background, setBackground] = useState(BackGround); // Track current background

  useEffect(() => {
    // Auto switch backgrounds every 5 seconds
    const intervalId = setInterval(() => {
      setBackground((prevBackground) =>
        prevBackground === BackGround ? BackGround1 : BackGround
      );
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const data = await axios.get("http://localhost:8077/Store");
        setStoreData(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStoreData();
  }, []);

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

      {/* <Box
        sx={{
          width: 100,
          height: 100,
          backgroundColor: "black",
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
        }}
      ></Box> */}

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
                  style={{ fontFamily: "'Open Sans', sans-serif" }} // Use different font for description
                >
                  {product.Description}
                </Typography>
                <Typography
                  variant="h6"
                  className="font-bold mt-4"
                  style={{ color: "#6c1c1d", fontWeight: "700" }} // Make the price stand out
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

export default Store;



