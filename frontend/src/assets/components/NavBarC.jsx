import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faBars,
  faUser,
  faMapMarkerAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import profileImage from "../images/profile.jpg";
import logo from "../images/logo.png";

const NavBarC = () => {
  return (
    <div>
      <nav className="navbar bg-black">
        <div className="max-width">
          <div className="logo">
            <img
              src={logo}
              alt="logo"
              style={{ width: "40px", height: "40px" }}
            />
          </div>
          <ul className="menu">
            <li>
              <a href="/" className="menu-btn">
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
              <a href="#skills" className="menu-btn">
                Pricing
              </a>
            </li>
            <li>
              <a href="#teams" className="menu-btn">
                Team
              </a>
            </li>
            <li>
              <a href="/str" className="menu-btn">
                Store
              </a>
            </li>
            <li>
              <a href="#contact" className="menu-btn">
                Contact
              </a>
            </li>
          </ul>
          <div className="menu-btn">
            <FontAwesomeIcon icon={faBars} />
          </div>
          {/* Login Section */}
          {/* <div
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
          </div> */}
        </div>
      </nav>
    </div>
  );
};

export default NavBarC;
