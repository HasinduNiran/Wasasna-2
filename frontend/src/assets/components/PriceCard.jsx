import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PriceCard = ({ limit }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(limit);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8077/Promotion');
        setPromotions(response.data);
      } catch (error) {
        setError('Failed to fetch promotions.');
        console.error('Error fetching promotions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  const handleSeeMore = () => {
    setVisibleCount(prevCount => Math.min(prevCount + limit, promotions.length));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
      <div className="mb-10 space-y-4 px-6 md:px-0">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl md:text-4xl">Pricing</h2>
      </div>

      {loading ? (
        <p className="text-white text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1  md:grid-cols-4 gap-4">
          {promotions.slice(0, visibleCount).map((promotion) => (
            <div
              key={promotion.id}
              className="flex flex-col items-center aspect-auto p-4 sm:p-8 border rounded-3xl bg-gray-900 border-gray-700 shadow-gray-600/10 shadow-none m-2 flex-1 max-w-md"
            >
              <h2 className="text-lg sm:text-xl font-medium text-white mb-2">{promotion.title}</h2>
              <p className="text-lg sm:text-xl text-center mb-8 mt-4 text-gray-400">
                <span className="text-3xl sm:text-4xl font-bold text-white">{promotion.discount}%</span> / Month
              </p>
              <ul className="list-none list-inside mb-6 text-center text-gray-300">
                <li>{promotion.description}</li>
                <li>{new Date(promotion.startDate).toLocaleDateString()}</li>
                <li>{new Date(promotion.endDate).toLocaleDateString()}</li>
              </ul>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="lemonsqueezy-button relative flex h-9 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full before:bg-white before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                href="https://example.com/starter-plan"
              >
            
             <span className="relative text-sm font-semibold text-black">Get Started</span>
                     
             </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceCard;
