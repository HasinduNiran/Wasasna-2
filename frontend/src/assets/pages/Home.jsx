import React, { useEffect,Link, useState } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faBars,
  faUser,
  faMapMarkerAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./home.css";
import logo from "../images/logo.png";
import car01 from "../images/girl.jpg";
import profileImage from "../images/profile.jpg";
import axios from "axios";
import { FcFeedback } from "react-icons/fc";
import VacanyCard from '../components/VacanyCard2'
import PriceCard from "../components/PriceCard";
const Home = () => {
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const handleSeeMore = () => {
    setVisibleCount((prevCount) => Math.min(prevCount + 4, promotions.length));
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        document.querySelector(".navbar").classList.add("sticky");
      } else {
        document.querySelector(".navbar").classList.remove("sticky");
      }

      if (window.scrollY > 500) {
        document.querySelector(".scroll-up-btn").classList.add("show");
      } else {
        document.querySelector(".scroll-up-btn").classList.remove("show");
      }
    };

    window.addEventListener("scroll", handleScroll);

    document.querySelector(".scroll-up-btn").addEventListener("click", () => {
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.querySelectorAll(".navbar .menu li a").forEach((anchor) => {
      anchor.addEventListener("click", () => {
        document.documentElement.style.scrollBehavior = "smooth";
      });
    });

    document.querySelector(".menu-btn").addEventListener("click", () => {
      document.querySelector(".navbar .menu").classList.toggle("active");
      document.querySelector(".menu-btn i").classList.toggle("active");
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
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

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8077/Promotion");
        setPromotions(response.data);
      } catch (error) {
        setError("Failed to fetch promotions.");
        console.error("Error fetching promotions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);
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
            <img
              src={logo}
              alt="logo"
              style={{ width: "60px", height: "60px" }}
            />
          </div>
          <ul className="menu">
            <li>
              <a href="#home" className="menu-btn">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="menu-btn">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="menu-btn">
                Services
              </a>
            </li>
            
            <li>
              <a href="#teams" className="menu-btn">
                Feedbacks
              </a>
            </li>
            <li>
              <a href="/str" className="menu-btn">
                Store
              </a>
            </li>
            
          </ul>
          <div className="menu-btn">
            <FontAwesomeIcon icon={faBars} />
          </div>
          {/* Login Section */}
          <div
            className="login-section"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src={profileImage}
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            <a
              href="/cLogin"
              className="login-btn"
              style={{ textDecoration: "none", color: "#fff" }}
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      <section className="home" id="home">
        <div className="max-width">
          <div className="home-content">
            <div className="text-1">Wel come to</div>
            <div className="text-2">
              <span className="letter" style={{ fontSize: "90px" }}>
                W
              </span>
              <span className="letter" style={{ fontSize: "60px" }}>
                A
              </span>
              <span className="letter" style={{ fontSize: "60px" }}>
                S
              </span>
              <span className="letter" style={{ fontSize: "60px" }}>
                A
              </span>
              <span className="letter" style={{ fontSize: "60px" }}>
                N
              </span>
              <span className="letter" style={{ fontSize: "60px" }}>
                A
              </span>
            </div>

            <div className="text-3">
              Service Center <span className="typing"></span>
            </div>
            <a href="#about">About US</a>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="max-width">
          <h2 className="title">Vacancys</h2>
          <VacanyCard/>
        </div>
      </section>

    


      <section className="about" id="about">
        <div className="max-width">
          <h2 className="title" style={{ color: "white" }}>
            About US
          </h2>
          <div className="about-content">
            <div className="column left">
              <a>
                <img src={car01} alt="car" />
              </a>
            </div>
            <div className="column right">
              <div className="text blink" style={{ color: "white" }}>
                Welcome to Wasana Service, where excellence in automotive care
                meets unparalleled customer satisfaction.
                <span className="typing-2"></span>
              </div>

              <p style={{ color: "white" }}>
                With 20 years of experience in the industry, we pride ourselves
                on providing top-notch service for all your vehicle maintenance
                and repair needs.
              </p>
              <br />
              <p style={{ fontStyle: "italic", color: "white" }}>
                At Wasana Service, we are dedicated to maintaining the highest
                standards of service and professionalism. We understand that
                your vehicle is a significant investment, and we treat every car
                with the care and respect it deserves.
              </p>
              <a href="#services" style={{ color: "white" }}>
                Our Skills
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="max-width">
          <h2 className="title">Our Skills</h2>
          <div className="serv-content">
            <div className="card">
              <div className="box">
                <FontAwesomeIcon icon={["fas", "paint-brush"]} />
                <div className="text">Diagnostic Skills:</div>
                <p>
                  {" "}
                  Ability to identify and troubleshoot issues with a vehicle’s
                  systems, such as the engine, transmission, brakes, and
                  electrical components. This often involves using diagnostic
                  tools and understanding error codes.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="box">
                <FontAwesomeIcon icon={["fas", "chart-line"]} />
                <div className="text">Mechanical Repair </div>
                <p>
                  Proficiency in performing routine maintenance tasks (like oil
                  changes, brake replacements, and tire rotations) as well as
                  more complex repairs.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="box">
                <FontAwesomeIcon icon={["fas", "code"]} />
                <div className="text">Customer Communication</div>
                <p>
                  Effective communication skills to explain issues, repair
                  needs, and costs to customers in a clear and understandable
                  manner, ensuring they make informed decisions about their
                  vehicle’s service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

     <section className="tablee">
  <div className="pricing flex flex-wrap justify-center w-full mx-auto mb-12">
   
      <PriceCard />
   
  </div>
</section>

      <section className="teams" id="teams">
        <div className="max-width">
          <h2 className="title">FeedBacks</h2>
          <Slider {...settings}>
            {filteredFeedbacks.map((feedback) => (
              <div className="card" key={feedback.id}>
                <div className="flex w-full p-4 max-w-lg min-h-40 flex-col rounded-lg bg-black shadow-sm border border-slate-200 my-6 mx-10">
                  <div className="flex items-center gap-4 text-slate-800">
                    <img
                      src="https://www.drupal.org/files/project-images/Website%20Feedback-Icon.png"
                      alt="feedback"
                      className="relative inline-block h-[58px] w-[58px] !rounded-full object-cover object-center"
                    />
                    <div className="flex w-full flex-col">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xl font-semibold text-gray-100">
                          {feedback.name}
                        </h5>
                        <div className="flex items-center gap-1">
                          {renderStars(feedback.star_rating)}
                        </div>
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
              <h2 class="text-white text-lg m-5 opacity-0 transition-opacity duration-1000">
                Al Pacino
              </h2>
              <div class="icons absolute fill-white h-[130px] top-[226px] w-[50px] flex flex-col items-center justify-around"></div>
            </div>
          </div>
          <div class="card card1 flex justify-center items-center h-[379px] w-[300px] bg-black rounded-lg shadow-[0_70px_63px_-60px_rgba(0,0,0,1)] overflow-hidden relative transition-all duration-800 bg-[url('https://img.freepik.com/premium-photo/inspecting-uneven-tire-wear-diagnosing-alignment-issues_1314467-106533.jpg?w=740')] hover:bg-left hover:bg-no-repeat hover:bg-cover hover:bg-[size:600px]">
            <div class="border h-[369px] w-[290px] bg-transparent rounded-lg border-white border-opacity-0 hover:border-opacity-100 transition-all duration-1000 relative">
              <h2 class="text-white text-lg m-5 opacity-0 transition-opacity duration-1000">
                Ben Stiller
              </h2>
              <div class="icons absolute fill-white h-[130px] top-[226px] w-[50px] flex flex-col items-center justify-around"></div>
            </div>
          </div>
          <div class="card card2 flex justify-center items-center h-[379px] w-[300px] bg-black rounded-lg shadow-[0_70px_63px_-60px_rgba(0,0,0,1)] overflow-hidden relative transition-all duration-800 bg-[url('https://img.freepik.com/free-photo/monochrome-portrait-retro-man-doing-housework-household-chores_23-2151448065.jpg?t=st=1725647669~exp=1725651269~hmac=a32b091a4ff63a32793280a842574db255c00f62443469616611d8d3a8fbed5f&w=360')] hover:bg-left hover:bg-no-repeat hover:bg-cover hover:bg-[size:600px]">
            <div class="border h-[369px] w-[290px] bg-transparent rounded-lg border-white border-opacity-0 hover:border-opacity-100 transition-all duration-1000 relative">
              <h2 class="text-white text-lg m-5 opacity-0 transition-opacity duration-1000">
                Patrick Stewart
              </h2>
              <div class="icons absolute fill-white h-[130px] top-[226px] w-[50px] flex flex-col items-center justify-around"></div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <span>
          Created By <a href="">Wasana Service</a> |{" "}
          <FontAwesomeIcon icon={faCopyright} /> 2024 All rights reserved.
        </span>
      </footer>
    </div>
  );
};

export default Home;
