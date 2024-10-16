import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const DeletePromotion = () => {
  const { id } = useParams(); // Get the promotion ID from the URL
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await axios.get(`http://localhost:8077/Promotion/${id}`);
        setPromotion(response.data);
      } catch (error) {
        console.error("There was an error fetching the promotion!", error);
        setError("Failed to load promotion details. Please try again later.");
      }
    };

    fetchPromotion();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      try {
        await axios.delete(`http://localhost:8077/Promotion/${id}`);
        alert("Promotion deleted successfully!");
        navigate("/promotions"); // Redirect to the promotions list after deletion
      } catch (error) {
        console.error("There was an error deleting the promotion!", error);
        alert("Failed to delete promotion. Please try again.");
      }
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!promotion) {
    return <p>Loading promotion details...</p>;
  }

  return (
    <div className="container">
    <style>{`
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        
        p {
            font-size: 18px;
            margin-bottom: 20px;
        }
        
        button {
            background-color: #f44336;
            color: white;
            padding: 10px 20px;
            margin: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            font-size: 16px;
        }
        
        button:hover {
            background-color: #d32f2f;
        }
        
        .cancel-button {
            background-color: #9e9e9e;
        }
        
        .cancel-button:hover {
            background-color: #757575;
        }
    `}</style>
      <h2>Delete Promotion</h2>
      <p><strong>Title:</strong> {promotion.title}</p>
      <p><strong>Description:</strong> {promotion.description}</p>
      <p><strong>Discount:</strong> {promotion.discount}%</p>
      <p><strong>Start Date:</strong> {new Date(promotion.startDate).toLocaleDateString()}</p>
      <p><strong>End Date:</strong> {new Date(promotion.endDate).toLocaleDateString()}</p>
      <button onClick={handleDelete}>Delete Promotion</button>
    </div>
  );
};

export default DeletePromotion;
