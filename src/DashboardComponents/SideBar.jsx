import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.css";

function SideBar() {
  //
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const { t } = useTranslation();
  //
  return (
    <div className="side-bar ">
      <p
        className="link"
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
      >
        <i className="fas fa-th-large"></i>
        <span>{t("AllUsers")}</span>
      </p>

      <Collapse in={open} className="collapse border-bottom py-0 pb-1 mb-3">
        <div id="example-collapse-text">
          <NavLink to="/dashboard/admins" className="link my-1">
            <i className="fas fa-user-cog"></i>
            <span>{t("Admins")}</span>
          </NavLink>
          <NavLink to="/dashboard/users" className="link my-1">
            <i className="fas fa-user-friends"></i>
            <span>{t("Users")}</span>
          </NavLink>
          <NavLink to="/dashboard/speakers" className="link my-1">
            <i className="fas fa-chalkboard-teacher"></i>
            <span>{t("Speakers")}</span>
          </NavLink>
        </div>
      </Collapse>
      <p
        className="link"
        onClick={() => setOpen2(!open2)}
        aria-controls="example-collapse-text"
        aria-expanded={open2}
      >
        <i className="fas fa-th-large"></i>
        <span>{t("LandingPage")}</span>
      </p>
      <Collapse in={open2} className="collapse border-bottom py-0 pb-1 mb-3">
        <div id="example-collapse-text">
          <NavLink to="/dashboard/landing-speakers" className="link my-1">
            <i className="fas fa-user-friends"></i>
            <span>{t("LandingSpeakers")}</span>
          </NavLink>
          <NavLink to="/dashboard/landing-sponsers" className="link my-1">
            <i className="far fa-building"></i>

            <span>{t("LandingSponsers")}</span>
          </NavLink>
          <NavLink to="/dashboard/landing-text" className="link my-1">
            <i className="fas fa-quote-right"></i>

            <span>{t("LandingText")}</span>
          </NavLink>
          <NavLink to="/dashboard/landing-aboutus" className="link my-1">
            <i className="fas fa-quote-right"></i>

            <span>{t("LandingAboutUs")}</span>
          </NavLink>
        </div>
      </Collapse>
      <NavLink to="/dashboard/events" className="link">
        <i className="fas fa-boxes"></i>
        <span>{t("Events")}</span>
      </NavLink>
      <NavLink to="/dashboard/messages" className="link">
        <i className="fas fa-envelope"></i>
        <span>{t("SendMessage")}</span>
      </NavLink>
      <NavLink to="/dashboard/support" className="link">
        <i className="fas fa-headset"></i>
        <span>{t("Support")}</span>
      </NavLink>
      <NavLink to="/dashboard/contactus" className="link">
        <i className="fas fa-flag"></i>
        <span>{t("ContactUs")}</span>
      </NavLink>
      <NavLink to="/dashboard/copouns" className="link">
        <i className="fas fa-percent"></i>
        <span>{t("PromoCodes")}</span>
      </NavLink>
      <NavLink to="/dashboard/affiliate" className="link">
      <i className="fa-solid fa-bolt-lightning"></i>
        <span>{t("AffiliateCodes")}</span>
      </NavLink>
    </div>
  );
}

export default SideBar;
