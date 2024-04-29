import React from "react";
// Translation Work
import { useTranslation } from "react-i18next";

export default function Revision({ isBlocked, setIsBlocked }) {
  const { i18n } = useTranslation();
  return (
    <div>
      {isBlocked && (
        <div
          className="text-center m-auto bg-light position-absolute top-50 start-50"
          style={{
            width: "300px",
            height: "200px",
            zIndex: "1000",
            borderRadius: "10px",
            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="popup-content text-center d-flex flex-column justify-content-center align-items-center h-100">
            <span
              className="close-btn fs-3 text-danger position-absolute top-0 end-0 p-2"
              style={{ cursor: "pointer" }}
              onClick={() => setIsBlocked(false)}
            >
              &times;
            </span>
            <i
              className="fas fa-exclamation-circle fs-1 text-danger"
              style={{
                fontSize: "50px",
              }}
            ></i>

            <p className="text-danger fs-2 m-0">
              {i18n.language === "en" ? "You are blocked!" : "تم حظرك!"}
            </p>
            <span
              style={{
                fontSize: "12px",
              }}
            >
              {" "}
              {i18n.language === "en"
                ? "Your email will be verify by admin to login"
                : "سيتم التحقق من بريدك الإلكتروني من قبل المشرف لتسجيل الدخول"}{" "}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
