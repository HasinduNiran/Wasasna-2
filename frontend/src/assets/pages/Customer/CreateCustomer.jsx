import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Logo from '../../images/logo.png';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../../firebase'; // assuming you initialized Firebase in this file
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com'; 

const CreateCustomer = () => {
    const [firstName, setFirstName] = useState('');
    const [image, setImage] = useState(null);
    const [cusID, setCusID] = useState('');
    const [lastName, setLastName] = useState('');
    const [NIC, setNIC] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reEnteredPassword, setReEnteredPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Initialize Firebase storage
    const storage = getStorage(app);

    const sendEmailToCustomer = (customerEmail, customerPassword) => { 
        const emailConfig = {
            serviceID: 'service_p1zv9rh',
            templateID: 'template_pua7ayd',
            userID: 'v53cNBlrti0pL_RxD'
        };

        emailjs.send(
            emailConfig.serviceID,
            emailConfig.templateID,
            {
                to_email: email,  // Use customerEmail passed as a parameter
                message: `Dear customer,\n\nYour account has been successfully created with us.\n\nYour Username is: ${cusID}\nYour Password is: ${password}\n\n\nBest regards,\nWasana Auto Service`
            },
            emailConfig.userID
        )
        .then((response) => {
            console.log('Email sent successfully!', response);
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        });
    };

    const validateInputs = () => {
        const namePattern = /^[a-zA-Z]+$/;
        const nicPattern = /^\d{12}$|^\d{11}V$/;
        const phonePattern = /^0\d{9}$/;

        if (!namePattern.test(firstName)) {
            Swal.fire('Invalid First Name', 'First Name cannot contain spaces, numbers, or special characters.', 'error');
            return false;
        }
        if (!namePattern.test(lastName)) {
            Swal.fire('Invalid Last Name', 'Last Name cannot contain spaces, numbers, or special characters.', 'error');
            return false;
        }
        if (!nicPattern.test(NIC)) {
            Swal.fire('Invalid NIC', 'NIC should be 12 digits or 11 digits followed by letter "V".', 'error');
            return false;
        }
        if (!phonePattern.test(phone)) {
            Swal.fire('Invalid Phone Number', 'Phone Number should be a 10-digit number starting with 0.', 'error');
            return false;
        }
        if (password !== reEnteredPassword) {
            Swal.fire('Password Mismatch', 'Passwords do not match.', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!validateInputs()) return;

        // Check if image is selected
        if (!image) {
            Swal.fire('Image Required', 'Please select an image.', 'error');
            return;
        }

        setLoading(true);
        setError('');

        // Create a storage reference
        const storageRef = ref(storage, `customer_images/${image.name}`);

        // Create upload task
        const uploadTask = uploadBytesResumable(storageRef, image);

        // Monitor the upload process
        uploadTask.on('state_changed',
            (snapshot) => {
                // Optional: you can handle the progress here
            },
            (uploadError) => {
                console.error('Error uploading image:', uploadError);
                Swal.fire('Upload Error', 'Error uploading image.', 'error');
                setLoading(false);
            },
            async () => {
                // When the upload is complete
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // Prepare the customer data
                    const data = {
                        image: downloadURL,
                        cusID,
                        firstName,
                        lastName,
                        NIC,
                        phone,
                        email,
                        password,
                    };

                    // Send a POST request to create a new customer
                    axios.post('http://localhost:8077/customer', data)
                    .then(() => {
                        setLoading(false);
                        // Show success SweetAlert
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: `Customer account created successfully for ${email}. Your Username is: ${cusID} and Password: ${password}`,
                            showCancelButton: true,
                            confirmButtonText: 'Send Account details to me',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                sendEmailToCustomer(email, password); // Call sendEmailToCustomer function with the email address and password
                            }
                            // After user acknowledges the success, navigate away
                            navigate('/');
                        });
                    })
                    .catch((error) => {
                        setLoading(false);
                        if (error.response && error.response.data) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Username or email is already in use. It should be unique!',
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'An error occurred. Please try again later.',
                            });
                        }
                        console.log(error);
                    });
                } catch (err) {
                    console.error('Error getting download URL:', err);
                    setLoading(false);
                }
            }
        );
    };

    return (
        <div className="font-[sans-serif] max-w-4xl flex items-center mx-auto md:h-screen p-4">
            <div className="grid bg-white md:grid-cols-3 items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-xl overflow-hidden">
                <div className="max-md:order-1 flex flex-col justify-center space-y-16 max-md:mt-16 min-h-full bg-gradient-to-r from-red-500 to-red-800 lg:px-8 px-4 py-4">
                    <img 
                        src={Logo} 
                        alt="logo" 
                        style={{ width: '60px', height: '60px', marginLeft : '37%', marginTop: '-60%' }} 
                    />
                    <div>
                        <h4 className="text-white text-lg font-semibold">Create Your Account</h4>
                        <p className="text-[13px] text-gray-300 mt-3 leading-relaxed">Welcome to our registration page! Get started by creating your account.</p>
                    </div>
                    <div>
                        <h4 className="text-white text-lg font-semibold">Simple & Secure Registration</h4>
                        <p className="text-[13px] text-gray-300 mt-3 leading-relaxed">Our registration process is designed to be straightforward and secure. We prioritize your privacy and data security.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="md:col-span-2 w-full py-6 px-6 sm:px-16">
                    <div className="mb-6">
                        <h3 className="text-gray-800 text-2xl font-bold">Create an account</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* User Name */}
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="cusID">User Name</label>
                            <input
                                type="text"
                                id="cusID"
                                value={cusID}
                                onChange={(e) => setCusID(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-red-500"
                                placeholder="Enter User Name"
                                required
                            />
                        </div>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-red-500"
                                placeholder="Enter first name"
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-red-500"
                                placeholder="Enter last name"
                                required
                            />
                        </div>

                        {/* NIC */}
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="NIC">NIC</label>
                            <input
                                type="text"
                                id="NIC"
                                value={NIC}
                                onChange={(e) => setNIC(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-red-500"
                                placeholder="Enter NIC"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="phone">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-red-500"
                                placeholder="Enter phone number"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-red-500"
                                placeholder="Enter email"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-red-500"
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        {/* Re-enter Password */}
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="reEnteredPassword">Re-enter Password</label>
                            <input
                                type="password"
                                id="reEnteredPassword"
                                value={reEnteredPassword}
                                onChange={(e) => setReEnteredPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-red-500"
                                placeholder="Re-enter password"
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-bold mb-2" htmlFor="image">Upload Image</label>
                            <input
                                type="file"
                                id="image"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-red-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-2 font-semibold text-white ${loading ? 'bg-red-400' : 'bg-red-600'} hover:bg-red-700 rounded-md focus:outline-none`}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    {/* Display error message if exists */}
                    {error && <p className="mt-4 text-red-500">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreateCustomer;
