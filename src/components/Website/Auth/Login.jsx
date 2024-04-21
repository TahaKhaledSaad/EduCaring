import logo from "./../../../assets/logo-removebg-preview.png";
import loginImage from "./../../../assets/login-image.jpg";
import style from "./Login.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import axios from "axios";
import { BASE } from "../../../Api";
import Role from "../Popups/Role";
import verifyStyle from "./../verfiy-number/Verfication.module.css";
import Verfication from "../verfiy-number/Verfication";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const cookies = Cookie();
  const [show1, setShow1] = useState(true);
  const [show2, setShow2] = useState(false);
  const [msgSend, setMsgSend] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState("");

  const [passesEquals, setPassesEquals] = useState(false);
  const [showForgetErrors, setShowForgetErrors] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  useEffect(() => {
    newPassword === confirmNewPass
      ? setPassesEquals(true)
      : setPassesEquals(false);
  }, [newPassword, confirmNewPass]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE}/Auth/Login`, {
        email: email,
        password: password,
      });

      res.data.isSuccess
        ? setErrorMessage("")
        : setErrorMessage(res.data.responseText);
      console.log(errorMessage);

      // Set Token
      res.data.responseObject.isVerified &&
        cookies.set("edu-caring", res.data.responseObject.token);

      const decodedToken = jwtDecode(res.data.responseObject.token);

      // Set Navigation
      cookies.get("edu-caring") !== "" && res.data.responseObject.isVerified
        ? decodedToken.roles.includes("SuperAdmin")
          ? nav("/dashboard")
          : nav("/home")
        : setShowVerify(true);
    } catch (error) {
      console.log(error);
    }
  }

  let [role, setRole] = useState(false);

  function handleRoleFromChild(role) {
    setRole(role);
  }

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  async function forgetPassword() {
    try {
      const res = await axios.post(`${BASE}/Auth/ForgetPassword`, {
        email: email,
      });
      if (res.data.isSuccess) {
        setShowSuccessPopup(true); // Show success popup
        setMsgSend("Please check your email for Code!");
        setTimeout(() => {
          setShowSuccessPopup(false); // Hide success popup after 2 seconds
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function resetPass() {
    try {
      const res = await axios.post(`${BASE}/Auth/ResetPassword`, {
        email: email,
        password: newPassword,
        confirmPassword: confirmNewPass,
        otp: otp,
      });
      console.log(res);
      if (res.data.isSuccess) {
        setShowSuccessPopup(true); // Show success popup
        setMsgSend("Password has been reset successfully!");
        setTimeout(() => {
          setShowSuccessPopup(false); // Hide success popup after 2 seconds
        }, 3000);
        setShow1(true);
        setShow2(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Handler function for OTP input
  const handleOnChange = (e) => {
    const maxLength = 1;
    const value = e.target.value;

    if (value.length === maxLength) {
      const nextInput = e.target.nextElementSibling;
      if (nextInput) {
        nextInput.focus();
      }
      setOtp((prevOtp) => prevOtp + value);
    } else if (value.length === 0) {
      const previousInput = e.target.previousElementSibling;
      if (previousInput) {
        previousInput.focus();
      }
      setOtp((prevOtp) => prevOtp.slice(0, -1));
    }
  };

  return (
    <>
      {!showVerify && (
        <div className={style.container}>
          <form className={style.form} onSubmit={handleFormSubmit}>
            <img src={logo} alt="logo" />

            {/* Main Info */}
            {show1 && (
              <section>
                <h2 className="fw-bold">Sign in</h2>

                {/* Input */}
                <div>
                  <i className="fa-regular fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className={style.input} style={{ marginBottom: "0px" }}>
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <i
                    className={`fa-regular ${
                      showPassword ? "fa-eye" : "fa-eye-slash"
                    } fa-flip-horizontal`}
                    onClick={togglePasswordVisibility}
                  ></i>
                </div>

                <div
                  className="text-muted forgetPassword"
                  style={{
                    textDecoration: "underline",
                    textAlign: "right",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "bold",
                    height: "30px",
                  }}
                  onClick={() => {
                    if (email !== "") {
                      setShow1(false);
                      setShow2(true);
                      forgetPassword();
                    } else {
                      setErrorMessage("Please enter your email first!");
                    }
                  }}
                >
                  forget password!
                </div>

                {errorMessage !== "" && (
                  <p className="text-danger p-0">{errorMessage}</p>
                )}

                <button className="my-4">Sign In</button>
                <p className="m-0 p-0 my-3 fs-6">
                  Don’t have an account? &nbsp;
                  <Link onClick={() => setRole(!role)} className="fw-bold">
                    Sign Up
                  </Link>
                </p>
              </section>
            )}

            {/* Forget Password */}
            {show2 && (
              <>
                {/* Verification */}
                <div>
                  <h2 className="fw-bold m-0 ">Verfication</h2>
                  <div
                    className={verifyStyle.container}
                    style={{
                      height: "auto",
                      padding: "0px",
                      marginBottom: "0px",
                    }}
                  >
                    <div className={verifyStyle.body}>
                      <div className={verifyStyle.form}>
                        <input
                          type="text"
                          maxLength="1"
                          inputMode="numeric"
                          onChange={handleOnChange}
                        />
                        <input
                          type="text"
                          maxLength="1"
                          inputMode="numeric"
                          onChange={handleOnChange}
                        />
                        <input
                          type="text"
                          maxLength="1"
                          inputMode="numeric"
                          onChange={handleOnChange}
                        />
                        <input
                          type="text"
                          maxLength="1"
                          inputMode="numeric"
                          onChange={handleOnChange}
                        />
                        <input
                          type="text"
                          maxLength="1"
                          inputMode="numeric"
                          onChange={handleOnChange}
                        />
                        <input
                          type="text"
                          maxLength="1"
                          inputMode="numeric"
                          onChange={handleOnChange}
                        />
                      </div>
                    </div>
                  </div>
                  {showSuccessPopup && (
                    <div
                      className="alert alert-success"
                      style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 9999,
                      }}
                    >
                      {msgSend}
                    </div>
                  )}
                </div>

                {showForgetErrors && (
                  <p className="text-danger m-0 p-0">
                    {otp.length == 6 ? "" : "Please enter the 6-digit code!"}
                  </p>
                )}
                <p
                  className="m-0 text-muted"
                  style={{ cursor: "pointer" }}
                  onClick={forgetPassword}
                >
                  Resend Code...
                </p>
                {/* Reset */}
                <section>
                  <div style={{ border: "none" }}>
                    <h2 className="fw-bold mb-4" style={{ margin: "0" }}>
                      Reset Password
                    </h2>
                    {/* Password */}
                    <div
                      className={style.input}
                      style={{ marginBottom: "0px" }}
                    >
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
                        {newPassword.length < 8
                          ? "Password must be at least 8 characters!"
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
                      <p className="text-danger m-0 p-0">
                        {passesEquals ? "" : "Passwords do not match!"}
                      </p>
                    )}

                    <button
                      className="mb-2 mt-3"
                      onClick={() => {
                        if (
                          newPassword.length >= 8 &&
                          passesEquals &&
                          otp.length == 6
                        ) {
                          resetPass();
                        } else {
                          setShowForgetErrors(true);
                        }
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </section>
              </>
            )}
          </form>

          {/* Image */}
          <div className={style.image}>
            <img
              src={loginImage}
              alt="loginImage"
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Role */}
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "fixed",
              top: 0,
              left: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: role ? "flex" : "none",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            {role && <Role roleCase={handleRoleFromChild}></Role>}
          </div>
        </div>
      )}

      {showVerify && <Verfication email={email} />}
    </>
  );
}
//
