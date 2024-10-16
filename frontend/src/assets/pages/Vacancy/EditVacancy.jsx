import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import img1 from '../../images/bg02.jpg';
import '../CSS/CreateVacancy.css';
import BackButton from '../../components/BackButton';
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/Footer';

const EditVacancy = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams(); // Get vacancy ID from URL

  useEffect(() => {
    const fetchVacancyData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8077/vacancy/${id}`);
        const vacancy = response.data;
        setName(vacancy.Name);
        setDescription(vacancy.Description);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error fetching vacancy',
          text: 'Unable to fetch vacancy details',
        });
      }
    };

    fetchVacancyData();
  }, [id]);

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    if (!isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Problem with Vacancy update',
        html: Object.values(errors).map((error) => `<p>${error}</p>`).join(''),
      });
    }

    setErrors(errors);
    return isValid;
  };

  const handleUpdateVacancy = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const itemNameUpperCase = name.toUpperCase();

    const data = {
      Name: itemNameUpperCase, // Save name in uppercase
      Description: description,
    };

    try {
      await axios.put(`http://localhost:8077/vacancy/${id}`, data);

      Swal.fire({
        icon: 'success',
        title: 'Job item updated successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      setTimeout(() => {
        setLoading(false);
        navigate('/vacancy');
      }, 1500);
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error updating job item',
        text: 'Please check the job item name or try again later',
      });
      console.error(error);
    }
  };

  return (
    <div className=''><Navbar/>
    <div style={styles.container}>
       <div className="mar"><BackButton destination={`/vacancy`}/></div>
      <img
        src={img1}
        style={styles.image}
        alt="car"
      />
      <form style={styles.form} onSubmit={handleUpdateVacancy}>
       
        <h2 style={styles.title}>Edit Job Description</h2>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <label>
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />
              {errors.name && <p style={styles.error}>{errors.name}</p>}
            </label>
            <label>
              <input
                type="text"
                placeholder="Description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.input}
              />
              {errors.description && <p style={styles.error}>{errors.description}</p>}
            </label>

            <button style={styles.submitButton} type="submit">
              Update
            </button>
          </>
        )}
      </form>
    </div>
    <Footer/>
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
  submitButtonHover: {
    backgroundColor: '#661003f5',
  },
  error: {
    color: 'red',
    fontSize: '0.875rem',
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

export default EditVacancy;
