import logo from "../../../assets/logo-removebg-preview.png";
import style from "./register.module.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE } from "../../../Api";
import Verfication from "../verfiy-number/Verfication";
import { useTranslation } from "react-i18next";

export default function AttendanceReg() {
  const { i18n } = useTranslation();
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showError, setShowError] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const nav = useNavigate();

  // User Data
  const [userData, setUserData] = useState({
    NameAr: "",
    NameEn: "",
    GenderId: 1,
    ProfileImage: null,
    ProfileImageFile: null,
    HealthAuthorityNumber: "", // الرقم الصحي
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
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
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
      await axios
        .post(`${BASE}/Auth/UserRegister`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "text/plain",
          },
        })
        .then((res) => {
          console.log(res);

          if (res.data.isSuccess) {
            setErrorMessage("");
            // setShowVerify(true);
            nav("/login");
          } else {
            if (res.data.responseText === "Email is already registered!") {
              setErrorMessage(res.data.responseText);
            } else {
              setErrorMessage("Something went wrong, please try again...");
            }
          }
        });
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
      .get(`${BASE}/MainData/GetAllGender`, {
        headers: { language: i18n.language },
      })
      .then((res) => {
        setGenders(res.data.responseObject);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {!showVerify && (
        <div
          className={style.container}
          style={{
            direction: i18n.language === "en" ? "" : "rtl",
          }}
        >
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
                  backgroundImage: `url(${URL.createObjectURL(
                    userData.ProfileImageFile
                  )})`,
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

          <h4 className="m-2 mb-5">
            {i18n.language === "en"
              ? "Create new account as an attendance"
              : "إنشاء حساب جديد كمحاضر"}
          </h4>

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
                  <span className="m-0 my-0 text-danger">
                    {i18n.language === "en"
                      ? "Name Should be More 3 characters"
                      : "الإسم يجب أن يكون أكثر من 3 أحرف"}
                  </span>
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
                  <span className="m-0 my-0 text-danger">
                    {i18n.language === "en"
                      ? "Name Should be More 3 characters"
                      : "الإسم يجب أن يكون أكثر من 3 أحرف"}
                  </span>
                )}
              </div>

              {/* input */}
              <div>
                <div className={style.input}>
                  <i className="fa-regular fa-envelope"></i>
                  <input
                    type="email"
                    placeholder={
                      i18n.language === "en" ? "Email" : "البريد الإلكتروني"
                    }
                    name="Email"
                    onChange={handleChange}
                  />
                </div>
                {showError && !userData.Email.includes("@") && (
                  <span className="m-0 my-0 text-danger">
                    {i18n.language === "en"
                      ? "Invalid Email"
                      : "البريد الإلكتروني غير صحيح"}
                  </span>
                )}
                {errorMessage !== "" && (
                  <p className="m-0 my-0 text-danger">{errorMessage}</p>
                )}
              </div>

              {/* input */}
              <div>
                <PhoneInput
                  placeholder={
                    i18n.language === "en"
                      ? "Enter Phone Number"
                      : "أدخل رقم الهاتف"
                  }
                  value={userData.PhoneNumber}
                  onChange={(e) => setUserData({ ...userData, PhoneNumber: e })}
                  defaultCountry="SA" // Set the default country code
                  className={style.input}
                  name="PhoneNumber"
                />
                {showError &&
                  userData.PhoneNumber != null &&
                  userData.PhoneNumber.length < 10 && (
                    <span className="m-0 my-0 text-danger">
                      {i18n.language === "en"
                        ? "Invalid Phone Number"
                        : "رقم الهاتف غير صحيح"}
                    </span>
                  )}
              </div>

              {/* input */}
              <div>
                <div
                  className={`${style.input} d-flex align-items-center p-0 ${
                    userData.DateOfBirth
                      ? ""
                      : i18n.language === "en"
                      ? "datef"
                      : "datea"
                  }`}
                >
                  {/* <i className="fa-regular fa-calendar-days"></i> */}
                  <input
                    type="date"
                    id="date"
                    className="p-0 px-2 text-muted w-100 h-100 rounded-3"
                    name="DateOfBirth"
                    placeholder="Date of Birth"
                    onChange={handleChange}
                  />
                </div>
                {showError && userData.DateOfBirth.length < 8 && (
                  <span className="m-0 my-0 text-danger">
                    {i18n.language === "en" ? "Invalid Date" : "تاريخ غير صحيح"}
                  </span>
                )}
              </div>

              {/* input */}
              <div>
                <div className={`${style.input} d-flex align-items-center p-0`}>
                  <select
                    name="GenderId"
                    className="p-0 px-2 text-muted w-100 h-100 rounded-3"
                    onChange={handleChange}
                    defaultValue="0"
                  >
                    <option value="0" disabled>
                      {i18n.language === "en" ? "Select Gender" : "إختر النوع"}
                    </option>
                    {genders.map((gender, index) => (
                      <option
                        key={index}
                        value={
                          gender.name === "Male"
                            ? 1
                            : gender.name === "Female"
                            ? 2
                            : 3
                        }
                      >
                        {gender.name}
                      </option>
                    ))}
                  </select>
                </div>

                {showError && userData.GenderId === 1 && (
                  <span className="m-0 my-0 text-danger">
                    {i18n.language === "en"
                      ? "Please Select The gender"
                      : "من فضلك اختر النوع"}
                  </span>
                )}
              </div>

              {/* input */}
              <div className={`${style.input} d-flex align-items-center gap-2`}>
                <svg
                  className="m-0 p-0"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.96973 22H14.9697C19.9697 22 21.9697 20 21.9697 15V9C21.9697 4 19.9697 2 14.9697 2H8.96973C3.96973 2 1.96973 4 1.96973 9V15C1.96973 20 3.96973 22 8.96973 22Z"
                    stroke="#C8C8C8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.96973 12.7L7.96973 12.68C8.71973 12.68 9.55973 13.25 9.83973 13.95L10.9797 16.83C11.2397 17.48 11.6497 17.48 11.9097 16.83L14.1997 11.02C14.4197 10.46 14.8297 10.44 15.1097 10.97L16.1497 12.94C16.4597 13.53 17.2597 14.01 17.9197 14.01H21.9797"
                    stroke="#C8C8C8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  className="m-0 p-0"
                  type="text"
                  placeholder={
                    i18n.language === "en"
                      ? "Health Authority Number"
                      : "رقم الهيئة الصحية"
                  }
                  name="HealthAuthorityNumber"
                  onChange={handleChange}
                />
              </div>

              {/* input */}
              <div>
                <div className={`${style.input} d-flex align-items-center p-0`}>
                  <select
                    name="SpecializationCategoryId"
                    className="p-0 px-2 text-muted w-100 h-100 rounded-3"
                    onChange={handleChange}
                    defaultValue="1"
                  >
                    <option value="1" disabled>
                      {i18n.language === "en"
                        ? "Select Specialization Category"
                        : "إختر التخصص"}
                    </option>
                    {specializationCategories.map((category, index) => (
                      <option value={category.id} key={index}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {showError && userData.SpecializationCategoryId === 1 && (
                  <span className="m-0 my-0 text-danger">
                    {i18n.language === "en"
                      ? "Please Select The Specialization Category"
                      : "من فضلك اختر التخصص"}
                  </span>
                )}
              </div>

              {/* input */}
              <div>
                <div className={style.input}>
                  <i className="fas fa-quote-left"></i>
                  <input
                    type="text"
                    placeholder={
                      i18n.language === "en" ? "Specialization" : "التخصص"
                    }
                    name="Specialization"
                    onChange={handleChange}
                  />
                </div>
                {showError && userData.Specialization.length < 1 && (
                  <span className="m-0 my-0 text-danger">
                    {i18n.language === "en"
                      ? "Please Enter The Specialization"
                      : "من فضلك ادخل التخصص"}
                  </span>
                )}
              </div>

              {/* input */}
              <div>
                <div className={`${style.input} d-flex align-items-center p-0`}>
                  <CountryDropdown
                    value={country}
                    onChange={(val) => {
                      selectCountry(val);
                      setUserData({ ...userData, Country: val });
                    }}
                    className="p-0 px-2 text-muted w-100 h-100 rounded-3"
                  />
                </div>
                {showError && userData.Country.length < 3 && (
                  <span className="m-0 my-0 text-danger">
                    {i18n.language === "en"
                      ? "Please Select The Country"
                      : "من فضلك اختر الدولة"}
                  </span>
                )}
              </div>

              {/* input */}
              <div>
                <div className={`${style.input} d-flex align-items-center p-0`}>
                  <RegionDropdown
                    country={country}
                    value={region}
                    onChange={(val) => {
                      selectRegion(val);
                      setUserData({ ...userData, City: val });
                    }}
                    className="p-0 px-2 text-muted w-100 h-100 rounded-3"
                  />
                </div>
                {showError && userData.City.length < 3 && (
                  <span className="m-0 my-0 text-danger">
                    {i18n.language === "en"
                      ? " Please Select The City"
                      : "من فضلك اختر المدينة"}
                  </span>
                )}
              </div>

              {/* input */}
              <div>
                <div className={style.input}>
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      i18n.language === "en" ? "password" : "كلمة المرور"
                    }
                    onChange={handleChange}
                    name="Password"
                    style={{ paddingRight: "30px" }}
                  />
                  <i
                    className={`fa-regular ${
                      showPassword ? "fa-eye" : "fa-eye-slash"
                    } fa-flip-horizontal`}
                    onClick={togglePasswordVisibility}
                  ></i>
                </div>
                {showError && userData.Password.length < 8 && (
                  <span className="m-0 my-0 text-danger">
                    {i18n.language === "en"
                      ? "Passoword Should be More 8 characters"
                      : " كلمة المرور يجب ان تكون اكثر من 8 احرف"}
                  </span>
                )}
              </div>

              {/* input */}
              <div>
                <div className={style.input}>
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={
                      i18n.language === "en"
                        ? "Confirm Password"
                        : "تأكيد كلمة المرور"
                    }
                    onChange={handleChange}
                    name="ConfirmPassword"
                    style={{ paddingRight: "30px" }}
                  />
                  <i
                    className={`fa-regular ${
                      showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                    } fa-flip-horizontal`}
                    onClick={toggleConfirmPasswordVisibility}
                  ></i>
                </div>
                {showError &&
                  userData.Password !== userData.ConfirmPassword && (
                    <span className="m-0 my-0 text-danger">
                      {i18n.language === "en"
                        ? "Password not Match"
                        : "كلمتي المرور غير متطابقتين "}
                    </span>
                  )}
              </div>
            </div>

            {errorMessage !== "" && (
              <p className="alert alert-danger text-center py-2">
                {errorMessage}
              </p>
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
                  userData.SpecializationCategoryId !== 0 &&
                  userData.Country.length > 3 &&
                  userData.HealthAuthorityNumber.length > 3 &&
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
              {i18n.language === "en" ? "Sign Up" : "سجل"}
            </button>
          </form>
          <p className="my-2" style={{ fontSize: "17px" }}>
            {i18n.language === "en"
              ? "I Already have an Account?"
              : " لديك حساب بالفعل ؟"}
            &nbsp;
            <Link to="/login" className="fw-bold" style={{ color: "#3296d4" }}>
              {i18n.language === "en" ? "Sign In" : "تسجيل الدخول"}
            </Link>
          </p>
        </div>
      )}

      {showVerify && <Verfication email={userData.Email} />}
    </>
  );
}
