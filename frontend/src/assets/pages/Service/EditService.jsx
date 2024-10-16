import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import BackButton from '../../components/BackButton';
import img1 from '../../images/bg02.jpg';

const EditService = () => {
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8077/Service/${id}`)
      .then((response) => {
        setServiceName(response.data.Servicename);
        setPrice(response.data.Price); // Set the price
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error happened. Please check the console.',
        });
        console.log(error);
      });
  }, [id]);

  const handleEditService = async (e) => {
    e.preventDefault();
    if (!serviceName || !price) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    const data = {
      Servicename: serviceName.toUpperCase(),
      Price: price,
    };

    setLoading(true);

    try {
      await axios.put(`http://localhost:8077/Service/${id}`, data);
      setLoading(false);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Service data updated successfully!',
      }).then(() => {
        navigate('/Service/dashboard');
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error happened. Please check the console.',
      });
      console.log(error);
    }
  };

  return (
    <div style={styles.container}>
      <div className="mar">
        <BackButton destination={`/service`} />
      </div>

      <img
        src={img1}
        style={styles.image}
        alt="background"
      />

      <form style={styles.form} onSubmit={handleEditService}>
        <h2 style={styles.title}>Edit Service</h2>

        <label>
          <input
            type="text"
            placeholder="Service Name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label>
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={styles.input}
          />
        </label>

        <button
          type="submit"
          style={styles.submitButton}
        >
          Submit
        </button>

        {loading && <Spinner />}
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
    // background: `url(${img1}) no-repeat center center`,
    backgroundSize: 'cover',
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
    textAlign: 'center',
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

export default EditService;
