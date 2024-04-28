import { useEffect, useState } from "react";
import style from "./../Auth/Login.module.css";
import { BASE } from "../../../Api";
import axios from "axios";
import PropTypes from "prop-types";
// Translation Work
import { useTranslation } from "react-i18next";

export default function ResetPassword({ userID, email }) {
  const [popupVisible, setPopupVisible] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passesEquals, setPassesEquals] = useState(false);
  const [showErrors, setshowErrors] = useState(false);

  const { i18n } = useTranslation();

  const handleTogglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  const handleHidePopup = () => {
    setPopupVisible(false);
  };

  const [wrongCurrentPassword, setWrongCurrentPassword] = useState(false);
  const [updatedSuccessfully, setUpdatedSuccessfully] = useState(false);

  useEffect(() => {
    newPassword === confirmNewPass
      ? setPassesEquals(true)
      : setPassesEquals(false);
  }, [newPassword, confirmNewPass]);

  async function handleResetPassword() {
    try {
      const res = await axios.post(`${BASE}/auth/ChangePassword`, {
        userID: userID,
        email: email,
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      if (res.data.isSuccess) {
        setUpdatedSuccessfully(true);
        setTimeout(() => {
          setUpdatedSuccessfully(false);
          handleHidePopup();
        }, 3000);
      } else {
        setWrongCurrentPassword(true);
        setTimeout(() => {
          setWrongCurrentPassword(false);
        }, 3000);
      }
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
    console.log(currentPassword, newPassword);
  }

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
        <span style={{ fontSize: "13px" }}>
          {i18n.language === "en" ? "Change Password" : "تغيير كلمة المرور"}
        </span>
      </button>

      <div
        className="logout-popup p-4 rounded position-fixed text-center top-50 bg-white pb-2"
        style={{
          boxShadow: "0 0 100px rgba(0,0,0,0.2)",
          width: "360px",
          transform: popupVisible
            ? "translate(-50%, -50%)"
            : "translate(300%, -50%)",
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
              {i18n.language === "en"
                ? "Reset Password"
                : " إعادة تعيين كلمة المرور"}
            </h2>
            {/*Current Password */}
            <div className={style.input} style={{ marginBottom: "0px" }}>
              <i className="fa-solid fa-lock"></i>
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder={
                  i18n.language === "en"
                    ? "Current Password"
                    : "كلمة المرور الحالية"
                }
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <i
                className={`fa-regular ${
                  showCurrentPassword ? "fa-eye" : "fa-eye-slash"
                } fa-flip-horizontal`}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              ></i>
            </div>
            {showErrors && (
              <p className="text-danger m-0 p-0">
                {currentPassword.length < 6
                  ? i18n.language === "en"
                    ? "Wrong Password!"
                    : "كلمة المرور خاطئة!"
                  : ""}
              </p>
            )}

            {/*new Password */}
            <div
              className={style.input}
              style={{ marginBottom: "0px", marginTop: "15px" }}
            >
              <i className="fa-solid fa-lock"></i>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder={
                  i18n.language === "en"
                    ? "Enter New Password"
                    : "أدخل كلمة مرور جديدة"
                }
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <i
                className={`fa-regular ${
                  showNewPassword ? "fa-eye" : "fa-eye-slash"
                } fa-flip-horizontal`}
                onClick={() => setShowNewPassword(!showNewPassword)}
              ></i>
            </div>
            {showErrors && (
              <p className="text-danger m-0 p-0">
                {newPassword.length < 8
                  ? i18n.language === "en"
                    ? "Password must be at least 8 characters!"
                    : "يجب أن تكون كلمة المرور على الأقل 8 أحرف!"
                  : ""}
              </p>
            )}

            {/*Confirm Password */}
            <div
              className={style.input}
              style={{ marginBottom: "0px", marginTop: "15px" }}
            >
              <i className="fa-solid fa-lock"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={
                  i18n.language === "en"
                    ? "Confirm Password"
                    : "تأكيد كلمة المرور"
                }
                onChange={(e) => setConfirmNewPass(e.target.value)}
              />
              <i
                className={`fa-regular ${
                  showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                } fa-flip-horizontal`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>
            {showErrors && (
              <p className="text-danger m-0 p-0">
                {passesEquals
                  ? ""
                  : i18n.language === "en"
                  ? "Passwords do not match!"
                  : "كلمات المرور غير متطابقة!"}
              </p>
            )}
          </section>
        </div>

        <div className="d-flex justify-content-between mt-4 gap-3">
          <button
            className="btn flex-fill"
            style={{
              background: "#3296D4",
              color: "#fff",
              outline: "none",
              border: "none",
            }}
            onClick={() => {
              if (
                currentPassword.length >= 6 &&
                newPassword.length >= 8 &&
                passesEquals
              ) {
                handleResetPassword();
                console.log("Done");
              } else {
                setshowErrors(true);
              }
            }}
          >
            {i18n.language === "en" ? "Change" : "تغيير"}
          </button>
          <button
            className="btn flex-fill"
            style={{ background: "#F3F5F5", outline: "none", border: "none" }}
            onClick={handleHidePopup}
          >
            {i18n.language === "en" ? "Cancel" : "إلغاء"}
          </button>

          {wrongCurrentPassword && (
            <div
              className="alert alert-danger text-center px-3 py-2"
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
                width: "300px",
                boxShadow: "0 0 100px rgb(0,0,0)",
              }}
            >
              {i18n.language === "en"
                ? "Wrong Password!"
                : "كلمة المرور خاطئة!"}
            </div>
          )}
          {updatedSuccessfully && (
            <div
              className="alert alert-success text-center px-3 py-2"
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
                width: "300px",
                boxShadow: "0 0 100px rgb(0,0,0)",
              }}
            >
              {i18n.language === "en"
                ? "Password updated successfully!"
                : "تم تحديث كلمة المرور بنجاح!"}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
ResetPassword.propTypes = {
  userID: PropTypes.string.isRequired,
};
ResetPassword.propTypes = {
  email: PropTypes.string.isRequired,
};
