import logo from "./../../../assets/logo-removebg-preview.png";
import loginImage from "./../../../assets/login-image.jpg";
import style from "./Login.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import axios from "axios";
import { BASE } from "../../../Api";
import Role from "../Popups/Role";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const cookies = Cookie();

  const [errorMessage, setErrorMessage] = useState("");

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

      // Set Navigation
      cookies.get("edu-caring") !== "" && res.data.responseObject.isVerified
        ? nav("/home")
        : nav("/verification");
    } catch (error) {
      console.log(error);
    }
  }

  let [role, setRole] = useState(false);

  function handleRoleFromChild(role) {
    setRole(role);
  }

  return (
    <>
      <div className={style.container}>
        <form className={style.form} onSubmit={handleFormSubmit}>
          <img src={logo} alt="logo" />
          <h2>Sign in</h2>

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
          <div className={style.input}>
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
          {errorMessage !== "" && (
            <p className="text-danger py-2">{errorMessage}</p>
          )}

          <button>Sign In</button>
          <p className="m-0 p-0 my-3 fs-6">
            I have an Account? &nbsp;
            <Link onClick={() => setRole(!role)} className="fw-bold">
              Sign Up
            </Link>
          </p>
        </form>
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
    </>
  );
}
//
