import { useEffect, useState } from "react";
import style from "./../Auth/Login.module.css";

export default function ResetPassword() {
  const [popupVisible, setPopupVisible] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [passesEquals, setPassesEquals] = useState(false);
  const [showForgetErrors, setShowForgetErrors] = useState(false);

  const handleTogglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  const handleHidePopup = () => {
    setPopupVisible(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  console.log(newPassword, confirmNewPass);

  useEffect(() => {
    newPassword === confirmNewPass ? setPassesEquals(true) : setPassesEquals(false);
    console.log(currentPassword);
    setShowForgetErrors(true);
  }, [newPassword, confirmNewPass, currentPassword]);

  return (
    <>
      <button
        className="btn btn-secondary d-flex gap-1 align-items-center px-3"
        onClick={handleTogglePopup}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span style={{ fontSize: "13px" }}>Reset Password</span>
      </button>

      <div
        className="logout-popup p-4 rounded position-fixed text-center top-50 bg-white pb-2"
        style={{
          boxShadow: "0 0 100px rgba(0,0,0,0.2)",
          width: "360px",
          transform: popupVisible ? "translate(-50%, -50%)" : "translate(300%, -50%)",
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

        <div className={style.form}>
          <section>
            <h2 className="fw-bold mb-4" style={{ margin: "0" }}>
              Reset Password
            </h2>
            {/*Current Password */}
            <div className={style.input} style={{ marginBottom: "0px" }}>
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Current Password"
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <i
                className={`fa-regular ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                } fa-flip-horizontal`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
            {showForgetErrors && (
              <p className="text-danger m-0 p-0">
                {newPassword.length < 8 ? "Password must be at least 8 characters!" : ""}
              </p>
            )}

            {/*new Password */}
            <div className={style.input} style={{ marginBottom: "0px", marginTop: "15px" }}>
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter New Password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <i
                className={`fa-regular ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                } fa-flip-horizontal`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
            {showForgetErrors && (
              <p className="text-danger m-0 p-0">
                {newPassword.length < 8 ? "Password must be at least 8 characters!" : ""}
              </p>
            )}

            {/*Confirm Password */}
            <div className={style.input} style={{ marginBottom: "0px", marginTop: "15px" }}>
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmNewPass(e.target.value)}
              />
              <i
                className={`fa-regular ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                } fa-flip-horizontal`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
            {showForgetErrors && (
              <p className="text-danger m-0 p-0">{passesEquals ? "" : "Passwords do not match!"}</p>
            )}
          </section>
        </div>

        <div className="d-flex justify-content-between mt-4 gap-3">
          <button
            className="btn flex-fill"
            style={{ background: "#3296D4", color: "#fff", outline: "none", border: "none" }}
          >
            Reset
          </button>
          <button
            className="btn flex-fill"
            style={{ background: "#F3F5F5", outline: "none", border: "none" }}
            onClick={handleHidePopup}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
