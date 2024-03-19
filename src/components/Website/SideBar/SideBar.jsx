import logo from "../../../assets/logo-removebg-preview.png";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import Logout from "../Popups/Logout";

function SideBar() {
  // State to track the active link
  const [activeLink, setActiveLink] = useState("home");

  // Handle Cookies
  const cookies = Cookie();

  const token = cookies.get("edu-caring");
  const decodedToken = jwtDecode(token);

  // Check the current path to determine the active link
  const handleSetActiveLink = (path) => {
    setActiveLink(path);
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-between p-2 sideBar shadow-sm">
        <Link to="home" className="" onClick={() => handleSetActiveLink("home")}>
          <img src={logo} alt="logo" className="mw-100 h-auto" />
        </Link>
        <hr className="opacity-0" />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className={`nav-item my-2 ${activeLink === "home" && "active"}`}>
            <Link
              to="/home"
              className="nav-link px-2"
              onClick={() => handleSetActiveLink("home")}
              style={{
                background: activeLink === "home" && "#3296D4",
                color: activeLink === "home" && "#fff",
              }}
            >
              <i className="bi bi-house-door me-2 fs-6"></i>
              <span className="fs-6 ">Home</span>
            </Link>
          </li>
          <li className={`nav-item my-2 ${activeLink === "myevents" && "active"}`}>
            <Link
              to="/home/myevents"
              className="nav-link px-2"
              onClick={() => handleSetActiveLink("myevents")}
              style={{
                background: activeLink === "myevents" && "#3296D4",
                color: activeLink === "myevents" && "#fff",
              }}
            >
              <i className="bi bi-ticket-perforated me-2 fs-6"></i>
              <span className="fs-6 ">My Events</span>
            </Link>
          </li>
          <li className={`nav-item my-2 ${activeLink === "community" && "active"}`}>
            <Link
              to="community"
              className="nav-link px-2"
              onClick={() => handleSetActiveLink("community")}
              style={{
                background: activeLink === "community" && "#3296D4",
                color: activeLink === "community" && "#fff",
              }}
            >
              <i className="bi bi-chat-square-text me-2 fs-6"></i>
              <span className="fs-6 ">Community</span>
            </Link>
          </li>
          <li className={`nav-item my-2 ${activeLink === "profile" && "active"}`}>
            <Link
              to={`${
                decodedToken.roles.includes("User") ? "update-user-profile" : "update-speaker-profile"
              }`}
              className="nav-link px-2"
              onClick={() => handleSetActiveLink("profile")}
              style={{
                background: activeLink === "profile" && "#3296D4",
                color: activeLink === "profile" && "#fff",
              }}
            >
              <i className="bi bi-person me-2 fs-6"></i>
              <span className="fs-6 ">Profile</span>
            </Link>
          </li>
        </ul>
        <Logout />
      </div>
    </>
  );
}

export default SideBar;
