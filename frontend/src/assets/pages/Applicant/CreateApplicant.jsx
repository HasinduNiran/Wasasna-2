import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import img1 from '../../images/bg02.jpg';
import BackButton from '../../components/BackButton';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../../firebase';
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/Footer';
import { useParams } from 'react-router-dom';
import emailjs from 'emailjs-com';

const CreateApplicant = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobTypes, setJobTypes] = useState([]);
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const storage = getStorage(app);
  const { cusID } = useParams();

  useEffect(() => {
    if (cusID) {
      fetchData();
    }
  }, [cusID]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const vacancyResponse = await axios.get('http://localhost:8077/vacancy');
      setJobTypes(vacancyResponse.data);
    } catch (error) {
      console.error('Error fetching job types or cusID:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    const namePattern = /^[a-zA-Z]+$/;

    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    } else if (!namePattern.test(firstName)) {
      errors.firstName = 'First name cannot contain numbers, special characters, or spaces';
      isValid = false;
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    } else if (!namePattern.test(lastName)) {
      errors.lastName = 'Last name cannot contain numbers, special characters, or spaces';
      isValid = false;
    }

    if (!number.trim()) {
      errors.number = 'Phone number is required';
      isValid = false;
    } else if (!/^[0][0-9]{9}$/.test(number)) {
      errors.number = 'Phone number must start with 0 and be 10 digits long';
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!jobType.trim()) {
      errors.jobType = 'Job type is required';
      isValid = false;
    }

    if (!cvFile) {
      errors.cvFile = 'PDF CV upload is required';
      isValid = false;
    } else if (!cvFile.type === 'application/pdf') {
      errors.cvFile = 'Only PDF files are allowed';
      isValid = false;
    }

    if (!isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Problem with Applicant submission',
        html: Object.values(errors).map(error => `<p>${error}</p>`).join(''),
      });
    }

    setErrors(errors);
    return isValid;
  };

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleSaveApplicant = async () => {
    if (!validateForm()) {
      return;
    }

    Swal.fire({
      title: 'Confirm Submission',
      text: 'Are you sure you want to submit your application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    }).then((result) => {
      if (result.isConfirmed) {
        proceedWithSave();
      }
    });
  };

  const proceedWithSave = async () => {
    setLoading(true);

    try {
      let fileUrl = '';
      if (cvFile) {
        const storageRef = ref(storage, `customer_images/${cvFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, cvFile);

        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.error('Error uploading PDF to Firebase:', error);
            Swal.fire({
              icon: 'error',
              title: 'Upload Error',
              text: `Failed to upload file: ${error.message}`,
            });
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              fileUrl = downloadURL;
              saveApplicant(fileUrl);
            });
          }
        );
      } else {
        saveApplicant(fileUrl);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error saving applicant:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error creating applicant. Please try again.',
      });
    }
  };

  const saveApplicant = async (fileUrl) => {
    const data = {
      FirstName: firstName,
      LastName: lastName,
      Number: number,
      Email: email,
      JobType: jobType,
      image: fileUrl,  // Saving CV URL instead of image
      cusID: cusID,
    };

    try {
      await axios.post('http://localhost:8077/applicant', data);
      Swal.fire({
        icon: 'success',
        title: 'Applicant created successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      // **Second SweetAlert before sending email**
      Swal.fire({
        title: 'Send Confirmation Email?',
        text: `Do you want to send a confirmation email to ${email}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, send email!'
      }).then((result) => {
        if (result.isConfirmed) {
          sendConfirmationEmail();
        } else {
          navigate(`/applicant/${cusID}`);
        }
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Applicant submission failed',
        text: 'Please check the provided details or try again later',
      });
      console.error(error);
      console.log(cusID);
    }
  };

  const sendConfirmationEmail = () => {
    emailjs.send(
      'service_3p901v6',          // Replace with your EmailJS service ID
      'template_cwl7ahv',         // Replace with your EmailJS template ID
      {
        to_name: `${firstName} ${lastName}`,  // Full name of the applicant
        to_email: email,                      // Applicant's email address
        job_type: jobType,                    // Selected job type
        message: `Dear ${firstName} ${lastName}, your application for the ${jobType} position has been submitted successfully.` // Message to be included in the email
      },
      '-r5ctVwHjzozvGIfg'         // Replace with your EmailJS user ID
    ).then((result) => {
      console.log('Email sent successfully:', result.text);
      Swal.fire({
        icon: 'success',
        title: 'Email sent successfully',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate(`/applicant/${cusID}`);
    }).catch((error) => {
      console.error('Error sending email:', error);
      Swal.fire({
        icon: 'error',
        title: 'Email Error',
        text: 'Error sending confirmation email. Please try again later.',
      });
    });
  };


  return (
    <div className=''>
      <Navbar />
      {loading && <Spinner />}
      <div style={styles.container}>
        <img
          src={img1}
          style={styles.image}
          alt="background"
        />
        <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleSaveApplicant(); }}>
          <h2 style={styles.title}>Apply Applicant</h2>
          <div style={styles.flex}>
            <label>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={styles.input}
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={styles.input}
              />
            </label>
          </div>
          <label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </label>
          <label>
            <input
              type="text"
              placeholder="Phone Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              style={styles.input}
            />
          </label>
          <label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              required
              style={styles.input}
            >
              <option value="">Select Job Type</option>
              {jobTypes.map((job) => (
                <option key={job._id} value={job.jobType}>
                  {job.Name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Upload CV (PDF):</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="application/pdf"
              className="p-0 border border-gray-600 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            style={styles.submitButton}
          >
            Submit
          </button>

          <Link to={`/applicant/${cusID}`} style={styles.submitButton2}>
            My Application
          </Link>
        </form>
      </div>
      <Footer />
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
    width: 'auto%',
    cursor: 'pointer',
  },
  submitButton2: {
    border: "none",
    backgroundColor: "#6c1c1d",
    marginTop: "10px",
    marginLeft: "30%",
    outline: "none",
    padding: "10px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "16px",
    width: "auto",

    cursor: "pointer",
    textDecoration: "none",
  },

  error: {
    color: 'red',
    fontSize: '0.875rem',
  },
  image: {
    borderRadius: '30px',
    maxWidth: '240px',
    padding: '0px',
    height: '598px',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
  },
  flex: {
    display: 'flex',
    gap: '8px',
    marginTop: '15px',
  }
};

export default CreateApplicant;
