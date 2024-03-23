import style from "./Verfication.module.css";
import logo from "../../../assets/logo.jpg";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { BASE } from "../../../Api";
import { useNavigate } from "react-router-dom";

export default function Verfication() {
  // State
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);

  const nav = useNavigate();
  const cookie = new Cookie();
  const token = cookie.get("edu-caring");
  const decoded = jwtDecode(token);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft > 0) {
      const countdown = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      // Reset timer and send OTP
      setSecondsLeft(60);
      sendOTP();
    }
  }, [secondsLeft]);

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

  // Function to send OTP
  function sendOTP() {
    axios
      .get(`${BASE}/OTP/SendOTP`, {
        params: {
          email: decoded.email,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }

  // Function to handle Continue button click
  const handleContinue = async () => {
    try {
      const response = await axios.post(`${BASE}/OTP/VerifyOTPConfirmEmail`, {
        email: decoded.email,
        otp: otp,
      });
      if (response.data.isSuccess) {
        nav("/home");
      } else {
        if (response.data.message) {
          setErrorMessage(response.data.message);
        } else {
          setErrorMessage("Wrong code, try again...");
        }
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <img src={logo} alt="logo" />
      </div>
      <div className={style.body}>
        <h4 className="mt-5">Verification</h4>
        <div className="mb-5">
          We’ve sent you the verification code on <span className="text-info">{decoded.email}</span>
        </div>
        <div className={style.form}>
          <input type="text" maxLength="1" inputMode="numeric" onChange={handleOnChange} />
          <input type="text" maxLength="1" inputMode="numeric" onChange={handleOnChange} />
          <input type="text" maxLength="1" inputMode="numeric" onChange={handleOnChange} />
          <input type="text" maxLength="1" inputMode="numeric" onChange={handleOnChange} />
          <input type="text" maxLength="1" inputMode="numeric" onChange={handleOnChange} />
          <input type="text" maxLength="1" inputMode="numeric" onChange={handleOnChange} />
        </div>

        {<p className="text-danger py-2">{errorMessage}</p>}

        <div className={style.resend}>
          <div>
            <p className="d-inline" onClick={sendOTP} style={{ cursor: "pointer" }}>
              Re-send code in
            </p>{" "}
            <p className="text-info d-inline">
              00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
            </p>
          </div>
        </div>
        <button className="my-5" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
