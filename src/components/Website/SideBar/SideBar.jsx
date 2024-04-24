import logo from "../../../assets/logo-removebg-preview.png";
import { Link, NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import Logout from "../Popups/Logout";

import { useLocation } from "react-router-dom";

function SideBar(isEnglish) {
  // State to track the active link
  const [activeLink, setActiveLink] = useState("home");
  const location = useLocation();

  useEffect(() => {
    // Get the path from the location object
    const path = location.pathname.split("/")[2] || "home"; // Get the first part of the pathname
    setActiveLink(path);
  }, [location]);

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
      <div
        className={`d-flex flex-column justify-content-between p-2 sideBar shadow-sm ${
          isEnglish.isEnglish === "en" ? "" : "side-rtl"
        }`}
        // style={{ direction: isEnglish.isEnglish === "en" ? "" : "rtl" }}
      >
        <Link to="/" className="" onClick={() => handleSetActiveLink("home")}>
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
              <i className="bi bi-house-door me-2 fs-6 mx-2"></i>
              <span className="fs-6 ">
                {" "}
                {isEnglish.isEnglish === "en" ? "Home" : "الرئيسية"}
              </span>
            </Link>
          </li>
          <li
            className={`nav-item my-2 ${activeLink === "myevents" && "active"}`}
          >
            <Link
              to="/home/myevents"
              className="nav-link px-2"
              onClick={() => handleSetActiveLink("myevents")}
              style={{
                background: activeLink === "myevents" && "#3296D4",
                color: activeLink === "myevents" && "#fff",
              }}
            >
              <i className="bi bi-ticket-perforated me-2 fs-6 mx-2"></i>
              <span className="fs-6 ">
                {" "}
                {isEnglish.isEnglish === "en"
                  ? "My Events"
                  : "الفعاليات الخاصة بي"}
              </span>
            </Link>
          </li>
          <li
            className={`nav-item my-2 ${
              activeLink === "community" && "active"
            }`}
          >
            <Link
              to="community"
              className="nav-link px-2"
              onClick={() => handleSetActiveLink("community")}
              style={{
                background: activeLink === "community" && "#3296D4",
                color: activeLink === "community" && "#fff",
              }}
            >
              <i className="bi bi-chat-square-text me-2 fs-6 mx-2"></i>
              <span className="fs-6 ">
                {" "}
                {isEnglish.isEnglish === "en" ? "Community" : "المجتمع"}
              </span>
            </Link>
          </li>
          <li
            className={`nav-item my-2 ${activeLink === "profile" && "active"}`}
          >
            <NavLink
              to={`${
                decodedToken.roles.includes("User")
                  ? "update-user-profile"
                  : "update-speaker-profile"
              }`}
              className="nav-link px-2"
              onClick={() =>
                handleSetActiveLink(
                  decodedToken.roles.includes("User")
                    ? "update-user-profile"
                    : "update-speaker-profile"
                )
              }
              style={{
                background: activeLink === "profile" && "#3296D4",
                color: activeLink === "profile" && "#fff",
              }}
            >
              <i className="bi bi-person me-2 fs-6 mx-2"></i>
              <span className="fs-6 ">
                {" "}
                {isEnglish.isEnglish === "en" ? "Profile" : "الملف الشخصي"}
              </span>
            </NavLink>
          </li>
        </ul>
        <Logout isEnglish={isEnglish} />
      </div>
    </>
  );
}

export default SideBar;
