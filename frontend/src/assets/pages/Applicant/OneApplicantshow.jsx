import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { MdOutlineDelete } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai';
import Swal from 'sweetalert2';
import Navbar from '../Navbar/Navbar';
import Footer from '../footer/Footer';

const ApplicantsList = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cusID } = useParams();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`http://localhost:8077/applicant/${cusID}`);
        if (response.data && response.data.length > 0) {
          setApplicants(response.data);
        } else {
          setError('No applicants found.');
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setError('Error fetching applicants.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [cusID]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won’t be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8077/applicant/${id}`)
          .then(() => {
            setApplicants(applicants.filter((applicant) => applicant._id !== id));
            Swal.fire('Deleted!', 'The applicant record has been deleted.', 'success');
          })
          .catch((error) => {
            console.error('Error deleting applicant:', error);
            Swal.fire('Error!', 'Failed to delete the applicant.', 'error');
          });
      }
    });
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-6 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6">Applicants List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {applicants.length === 0 ? (
            <p className="p-4">No applicants found.</p>
          ) : (
            applicants.map((applicant) => (
              <div key={applicant._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                {/* Conditional check for image or PDF */}
                

                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{`${applicant.FirstName || 'Unknown'} ${applicant.LastName || 'Name'}`}</h3>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {applicant.Email || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <strong>Job Type:</strong> {applicant.JobType || 'Not specified'}
                  </p>
                  <p className="text-gray-700">
                    <strong>Telphonr:</strong> {applicant.Number || 'N/A'}
                  </p>
                  {applicant.image && (
                                            <p>
                                                CV:{' '}
                                                <a href={applicant.image} target="_blank" rel="noopener noreferrer">
                                                <strong>View cv:</strong> 
                                                </a>
                                            </p>
                                        )}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(applicant._id)}
                    >
                      <MdOutlineDelete className="inline-block" />
                    </button>
                    <Link to={`/applicant/edit/${applicant._id}`} className="text-yellow-600 hover:text-yellow-800">
                      <AiOutlineEdit className="inline-block" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplicantsList;
