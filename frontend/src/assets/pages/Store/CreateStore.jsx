import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import img1 from "../../images/bg02.jpg";
import Navbar from "../Navbar/Navbar";
import Footer from "../footer/Footer";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../../firebase";

const CreateStore = () => {
  const [Name, setName] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Price, setPrice] = useState("");
  const [Description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation for Quantity, Price, and Description
    if (Quantity < 0 || Price < 0) {
      alert("Quantity and Price cannot be negative.");
      return;
    }
  
    if (!Description) {
      alert("Description cannot be empty.");
      return; // Prevent form submission if Description is empty
    }
  
    const data = { Name, Quantity, Price, Description, photoURL };
    setLoading(true);
  
    try {
      await axios.post("http://localhost:8077/Store", data);
      setLoading(false);
      navigate("/Store");
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
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
      height: "689px",
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
    <div className="">
      <Navbar />
      <div style={styles.container}>
        <div style={styles.backButton}>
          <BackButton destination="/store" />
        </div>
        <img src={img1} style={styles.image} alt="car" />
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Create Store Item</h2>
          <input
            type="text"
            placeholder="Name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={Quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Description"
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Price"
            value={Price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
            required
            style={styles.input}
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-black text-white text-xl px-4 py-2 rounded-md mt-5"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
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
          <button
            type="submit"
            style={styles.submitButton}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.submitButtonHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.submitButton.backgroundColor)
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

export default CreateStore;
