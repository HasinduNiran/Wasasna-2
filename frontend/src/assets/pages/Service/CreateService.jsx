import React, { useState } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import img1 from '../../images/bg02.jpg'; // Assuming the same image is used
import BackButton from '../../components/BackButton';

const CreateService = () => {
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form submission
  
    if (parseFloat(price) < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Price',
        text: 'Price cannot be a negative number.',
      });
      return;
    }
  
    const data = {
      Servicename: serviceName,
      Price: price,
    };
  
    setLoading(true);
    try {
      await axios.post('http://localhost:8077/Service/', data);
      setLoading(false);
  
      Swal.fire({
        icon: 'success',
        title: 'Service created successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
  
      setTimeout(() => {
        navigate('/service');
      }, 1500);
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error creating service',
        text: 'Please check the console for more details.',
      });
      console.log(error);
    }
  };
  

  return (
    <div style={styles.container}>
      <div className="mar"><BackButton destination={`/service`} /></div>
      <img
        src={img1}
        style={styles.image}
        alt="background"
      />
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Service Details</h2>

        <label>
          <input
            type="text"
            placeholder="Service Name"
            required
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            style={styles.input}
          />
        </label>

        <label>
          <input
            type="text"
            placeholder="Price"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={styles.input}
          />
        </label>

        <button style={styles.submitButton} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: '"Noto Sans", sans-serif',
  },
  form: {
    borderRadius: '30px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    maxWidth: '360px',
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
  image: {
    borderRadius: '30px',
    maxWidth: '240px',
    padding: '0px',
    height: '330px',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
  },
};

export default CreateService;
