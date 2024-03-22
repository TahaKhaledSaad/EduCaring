import logo from "../../../assets/logo-removebg-preview.png";
import upload from "../../../assets/image.png";
import pdf from "../../../assets/pdf.png";
import style from "./register.module.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import axios from "axios";
import { BASE } from "../../../Api";
import DeleteModel from "./../Popups/DeleteModel";

export default function SpeakerReg() {
  // [0] States
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [show, setShow] = useState(true);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  const [showError, setShowError] = useState(false);
  const [showError2, setShowError2] = useState(false);

  const cookies = new Cookie();
  const nav = useNavigate();

  // const [users, setUsers] = useState([{}]);

  const [userData, setUserData] = useState({
    NameAr: "",
    NameEn: "",
    GenderId: 0,
    ProfileImage: "",
    ProfileImageFile: "",
    DateOfBirth: "",
    PhoneNumber: "",
    Email: "",
    PassportNumber: "",
    HealthAuthorityNumber: "", // الرقم الصحي
    SaudiAuthorityNumber: "", // الرقم السعودي
    PassportImageFile: "",
    CvFile: "",
    WalaaCarFile: "",
    Bio: "",
    CurrentWorkPlace: "",
    BankAccount: "",
    ExpYears: "",
    Password: "",
    ConfirmPassword: "",
    Country: "",
    City: "",
  });

  // [1] Handle Change
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // [2] Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // [3] Toggle Confirm Password Visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  // [4] Select Country
  const selectCountry = (val) => {
    setCountry(val);
  };

  // [5] Select Region
  const selectRegion = (val) => {
    setRegion(val);
  };

  // [6] Handle Upload Change
  const handleUploadChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({
        ...userData,
        [fileType]: file, // Set the file directly
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
        .post(`${BASE}/Auth/SpeakerRegister`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "text/plain",
          },
        })
        .then((res) => {
          console.log(res.data);

          cookies.set("edu-caring", res.data.responseObject?.token);

          if (res.data.isSuccess) {
            nav("/login");
          } else {
            if (res.data.responseText == "Email is already registered!") {
              setErrorMessage("Email is already registered!");
            } else {
              setErrorMessage("Something went wrong...");
            }
          }
        });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  // [8] Handle Delete Image

  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const handleDeleteImage = (imageType) => {
    // Set the image to be deleted
    setImageToDelete(imageType);
    setShowDeleteModel(true); // Show the delete model
  };

  const handleDeleteConfirmed = () => {
    // Clear the imageToDelete state
    setUserData({
      ...userData,
      [imageToDelete]: "",
    });
    setShowDeleteModel(false); // Hide the delete model
  };

  const handleClose = () => {
    // Close the delete model without deleting the image
    setImageToDelete(null); // Clear the imageToDelete state
    setShowDeleteModel(false);
  };

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
              onChange={(e) => handleUploadChange(e, "ProfileImageFile")}
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

        <h4 className="m-2 mb-5">Create new account as an speaker</h4>

        <form onSubmit={handleSubmit}>
          {/* Main Info : 1 */}
          <div style={{ display: show ? "block" : "none" }}>
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
                    Name Should be More 3 characters
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
                    Name Should be More 3 characters
                  </span>
                )}
              </div>

              {/* input */}
              <div>
                <div className={style.input}>
                  <i className="fa-regular fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="email"
                    name="Email"
                    onChange={handleChange}
                  />
                </div>
                {showError && !userData.Email.includes("@") && (
                  <span className="m-0 my-0 text-danger">Invalid Email</span>
                )}
                {errorMessage !== "" && (
                  <p className="m-0 my-0 text-danger">{errorMessage}</p>
                )}
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
                  <span className="m-0 my-0 text-danger">
                    Invalid Phone Number
                  </span>
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
                  <select
                    name="GenderId"
                    className="p-0 px-2 text-muted"
                    onChange={handleChange}
                  >
                    <option disabled>Gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                  </select>
                </div>
              </div>

              {/* input */}
              <div className={style.input}>
                <i className="fa-solid fa-id-card"></i>
                <input
                  type="text"
                  placeholder="Enter passport number"
                  name="PassportNumber"
                  onChange={handleChange}
                />
              </div>

              {/* input */}
              <div className={style.input}>
                <i className="fa-solid fa-heart-pulse"></i>
                <input
                  type="text"
                  placeholder="health authority number"
                  name="HealthAuthorityNumber"
                  onChange={handleChange}
                />
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
                  <span className="m-0 my-0 text-danger">
                    Please Select The Country
                  </span>
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
                  <span className="m-0 my-0 text-danger">
                    Please Select The City
                  </span>
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
                  <span className="m-0 my-0 text-danger">
                    Passoword Should be More 8 characters
                  </span>
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
                {showError &&
                  userData.Password !== userData.ConfirmPassword && (
                    <span className="m-0 my-0 text-danger">
                      Password not Match
                    </span>
                  )}
              </div>
            </div>

            {/* Button */}
            <div
              onClick={() => {
                if (
                  userData.NameAr.length >= 2 &&
                  userData.NameEn.length >= 2 &&
                  userData.Email.includes("@") &&
                  userData.PassportNumber.length > 3 &&
                  userData.HealthAuthorityNumber.length > 3 &&
                  userData.Country.length > 3 &&
                  userData.City.length > 3 &&
                  userData.Password.length >= 8 &&
                  userData.Password === userData.ConfirmPassword
                ) {
                  setShow(false);
                  setShow2(true);
                  setShow3(false);
                  setShowError(false);
                } else {
                  setShowError(true);
                }
              }}
              className="signup btn btn-info text-white fw-bold fs-5"
              style={{ background: "#3296d4", width: "300px" }}
            >
              Sign Up
            </div>

            {/* Have Account */}
            <div className="mt-3">
              I Already have an Account? &nbsp;
              <Link
                to="/login"
                className="fw-bold"
                style={{ color: "#3296d4" }}
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* ===================== */}

          {/* Main Info : 2 */}
          <div
            className="bio my-5"
            style={{ display: show2 ? "block" : "none" }}
          >
            <textarea
              name="Bio"
              cols="30"
              rows="10"
              className="w-100 rounded p-2 mb-2 mt-4"
              placeholder="Bio"
              onChange={handleChange}
            ></textarea>
            {showError2 && userData.Bio.length < 10 && (
              <span className="m-0 my-0 mb-3 text-danger">
                Bio Should be More 10 characters
              </span>
            )}
            <div className={style.form}>
              {/* Input */}
              <div>
                <div className={style.input}>
                  <input
                    type="text"
                    placeholder="Saudi Authority Number"
                    name="SaudiAuthorityNumber"
                    onChange={handleChange}
                    className="p-2"
                  />
                </div>
                {showError2 && userData.SaudiAuthorityNumber.length < 10 && (
                  <span className="m-0 my-0 text-danger">
                    Saudi Authority Number Should be More 10 characters
                  </span>
                )}
              </div>

              {/* Input */}
              <div>
                <div className={style.input}>
                  <input
                    type="number"
                    placeholder="Experience Years"
                    name="ExpYears"
                    onChange={handleChange}
                    className="p-2"
                  />
                </div>
                {showError2 && userData.ExpYears < 1 && (
                  <span className="m-0 my-0 text-danger">
                    Experience Years Should be More 1 Year
                  </span>
                )}
              </div>

              {/* Input */}
              <div>
                <div className={style.input}>
                  <input
                    type="text"
                    placeholder="Current Position"
                    name="CurrentWorkPlace"
                    onChange={handleChange}
                    className="p-2"
                  />
                </div>
                {showError2 && userData.CurrentWorkPlace.length < 3 && (
                  <span className="m-0 my-0 text-danger">
                    Current Position Should be More 3 characters
                  </span>
                )}
              </div>

              {/* Input */}

              <div>
                <div className={style.input}>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    name="BankAccount"
                    onChange={handleChange}
                    className="p-2"
                  />
                  <i className="fab fa-cc-visa"></i>
                </div>
                {showError2 && userData.BankAccount.length < 16 && (
                  <span className="m-0 my-0 text-danger">
                    Bank Account Should be More 16 characters
                  </span>
                )}
              </div>
            </div>

            <div
              className="btn btn-info text-white fw-bold px-5 fs-5"
              style={{ background: "#3296d4" }}
              onClick={() => {
                setShow(true);
                setShow2(false);
                setShow3(false);
              }}
            >
              Back
            </div>

            <div
              className="btn btn-info text-white fw-bold px-5 fs-5 mx-3"
              style={{ background: "#3296d4" }}
              onClick={() => {
                if (
                  userData.Bio.length >= 10 &&
                  userData.SaudiAuthorityNumber.length >= 10 &&
                  userData.ExpYears > 1 &&
                  userData.CurrentWorkPlace.length > 2 &&
                  userData.BankAccount.length >= 16
                ) {
                  setShow(false);
                  setShow2(false);
                  setShow3(true);
                } else {
                  setShowError2(true);
                }
              }}
            >
              Next
            </div>
          </div>

          {/* ===================== */}

          {/* Main Info : 3 */}
          <div
            className="speaker-uploads"
            style={{ display: show3 ? "block" : "none" }}
          >
            <div
              className=" my-5 d-flex justify-content-center justify-content-xl-between flex-wrap gap-3"
              style={{ display: !show && !show2 && show3 ? "block" : "none" }}
            >
              <div className="elem">
                <div className="text-muted my-2">
                  <i className="fas fa-arrow-up border border-secondary rounded fa-xs p-2 "></i>{" "}
                  upload Wlaa Card{" "}
                  <div className="text-danger d-inline">(not required)</div>
                </div>
                <div
                  className="input-group"
                  style={{ display: userData.WalaaCarFile ? "none" : "block" }}
                >
                  <input
                    type="file"
                    className="form-control"
                    id="WlaaCard"
                    onChange={(e) => handleUploadChange(e, "WalaaCarFile")}
                    hidden
                  />
                  <label
                    className="input-group-box d-flex flex-column align-items-center border px-5 text-muted py-5 rounded fs-5"
                    htmlFor="WlaaCard"
                  >
                    <img src={upload} alt="upload files" width="80px" />
                    <div className="text-center my-0">
                      Drag and Drop image{" "}
                      <p className="text-info d-inline">here</p>
                    </div>
                    <div className="text-center my-0">
                      or{" "}
                      <p className="text-info d-inline text-decoration-down">
                        upload
                      </p>{" "}
                      image
                    </div>
                  </label>
                </div>
                {/* After Uploading */}
                {userData.WalaaCarFile && (
                  <div
                    className="upload-container"
                    style={{
                      display: userData.WalaaCarFile ? "block" : "none",
                      width: "300px",
                      height: "230px",
                      border: "1px solid #dcdcdc",
                      borderRadius: "5px",
                      position: "relative",
                      overflow: "hidden",
                      paddingTop: "30px",
                    }}
                  >
                    <div className="d-flex justify-content-center gap-3 align-items-center px-3">
                      <img src={pdf} alt="Wlaa Card" width="80px" />
                      <div>
                        <p className="p-0 m-0 my-1 fs-5">
                          {userData.WalaaCarFile.name}
                        </p>
                        <p className="p-0 m-0 my-1 text-muted">
                          {userData.WalaaCarFile.size > 1024 * 1024
                            ? `${(
                                userData.WalaaCarFile.size /
                                (1024 * 1024)
                              ).toFixed(2)} MB`
                            : `${(userData.WalaaCarFile.size / 1024).toFixed(
                                2
                              )} KB`}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm py-3 w-100 rounded-0"
                        style={{ position: "absolute", bottom: "0" }}
                        onClick={() => handleDeleteImage("WalaaCarFile")}
                      >
                        <i className="fas fa-trash-alt fa-2xl"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="elem">
                <div className="text-muted my-2">
                  <i className="fas fa-arrow-up border border-secondary rounded fa-xs p-2 "></i>{" "}
                  upload passport photo
                </div>
                <div
                  className="input-group"
                  style={{
                    display: userData.PassportImageFile ? "none" : "block",
                  }}
                >
                  <input
                    type="file"
                    className="form-control"
                    id="PassportImage"
                    onChange={(e) => handleUploadChange(e, "PassportImageFile")}
                    hidden
                  />
                  <label
                    className="input-group-box d-flex flex-column align-items-center border px-5 text-muted py-5 rounded fs-5"
                    htmlFor="PassportImage"
                  >
                    <img src={upload} alt="upload files" width="80px" />
                    <div className="text-center my-0">
                      Drag and Drop image{" "}
                      <p className="text-info d-inline">here</p>
                    </div>
                    <div className="text-center my-0">
                      or{" "}
                      <p className="text-info d-inline text-decoration-down">
                        upload
                      </p>{" "}
                      image
                    </div>
                  </label>
                </div>
                {/* After Uploading */}
                {userData.PassportImageFile && (
                  <div
                    style={{
                      display: userData.PassportImageFile ? "block" : "none",
                      width: "300px",
                      height: "230px",
                      backgroundImage: `url(${URL.createObjectURL(
                        userData.PassportImageFile
                      )})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      position: "relative",
                      borderRadius: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-danger btn-sm py-3 w-100 rounded-0"
                      style={{ position: "absolute", bottom: "0" }}
                      onClick={() => handleDeleteImage("PassportImageFile")}
                    >
                      <i className="fas fa-trash-alt fa-2xl"></i>
                    </button>
                  </div>
                )}
              </div>

              <div className="elem">
                <div className="text-muted my-2">
                  <i className="fas fa-arrow-up border border-secondary rounded fa-xs p-2 "></i>{" "}
                  upload cv
                </div>
                <div
                  className="input-group"
                  style={{ display: userData.CvFile ? "none" : "block" }}
                >
                  <input
                    type="file"
                    className="form-control"
                    id="CvFile"
                    onChange={(e) => handleUploadChange(e, "CvFile")}
                    hidden
                  />
                  <label
                    className="input-group-box d-flex flex-column align-items-center border px-5 text-muted py-5 rounded fs-5"
                    htmlFor="CvFile"
                  >
                    <img src={upload} alt="upload files" width="80px" />
                    <div className="text-center my-0">
                      Drag and Drop image{" "}
                      <p className="text-info d-inline">here</p>
                    </div>
                    <div className="text-center my-0">
                      or{" "}
                      <p className="text-info d-inline text-decoration-down">
                        upload
                      </p>{" "}
                      image
                    </div>
                  </label>
                </div>
                {/* After Uploading */}
                {userData.CvFile && (
                  <div
                    className="upload-container"
                    style={{
                      display: userData.CvFile ? "block" : "none",
                      width: "300px",
                      height: "230px",
                      border: "1px solid #dcdcdc",
                      borderRadius: "5px",
                      position: "relative",
                      overflow: "hidden",
                      paddingTop: "30px",
                    }}
                  >
                    <div className="d-flex justify-content-center gap-3 align-items-center px-3">
                      <img src={pdf} alt="Wlaa Card" width="80px" />
                      <div>
                        <p className="p-0 m-0 my-1 fs-5">
                          {userData.CvFile.name}
                        </p>
                        <p className="p-0 m-0 my-1 text-muted">
                          {userData.CvFile.size > 1024 * 1024
                            ? `${(userData.CvFile.size / (1024 * 1024)).toFixed(
                                2
                              )} MB`
                            : `${(userData.CvFile.size / 1024).toFixed(2)} KB`}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm py-3 w-100 rounded-0"
                        style={{ position: "absolute", bottom: "0" }}
                        onClick={() => handleDeleteImage("CvFile")}
                      >
                        <i className="fas fa-trash-alt fa-2xl"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {errorMessage !== "" && (
              <p className="alert alert-danger">{errorMessage}</p>
            )}

            <div className="d-flex justify-content-center justify-content-xl-start">
              <div
                className="btn btn-info text-white fw-bold px-5 fs-5"
                style={{ background: "#3296d4" }}
                onClick={() => {
                  setShow(false);
                  setShow2(true);
                  setShow3(false);
                }}
              >
                Back
              </div>

              <div
                className="btn btn-info text-white fw-bold px-5 fs-5 mx-3"
                style={{ background: "#3296d4" }}
                onClick={handleSubmit}
              >
                Finish
              </div>
            </div>
          </div>

          {/* ===================== */}
        </form>
        <div
          className="position-absolute top-50 start-50"
          style={{
            transition: "0.5",
            transform: showDeleteModel
              ? "translate(-50%,-50%)"
              : "translate(200%, -50%)",
          }}
        >
          {showDeleteModel && (
            <DeleteModel
              onDelete={handleDeleteConfirmed}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </>
  );
}
