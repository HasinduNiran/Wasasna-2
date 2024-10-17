import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faBars, faUser, faMapMarkerAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './home.css';
import logo from '../images/logo.png';
import car01 from '../images/girl.jpg';
import { FcFeedback } from "react-icons/fc";
import PriceCard from '../components/PriceCard'
import VacanyCard from '../components/VacanyCard'

const ReadOneHome = () => {
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const { cusID } = useParams();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const [promotions, setPromotions] = useState([]);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
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
    setVisibleCount(prevCount => Math.min(prevCount + 4, promotions.length)); 
  };

  console.log("Visible Count:", visibleCount); 

  const navigate = useNavigate(); 


  useEffect(() => {
    if (cusID) {
      fetchData();
    }
  }, [cusID]);

  const handleAddFeedback = () => {
    navigate(`/feedback/create/${cusID}`); // Navigate to Add Feedback page
  };



  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8077/Customer/${cusID}`);
      console.log(response.data); // Check if cusID is available
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 20) {
          navbar.classList.add('sticky');
        } else {
          navbar.classList.remove('sticky');
        }
      }

      const scrollUpBtn = document.querySelector('.scroll-up-btn');
      if (scrollUpBtn) {
        if (window.scrollY > 500) {
          scrollUpBtn.classList.add('show');
        } else {
          scrollUpBtn.classList.remove('show');
        }
      }
    };

    const scrollToTop = () => {
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const smoothScroll = () => {
      document.documentElement.style.scrollBehavior = 'smooth';
    };

    const toggleMenu = () => {
      const menu = document.querySelector('.navbar .menu');
      const menuBtnIcon = document.querySelector('.menu-btn i');
      if (menu && menuBtnIcon) {
        menu.classList.toggle('active');
        menuBtnIcon.classList.toggle('active');
      }
    };

    window.addEventListener('scroll', handleScroll);

    const scrollUpBtn = document.querySelector('.scroll-up-btn');
    if (scrollUpBtn) {
      scrollUpBtn.addEventListener('click', scrollToTop);
    }

    document.querySelectorAll('.navbar .menu li a').forEach(anchor => {
      anchor.addEventListener('click', smoothScroll);
    });

    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', toggleMenu);
    }

    if (cusID) {
      fetchData();
    }

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (scrollUpBtn) {
        scrollUpBtn.removeEventListener('click', scrollToTop);
      }

      document.querySelectorAll('.navbar .menu li a').forEach(anchor => {
        anchor.removeEventListener('click', smoothScroll);
      });

      if (menuBtn) {
        menuBtn.removeEventListener('click', toggleMenu);
      }
    };
  }, [cusID]);

  useEffect(() => {
    axios
      .get("http://localhost:8077/feedback")
      .then((response) => {
        // Filter only the feedbacks with status "approved"
        const approvedFeedbacks = response.data.filter(feedback => feedback.status === 'approved');
        setFilteredFeedbacks(approvedFeedbacks);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
        setError("Error fetching feedbacks.");
        setLoading(false);
      });
}, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const renderStars = (rating) => {
    const totalStars = 5;
    let stars = [];
    for (let i = 0; i < totalStars; i++) {
      if (i < rating) {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-yellow-300 ms-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-gray-300 ms-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div>
      <div className="scroll-up-btn">
        <FontAwesomeIcon icon={faAngleUp} />
      </div>
      <nav className="navbar">
        <div className="max-width">
          <div className="logo">
            <img src={logo} alt="logo" style={{ width: '60px', height: '60px' }} />
          </div>
          <ul className="menu">
          
            <li><Link className="nav-link" to={`/Booking/create/${userData.cusID}`}>Booking</Link></li>
            <li>
              {userData.cusID ? (
                <Link className="nav-link" to={`/Inquire/create/${userData.cusID}`}>Create Inquire</Link>
              ) : (
                'Loading...'
              )}
            </li>
            <li>
              <a href={`/str/${userData.cusID}`} className="menu-btn">
                Store
              </a>
            </li>
            
            <li><Link className="nav-link" to={`/feedback/create/${userData.cusID}`}>Give FeedBack</Link></li>
          </ul>
          <div className="menu-btn">
            <FontAwesomeIcon icon={faBars} />
          </div>
          {/* Login Section */}
          <div className="login-section" style={{ display: 'flex', alignItems: 'center' }}>
            <Link className="nav-link" to={`/customer/${userData.cusID}`}>
              <img
                src={userData.image}
                alt="Profile"
                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
              />
            </Link>
            <p className="mb-0" style={{ color: 'red' }}>Welcome </p><span>&nbsp;</span><span>&nbsp;</span><p className="mb-0" style={{ color: 'green' }}> {userData.firstName}!</p>
            {/* <a href="#login" className="login-btn" style={{ textDecoration: 'none', color: '#fff' }}>Login</a> */}
          </div>
        </div>
      </nav>


      <section className="home" id="home">
        <div className="max-width">
          <div className="home-content">
            <div className="text-1">Wel come to</div>
            <div className="text-2">
              <span className="letter" style={{ fontSize: "90px" }}>W</span>
              <span className="letter" style={{ fontSize: "60px" }}>A</span>
              <span className="letter" style={{ fontSize: "60px" }}>S</span>
              <span className="letter" style={{ fontSize: "60px" }}>A</span>
              <span className="letter" style={{ fontSize: "60px" }}>N</span>
              <span className="letter" style={{ fontSize: "60px" }}>A</span>
            </div>


            <div className="text-3">Service Center <span className="typing"></span></div>
            <a href="#about">About US</a>
          </div>
        </div>
      </section>


      <section className="about" id="about" >
        <div className="max-width">
          <h2 className="title" style={{ color: 'white' }}>About US</h2>
          <div className="about-content">
            <div className="column left">
              <a>
                <img src={car01} alt="car" />
              </a>
            </div>
            <div className="column right">
              <div className="text blink" style={{ color: 'white' }}>
                Welcome to Wasana Service, where excellence in automotive care meets unparalleled customer satisfaction.
                <span className="typing-2"></span>
              </div>


              <p style={{ color: 'white' }}>
                With 20 years of experience in the industry, we pride ourselves on providing top-notch service for all your vehicle maintenance and repair needs.
              </p>
              <br />
              <p style={{ fontStyle: 'italic', color: 'white' }}>
                At Wasana Service, we are dedicated to maintaining the highest standards of service and professionalism. We understand that your vehicle is a significant investment, and we treat every car with the care and respect it deserves.
              </p>
              <a href="#services" style={{ color: 'white' }}>Our Skills</a>
            </div>

          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="max-width">
          <h2 className="title">Vacancys</h2>
          <VacanyCard/>
        </div>
      </section>


   
      
      <section className="tablee">
      <div className="pricing flex flex-wrap justify-center w-full mx-auto mb-12">
        {loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (<Link className="nav-link" to={`/Booking/create/${userData.cusID}`}>
          <PriceCard promotions={promotions.slice(0, visibleCount)} /></Link>
        )}
      </div>
     
    </section>





    <section className="teams" id="teams">
  <div className="max-width">
    <h2 className="title">FeedBacks</h2>
    <Slider {...settings}>
      {filteredFeedbacks.map((feedback) => (
        <div className="card" key={feedback.id}>
          <div className="flex w-full p-4 max-w-lg min-h-40 flex-col rounded-lg bg-black shadow-sm border border-slate-200 my-6 mx-10"> {/* Adjust mx- to control horizontal spacing */}
            <div className="flex items-center gap-4 text-slate-800">
              <img
                src="https://www.drupal.org/files/project-images/Website%20Feedback-Icon.png"
                alt="feedback"
                className="relative inline-block h-[58px] w-[58px] !rounded-full object-cover object-center"
              />
              <div className="flex w-full flex-col">
                <div className="flex items-center justify-between">
                  <h5 className="text-xl font-semibold text-gray-100">{feedback.name}</h5>
                  <div className="flex items-center gap-1">{renderStars(feedback.star_rating)}</div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-base text-gray-400 font-light leading-normal break-words">
                {feedback.message}
              </p>
            </div>
          </div>
       
        </div>
    
      ))}
    </Slider>
  </div>
</section>


      <section className="contact" id="contact">
        <div class="container flex justify-around items-center h-screen w-screen max-h-[800px] max-w-[1280px] min-h-[600px] min-w-[1000px] mx-auto">
          <div class="card card0 flex justify-center items-center h-[379px] w-[300px] bg-black rounded-lg shadow-[0_70px_63px_-60px_rgba(0,0,0,1)] overflow-hidden relative transition-all duration-800 bg-[url('https://img.freepik.com/free-photo/workman-wearing-hard-hat-working-with-metal-constructions-factory_1303-26647.jpg?t=st=1725648007~exp=1725651607~hmac=ea8e3ec74a78621303c7f5a08712dcfed647e7c4c10d9c3c45dae05ef8ab597d&w=360')] hover:bg-left hover:bg-no-repeat hover:bg-cover hover:bg-[size:600px]">
            <div class="border h-[369px] w-[290px] bg-transparent rounded-lg border-white border-opacity-0 hover:border-opacity-100 transition-all duration-1000 relative">
              <h2 class="text-white text-lg m-5 opacity-0 transition-opacity duration-1000">Al Pacino</h2>
              <div class="icons absolute fill-white h-[130px] top-[226px] w-[50px] flex flex-col items-center justify-around">

              </div>
            </div>
          </div>
          <div class="card card1 flex justify-center items-center h-[379px] w-[300px] bg-black rounded-lg shadow-[0_70px_63px_-60px_rgba(0,0,0,1)] overflow-hidden relative transition-all duration-800 bg-[url('https://img.freepik.com/premium-photo/inspecting-uneven-tire-wear-diagnosing-alignment-issues_1314467-106533.jpg?w=740')] hover:bg-left hover:bg-no-repeat hover:bg-cover hover:bg-[size:600px]">
            <div class="border h-[369px] w-[290px] bg-transparent rounded-lg border-white border-opacity-0 hover:border-opacity-100 transition-all duration-1000 relative">
              <h2 class="text-white text-lg m-5 opacity-0 transition-opacity duration-1000">Ben Stiller</h2>
              <div class="icons absolute fill-white h-[130px] top-[226px] w-[50px] flex flex-col items-center justify-around">

              </div>
            </div>
          </div>
          <div class="card card2 flex justify-center items-center h-[379px] w-[300px] bg-black rounded-lg shadow-[0_70px_63px_-60px_rgba(0,0,0,1)] overflow-hidden relative transition-all duration-800 bg-[url('https://img.freepik.com/free-photo/monochrome-portrait-retro-man-doing-housework-household-chores_23-2151448065.jpg?t=st=1725647669~exp=1725651269~hmac=a32b091a4ff63a32793280a842574db255c00f62443469616611d8d3a8fbed5f&w=360')] hover:bg-left hover:bg-no-repeat hover:bg-cover hover:bg-[size:600px]">
            <div class="border h-[369px] w-[290px] bg-transparent rounded-lg border-white border-opacity-0 hover:border-opacity-100 transition-all duration-1000 relative">
              <h2 class="text-white text-lg m-5 opacity-0 transition-opacity duration-1000">Patrick Stewart</h2>
              <div class="icons absolute fill-white h-[130px] top-[226px] w-[50px] flex flex-col items-center justify-around">

              </div>
            </div>
          </div>
        </div>

      </section>

      <footer>
        <span>Created By <a href="">Wasana service</a> | <FontAwesomeIcon icon={faCopyright} /> 2024 All rights reserved.</span>
      </footer>
    </div>
  );
};

export default ReadOneHome;
