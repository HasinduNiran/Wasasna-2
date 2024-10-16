import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../../firebase';
import backgroundImage from '../../images/bg02.jpg';
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/Footer';

function EditVehicle() {
  const { id } = useParams(); // Extract the vehicle ID from the URL parameters
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    cusID: '',
    image: '',
    Register_Number: '',
    Make: '',
    Model: '',
    Year: '',
    Engine_Details: '',
    Transmission_Details: '',
    Vehicle_Color: '',
    Vehicle_Features: [],
    Condition_Assessment: '',
    Owner: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Store the selected image file

  // Fetch vehicle details when component mounts
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8077/Vehicle/${id}`) // Fetch the vehicle details by ID
      .then((response) => {
        setVehicle(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching the vehicle:', error);
        setError('Error fetching vehicle details.');
        setLoading(false);
      });
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({
      ...vehicle,
      [name]: value,
    });
  };

  // Handle dynamic vehicle features change
  const handleFeatureChange = (index, event) => {
    const newFeatures = vehicle.Vehicle_Features.slice();
    newFeatures[index] = event.target.value;
    setVehicle({ ...vehicle, Vehicle_Features: newFeatures });
  };

  // Add a new feature to the Vehicle_Features array
  const addFeature = () => {
    setVehicle({
      ...vehicle,
      Vehicle_Features: [...vehicle.Vehicle_Features, '']
    });
  };

  // Handle image change and store it in the state
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the selected image file for later upload
    }
  };

  // Upload image to Firebase
  const uploadImage = () => {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        resolve(''); // Resolve with empty string if no image is selected
        return;
      }

      const storage = getStorage(app);
      const storageRef = ref(storage, `vehicleImages/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        null, // Progress callback (optional)
        (error) => {
          console.error('Error uploading image:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL); // Resolve with the download URL after upload
        }
      );
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image first, if selected, and get the URL
      const imageUrl = await uploadImage();

      // Update the vehicle data with the image URL if it exists
      const updatedVehicle = {
        ...vehicle,
        image: imageUrl || vehicle.image, // Use the new image URL if available, otherwise keep the old one
      };

      // Submit the vehicle data with the updated image URL
      await axios.put(`http://localhost:8077/Vehicle/${id}`, updatedVehicle);
      console.log('Vehicle updated successfully');
      navigate('/vehicles'); // Redirect after success
    } catch (error) {
      console.error('Error updating the vehicle:', error);
      setError('Error updating vehicle.');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '"Noto Sans", sans-serif',
    },
    backButton: {
      marginBottom: '50%',
      marginLeft: '-80%',
      position: 'absolute',
    },
    image: {
      borderRadius: '30px',
      maxWidth: '240px',
      padding: '0px',
      height: '755px',
      borderTopRightRadius: '0px',
      borderBottomRightRadius: '0px',
    },
    form: {
      borderRadius: '30px',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      maxWidth: '450px',
      padding: '20px',
      height: 'auto',
      borderTopLeftRadius: '0px',
      borderBottomLeftRadius: '0px',
    },
    title: {
      color: '#6c1c1d',
      fontSize: '30px',
      fontWeight: '600',
      paddingLeft: '30px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    input: {
      backgroundColor: '#333',
      color: '#fff',
      border: '1px solid rgba(105, 105, 105, 0.397)',
      borderRadius: '10px',
      fontSize: '1rem',
      padding: '15px 8px',
      outline: '0',
      width: '100%',
      marginTop: '20px',
      marginBottom: '20px',
    },
    flex: {
      display: 'flex',
      gap: '8px',
      marginTop: '15px',
    },
    submitButton: {
      border: 'none',
      backgroundColor: '#6c1c1d',
      marginTop: '10px',
      outline: 'none',
      padding: '10px',
      borderRadius: '10px',
      color: '#fff',
      fontSize: '16px',
      width: '100%',
      cursor: 'pointer',
    },
    submitButtonHover: {
      backgroundColor: '#661003f5',
    },
  };

  return (
    <div className=''>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.backButton}>
          {/* Add your BackButton component here */}
        </div>
        <img src={backgroundImage} style={styles.image} alt='Background' />
        <form onSubmit={handleSubmit} style={styles.form}>
          {loading ? <div>Submitting...</div> : null}
          <h2 style={styles.title}>Edit Vehicle</h2>
          <div style={styles.flex}>
            <label>
              <input
                type='text'
                name='cusID'
                placeholder='Customer ID'
                value={vehicle.cusID}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>
            <label>
              <input
                type='text'
                name='Register_Number'
                placeholder='Register Number'
                value={vehicle.Register_Number}
                onChange={handleChange}
                maxLength={8}
                required
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.flex}>
            <label>
              <input
                type='text'
                name='Make'
                placeholder='Make'
                value={vehicle.Make}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>
            <label>
              <input
                type='text'
                name='Model'
                placeholder='Model'
                value={vehicle.Model}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.flex}>
            <label>
              <input
                type='text'
                name='Year'
                placeholder='Year'
                value={vehicle.Year}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>
            <label>
              <input
                type='text'
                name='Engine_Details'
                placeholder='Engine Details'
                value={vehicle.Engine_Details}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.flex}>
            <label>
              <input
                type='text'
                name='Transmission_Details'
                placeholder='Transmission Details'
                value={vehicle.Transmission_Details}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>
            <label>
              <input
                type='text'
                name='Vehicle_Color'
                placeholder='Vehicle Color'
                value={vehicle.Vehicle_Color}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.flex}>
            <label>
              <input
                type='text'
                name='Condition_Assessment'
                placeholder='Condition Assessment'
                value={vehicle.Condition_Assessment}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>
            <label>
              <input
                type='text'
                name='Owner'
                placeholder='Owner'
                value={vehicle.Owner}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>
          </div>

          <div className='flex flex-col'>
            <label className='mb-2 font-semibold'>Vehicle Image:</label>
            <input
              type='file'
              onChange={handleImageChange}
              className='p-0 border border-gray-600 rounded-lg'
            />
          </div>

          <button
            type='submit'
            style={styles.submitButton}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#661003f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6c1c1d')}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default EditVehicle;
