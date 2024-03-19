import logo from "../../../assets/logo-removebg-preview.png";
import style from "./register.module.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import axios from "axios";
import { BASE } from "../../../Api";

export default function AttendanceReg() {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showError, setShowError] = useState(false);
  const nav = useNavigate();

  const cookies = new Cookie();
  // const [userId, setUserId] = useState(0);

  // User Data
  const [userData, setUserData] = useState({
    NameAr: "",
    NameEn: "",
    GenderId: 1,
    ProfileImage: "",
    ProfileImageFile: "",
    DateOfBirth: "",
    Password: "",
    ConfirmPassword: "",
    PhoneNumber: "",
    Specialization: "",
    SpecializationCategoryId: 1,
    Email: "",
    Country: "",
    City: "",
  });

  // [1] Handle Change
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // [2] Password Visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // [3] Confirm Password Visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  // [4] Handle Country Change
  const selectCountry = (val) => {
    setCountry(val);
  };

  // [5] Handle Region Change
  const selectRegion = (val) => {
    setRegion(val);
  };

  // [6] Handle Upload Change for Profile Image
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({
        ...userData,
        ProfileImageFile: file,
      });
    }
  };

  // [7] Handle Submit
  async function handleSubmit(e) {
    e.preventDefault();
    console.log(userData);

    const formData = new FormData();

    for (const key in userData) {
      formData.append(key, userData[key]);
    }

    try {
      let result = await axios
        .post(`${BASE}/Auth/UserRegister`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "text/plain",
          },
        })
        .then((res) => {
          console.log(res.data);

          res.data.isSuccess ? setErrorMessage("") : setErrorMessage(res.data.responseText);

          // Set Token && Roles && UserId
          cookies.set("edu-caring", res.data.responseObject.token);

          // Set Navigation
          nav("/verification");
        });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  // [8] Handle Delete Image
  const handleDeleteImage = (imageType) => {
    setUserData({
      ...userData,
      [imageType]: "",
    });
  };

  // [10] Get All Specialization Categories
  const [specializationCategories, setSpecializationCategories] = useState([]);
  useEffect(() => {
    axios
      .get(`${BASE}/MainData/GetAllSpecialization`)
      .then((res) => {
        setSpecializationCategories(res.data.responseObject);
      })
      .catch((err) => console.log(err));
  }, []);

  // [11] Get All Gender
  const [genders, setGenders] = useState([]);
  useEffect(() => {
    axios
      .get(`${BASE}/MainData/GetAllGender`)
      .then((res) => {
        setGenders(res.data.responseObject);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className={style.container}>
        {/* Header */}
        <div className={style.header}>
          {/* Before Uploading */}
          <div>
            <img src={logo} alt="logo" />
          </div>
          <div
            className={style.icon}
            style={{ display: userData.ProfileImageFile ? "none" : "block" }}
          >
            <input
              type="file"
              id="img"
              hidden
              onChange={(e) => handleProfileImageChange(e)}
              accept="image/*" // Allow only image files
            />
            <label htmlFor="img" className="icon-label">
              <i className="fa-solid fa-camera up-image"></i>
            </label>
          </div>
          {/* After Uploading */}
          {userData.ProfileImageFile && (
            <div
              className="upload-container icon"
              style={{
                width: "150px",
                height: "150px",
                backgroundImage: `url(${URL.createObjectURL(userData.ProfileImageFile)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position: "relative",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                className="btn btn-danger btn-sm w-100"
                style={{ position: "absolute", bottom: "0" }}
                onClick={() => handleDeleteImage("ProfileImageFile")}
              >
                <i className="fas fa-trash-alt fa-lg"></i>
              </button>
            </div>
          )}
        </div>

        <h4 className="m-2 mb-5">Create new account as an attendance</h4>

        <form onSubmit={handleSubmit}>
          <div className={style.form}>
            {/* input */}
            <div>
              <div className={style.input}>
                <i className="fa-regular fa-user"></i>
                <input
                  type="text"
                  className="text-end"
                  placeholder="الإسم (باللغة العربية)"
                  name="NameAr"
                  onChange={handleChange}
                />
              </div>
              {showError && userData.NameAr.length < 3 && (
                <span className="m-0 my-0 text-danger">Name Should be More 3 characters</span>
              )}
            </div>

            {/* input */}
            <div>
              <div className={style.input}>
                <i className="fa-regular fa-user"></i>
                <input
                  type="text"
                  placeholder="name (English)"
                  name="NameEn"
                  onChange={handleChange}
                />
              </div>
              {showError && userData.NameEn.length < 3 && (
                <span className="m-0 my-0 text-danger">Name Should be More 3 characters</span>
              )}
            </div>

            {/* input */}
            <div>
              <div className={style.input}>
                <i className="fa-regular fa-envelope"></i>
                <input type="email" placeholder="email" name="Email" onChange={handleChange} />
              </div>
              {showError && !userData.Email.includes("@") && (
                <span className="m-0 my-0 text-danger">Invalid Email</span>
              )}
              {errorMessage !== "" && <p className="m-0 my-0 text-danger">{errorMessage}</p>}
            </div>

            {/* input */}
            <div>
              <PhoneInput
                placeholder="Enter phone number"
                value={userData.PhoneNumber}
                onChange={(e) => setUserData({ ...userData, PhoneNumber: e })}
                defaultCountry="SA" // Set the default country code
                className={style.input}
                name="PhoneNumber"
              />
              {showError && userData.PhoneNumber.length < 10 && (
                <span className="m-0 my-0 text-danger">Invalid Phone Number</span>
              )}
            </div>

            {/* input */}
            <div>
              <div className={style.input}>
                <i className="fa-regular fa-calendar-days"></i>
                <input
                  type="date"
                  id="date"
                  className="text-muted"
                  name="DateOfBirth"
                  onChange={handleChange}
                />
              </div>
              {showError && userData.DateOfBirth.length < 8 && (
                <span className="m-0 my-0 text-danger">Invalid Date</span>
              )}
            </div>

            {/* input */}
            <div>
              <div className={style.input}>
                <select name="GenderId" className="p-0 px-2 text-muted" onChange={handleChange}>
                  {genders.map((gender, index) => (
                    <option
                      key={index}
                      value={gender.name === "Male" ? 1 : gender.name === "Female" ? 2 : 3}
                    >
                      {gender.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* input */}
            <div>
              <div className={style.input}>
                <i className="fas fa-quote-left"></i>
                <input
                  type="text"
                  placeholder="Spcialization"
                  name="Specialization"
                  onChange={handleChange}
                />
              </div>
              {showError && userData.Specialization.length < 3 && (
                <span className="m-0 my-0 text-danger">
                  Specialization Should be More 3 characters
                </span>
              )}
            </div>

            {/* input */}
            <div>
              <div className={style.input}>
                <select
                  name="SpecializationCategoryId"
                  className="p-0 px-2 text-muted"
                  onChange={handleChange}
                >
                  {specializationCategories.map((category, index) => (
                    <option value={category.id} key={index}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* input */}
            <div>
              <div className={style.input}>
                <i className="fas fa-regular fa-globe"></i>
                <CountryDropdown
                  value={country}
                  onChange={(val) => {
                    selectCountry(val);
                    setUserData({ ...userData, Country: val });
                  }}
                  className="text-muted"
                />
              </div>
              {showError && userData.Country.length < 3 && (
                <span className="m-0 my-0 text-danger">Please Select The Country</span>
              )}
            </div>

            {/* input */}
            <div>
              <div className={style.input}>
                <i className="fa-solid fa-tree-city fa-flip-horizontal"></i>
                <RegionDropdown
                  country={country}
                  value={region}
                  onChange={(val) => {
                    selectRegion(val);
                    setUserData({ ...userData, City: val });
                  }}
                  className="text-muted"
                />
              </div>
              {showError && userData.City.length < 3 && (
                <span className="m-0 my-0 text-danger">Please Select The City</span>
              )}
            </div>

            {/* input */}
            <div>
              <div className={style.input}>
                <i className="fa-solid fa-lock"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  onChange={handleChange}
                  name="Password"
                />
                <i
                  className={`fa-regular ${
                    showPassword ? "fa-eye" : "fa-eye-slash"
                  } fa-flip-horizontal`}
                  onClick={togglePasswordVisibility}
                ></i>
              </div>
              {showError && userData.Password.length < 8 && (
                <span className="m-0 my-0 text-danger">Passoword Should be More 8 characters</span>
              )}
            </div>

            {/* input */}
            <div>
              <div className={style.input}>
                <i className="fa-solid fa-lock"></i>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="confirm password"
                  onChange={handleChange}
                  name="ConfirmPassword"
                />
                <i
                  className={`fa-regular ${
                    showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                  } fa-flip-horizontal`}
                  onClick={toggleConfirmPasswordVisibility}
                ></i>
              </div>
              {showError && userData.Password !== userData.ConfirmPassword && (
                <span className="m-0 my-0 text-danger">Password not Match</span>
              )}
            </div>
          </div>

          {errorMessage !== "" && (
            <p className="alert alert-danger text-center py-2">{errorMessage}</p>
          )}

          <button
            type="submit"
            onClick={() => {
              if (
                userData.NameAr.length >= 2 &&
                userData.NameEn.length >= 2 &&
                userData.Email.includes("@") &&
                userData.PhoneNumber.length > 10 &&
                userData.DateOfBirth.length > 8 &&
                userData.Specialization.length > 3 &&
                userData.SpecializationCategoryId !== 1 &&
                userData.Country.length > 3 &&
                userData.City.length > 3 &&
                userData.Password.length >= 8 &&
                userData.Password === userData.ConfirmPassword
              ) {
                setShowError(false);
              } else {
                setShowError(true);
              }
            }}
          >
            Sign Up
          </button>
        </form>
        <p className="my-2" style={{ fontSize: "17px" }}>
          I Already have an Account? &nbsp;
          <Link to="/login" className="fw-bold" style={{ color: "#3296d4" }}>
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
