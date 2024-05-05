import { useState } from "react";
import cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
// Translation Work
import { useTranslation } from "react-i18next";

export default function Logout(isEnglish) {
  // Translation Work
  const { i18n } = useTranslation();

  const [popupVisible, setPopupVisible] = useState(false);

  const cookies = cookie();

  const handleTogglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  const handleHidePopup = () => {
    setPopupVisible(false);
  };

  const nav = useNavigate();
  return (
    <>
      <div
        className="text-danger px-2 fw-bold logout"
        style={{ cursor: "pointer" }}
        onClick={handleTogglePopup}
      >
        <i className="fa-solid fa-arrow-right-from-bracket me-2 fs-6 mx-2"></i>
        <span className="fs-6 ">
          {" "}
          {i18n.language === "en" ? "log out" : "تسجيل الخروج"}
        </span>
      </div>

      {
        <div
          className="logout-popup p-4 rounded position-fixed text-center top-50 bg-white"
          style={{
            boxShadow: "0 0 100px rgba(0,0,0,0.2)",
            width: "360px",
            transform: popupVisible
              ? "translate(-50%, -50%)"
              : "translate(900%, -50%)",
            transition: "0.5s",
            left: "50%",
            zIndex: "1000",
          }}
        >
          <i
            className="fa-solid fa-xmark position-absolute text-dark fs-4"
            style={{ top: "10px", right: "10px", cursor: "pointer" }}
            onClick={handleHidePopup}
          ></i>
          <div className="logout-icon">
            <svg
              width="45"
              height="45"
              viewBox="0 0 45 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32.7 27.4125L37.5 22.6125L32.7 17.8125"
                stroke="#C32B43"
                strokeWidth="2.8125"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.3 22.6125H37.3688"
                stroke="#C32B43"
                strokeWidth="2.8125"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22.05 37.5C13.7625 37.5 7.05005 31.875 7.05005 22.5C7.05005 13.125 13.7625 7.5 22.05 7.5"
                stroke="#C32B43"
                strokeWidth="2.8125"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="my-3 fw-bold" style={{ color: "#565656" }}>
            {" "}
            {i18n.language === "en"
              ? " Already Leaving ?"
              : "هل تريد الخروج بالفعل؟"}
          </h2>
          <div className="btns d-flex gap-4 justify-content-center my-2">
            <button
              className="btn  btn-danger "
              onClick={() => {
                cookies.remove("edu-caring");
                cookies.remove("userId");
                nav("/");
                window.location.reload();
              }}
            >
              {" "}
              {i18n.language === "en" ? "Yes, Log out" : "نعم، سجل الخروج"}
            </button>
            <button
              className="btn  btn-light"
              style={{
                width: "",
              }}
              onClick={handleHidePopup}
            >
              {" "}
              {i18n.language === "en" ? "No, I am stying ?" : "لا ، سأبقى"}
            </button>
          </div>
        </div>
      }
    </>
  );
}
