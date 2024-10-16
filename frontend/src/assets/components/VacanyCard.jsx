import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';


const VacancyCard = () => {
  const [loading, setLoading] = useState(true);
  const [vacancy, setVacancy] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3); // Initially show 3 cards
  const { cusID } = useParams();




  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8077/vacancy")
      .then((response) => {
        setVacancy(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Show 3 more cards
  };

  return (
    <div>
      {loading ? (
        <div className="text-gray-50">Loading...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vacancy.slice(0, visibleCount).map((vacancyItem) => (
            <div key={vacancyItem.id} className="group bg-black p-4 transition-all duration-300 hover:rotate-1 lg:p-8">
              <div className="mb-3 text-right">
                <button className="text-gray-50 transition-all duration-300 hover:scale-110 hover:text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-x-2">

                <div>
                  <h3 className="text-xl font-bold text-gray-50">{vacancyItem.CompanyName}</h3>
                  <span className="text-xs text-gray-300">{vacancyItem.Location}</span>
                </div>
              </div>
              <div className="my-4">
                <h3 className="text-2xl font-medium text-gray-200">{vacancyItem.Name}</h3>
                <div className="mt-2 text-sm text-gray-400">{vacancyItem.Description}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-50">Full Time</span>
                <button className="font-medium text-red-500 transition-all duration-300 group-hover:text-red-500/80">
                  <Link to={`/applicant/create/${cusID}`}>Apply Now</Link>
                </button>

              </div>
            </div>

          ))}
        </div>
      )}
      {visibleCount < vacancy.length && (
        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-300 to-red-500 group-hover:from-red-300 group-hover:to-red-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-red-400 dark:focus:ring-red-800">
          <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-black rounded-md group-hover:bg-opacity-0" onClick={handleSeeMore}>
            See More...
          </span>
        </button>

      )}
    </div>
  );
};

export default VacancyCard;
