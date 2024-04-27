import { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { BASE } from "./../../../Api";
import "./profiles.css";
import upload from "./../../../assets/image.png";
import pdf from "./../../../assets/pdf.png";
import Success from "../Popups/Success";
import ResetPassword from "../Popups/ResetPassword";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [showCommingWalaaFile, setShowCommingWalaaFile] = useState(true);
  const [showCommingPassportFile, setShowCommingPassportFile] = useState(true);
  const [showCommingCvFile, setShowCommingCvFile] = useState(true);

  const [walaaFile, setWalaaFile] = useState(null);
  const [passportFile, setPassportFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);

  const [showSuccessPopup, setSuccesshowPopup] = useState(false);
  const [showErrorPopup, setErrorhowPopup] = useState(false);

  const cookie = new Cookie();
  const token = cookie.get("edu-caring");

  const decodedToken = jwtDecode(token);

  console.log(user);

  useEffect(() => {
    axios
      .post(
        `${BASE}/Auth/GetProfile`,
        {
          userId: decodedToken.uid,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "text/plain",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((data) => {
        setUser(data.data.responseObject);
      })
      .catch((err) => console.log(err));
  }, [decodedToken.uid]);

  const handleEditClick = () => setIsEditMode(true);

  useEffect(() => {
    user && user?.displayWalaaCardURL == undefined
      ? setShowCommingWalaaFile(false)
      : setShowCommingWalaaFile(true);
    user && user?.displayPassportImageURL == undefined
      ? setShowCommingPassportFile(false)
      : setShowCommingPassportFile(true);
    user && user?.displayCvURL == undefined
      ? setShowCommingCvFile(false)
      : setShowCommingCvFile(true);
  }, [user]);

  const handleSaveClick = () => {
    setIsEditMode(false);

    const formData = new FormData();

    formData.append("PhoneNumber", user.phoneNumber);
    formData.append("UserId", user.id);
    formData.append("Email", user.email);
    formData.append("NameAr", user.nameAr);
    formData.append("NameEn", user.nameEn);
    formData.append("GenderId", user.gender?.id || 1);
    formData.append("ProfileImage", user.profileImage);
    formData.append("DateOfBirth", user.dateOfBirth);
    formData.append("City", user.city);
    formData.append("Country", user.country);
    formData.append("Specialization", user.specialization);
    formData.append(
      "SpecializationCategoryId",
      user.specializationCategoryId || ""
    );
    formData.append("PassportNumber", user.passportNumber);
    formData.append("HealthAuthorityNumber", user.healthAuthorityNumber);
    formData.append("Bio", user.bio);
    formData.append("CurrentWorkPlace", user.currentWorkPlace);
    formData.append("BankAccount", user.bankAccount);
    formData.append("SaudiAuthorityNumber", user.saudiAuthorityNumber);
    formData.append("ExpYears", user.expYears || 0);

    // Append files
    formData.append("ProfileImageFile", profileFile); // File
    formData.append("PassportImageFile", passportFile); // Passport image file
    formData.append("CvFile", cvFile); // CV file
    formData.append("WalaaCarFile", walaaFile); // Wlaa card file

    console.log(formData);

    console.log("cv: ", cvFile);
    console.log("passport: ", passportFile);
    console.log("walaa: ", walaaFile);

    axios
      .put(`${BASE}/Auth/UpdateProfile`, formData)
      .then((data) => {
        console.log(data);
        data.data.isSuccess ? setSuccesshowPopup(true) : setErrorhowPopup(true);
      })
      .catch((err) => console.log(err));
  };

  function formatDate(dateString) {
    if (!dateString) return "";

    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    return `${parseInt(day)}/${parseInt(month)}/${parseInt(year)}`;
  }

  const formattedDateOfBirth = user && formatDate(user.dateOfBirth);

  // [8] Handle Delete Image
  const handleDeleteImage = (imageType) => {
    if (imageType === "WalaaCarFile") {
      setWalaaFile(null);
    }
    if (imageType === "PassportImageFile") {
      setPassportFile(null);
    }
    if (imageType === "CvFile") {
      setCvFile(null);
    }
    if (imageType === "ProfileImageFile") {
      setProfileFile(null);
    }
  };

  // console.log(cvFile);
  console.log(user.displayCvURL);
  console.log(showCommingCvFile);
  console.log(showCommingPassportFile);

  // [6] Handle Upload Change
  const handleUploadChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === "WalaaCarFile") {
      setWalaaFile(file);
    }
    if (fileType === "PassportImageFile") {
      setPassportFile(file);
    }
    if (fileType === "CvFile") {
      setCvFile(file);
    }
    if (fileType === "ProfileImageFile") {
      setProfileFile(file);
    }
  };

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

  const [showSelect, setShowSelect] = useState(true);
  const [showDateOfBirth, setShowDateOfBirth] = useState(true);

  return (
    <>
      {user && (
        <div className="p-4">
          {showSuccessPopup && (
            <Success
              text={
                i18n.language === "en"
                  ? "Profile Updated Successfully!"
                  : "تم تحديث الملف الشخصي بنجاح!"
              }
              type="success"
            />
          )}
          {showErrorPopup && (
            <Success
              text={
                i18n.language === "en"
                  ? "Error Updating Profile!"
                  : "خطأ في تحديث الملف الشخصي!"
              }
              type="error"
            />
          )}

          {/* Head */}
          <div
            className="head d-flex flex-column flex-md-row gap-3 align-items-center pb-3"
            style={{ borderBottom: "1px solid #DCDCDC" }}
          >
            <div className="position-relative">
              {user.displayProfileImage ? (
                <img
                  src={
                    profileFile
                      ? URL.createObjectURL(profileFile)
                      : user.displayProfileImage
                  }
                  alt="personImg"
                  width={"120px"}
                  height={"120px"}
                  style={{ objectFit: "cover" }}
                  className="rounded-circle"
                />
              ) : (
                <div
                  className="rounded-circle mb-2"
                  style={{
                    width: "120px",
                    height: "120px",
                    background: "lightgray",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: " 0 auto",
                  }}
                >
                  <span className="text-dark fs-3 fw-bold">
                    {user.nameEn?.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}

              <input
                type="file"
                id="img"
                hidden
                onChange={(e) => handleUploadChange(e, "ProfileImageFile")}
              />
              <label htmlFor="img">
                {user.displayProfileImage ? (
                  <i
                    className="fa-solid fa-camera p-2 text-white rounded-circle position-absolute bottom-0"
                    style={{
                      backgroundColor: "#3296D4",
                      right: "5px",
                      cursor: "pointer",
                    }}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-camera p-2 text-white rounded-circle position-absolute"
                    style={{
                      backgroundColor: "#3296D4",
                      right: "10px",
                      bottom: "25px",
                      cursor: "pointer",
                    }}
                  ></i>
                )}
              </label>
            </div>

            <div className="text flex-grow-1">
              {isEditMode ? (
                <div>
                  <h3>
                    <input
                      type="text"
                      className="border-0 mb-1"
                      style={{ outline: "0" }}
                      value={user.nameEn}
                      onChange={(e) =>
                        setUser({ ...user, nameEn: e.target.value })
                      }
                    />
                  </h3>
                  <p>
                    <input
                      type="text"
                      className="border-0 mb-1 w-50"
                      style={{ outline: "0" }}
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="fs-3">{user.nameEn}</h3>
                  <p style={{ color: "#747688" }}>{user.email}</p>
                </div>
              )}
            </div>

            <ResetPassword
              userID={decodedToken.uid}
              email={decodedToken.email}
            />

            <div
              className="edit px-3 py-2 text-white rounded d-flex align-items-center gap-1"
              style={{ background: "#27AE60", cursor: "pointer" }}
              onClick={isEditMode ? handleSaveClick : handleEditClick}
            >
              <i
                className={
                  isEditMode
                    ? "fa-regular fa-check-square"
                    : "fa-regular fa-pen-to-square"
                }
              ></i>{" "}
              <span className="ms-2">
                {isEditMode
                  ? `${i18n.language === "en" ? "Save" : "حفط"} `
                  : `${i18n.language === "en" ? "Edit" : "تعديل"}`}
              </span>
            </div>
          </div>

          {/* Profile */}
          <div className="container-profile">
            <div className="without-bio my-3">
              {/* Input */}
              <div
                className={`info-item p-2 border rounded d-flex flex-column ${
                  isEditMode ? "edit-mode" : ""
                }`}
              >
                {isEditMode ? (
                  <input
                    type="text"
                    className="border-0 mb-1"
                    style={{ outline: "0" }}
                    value={user.nameAr}
                    onChange={(e) =>
                      setUser({ ...user, nameAr: e.target.value })
                    }
                  />
                ) : (
                  <span className="fs-5">{user.nameAr}</span>
                )}
                <span
                  style={{
                    color: "#747688",
                    fontSize: isEditMode ? "12px" : "14px",
                  }}
                >
                  الإسم (باللغة العربية)
                </span>
              </div>

              {/* Input */}
              <div
                className={`info-item p-2 border rounded d-flex flex-column ${
                  isEditMode ? "edit-mode" : ""
                }`}
              >
                {isEditMode ? (
                  <input
                    type="text"
                    className="border-0 mb-1"
                    style={{ outline: "0" }}
                    value={user.phoneNumber}
                    onChange={(e) =>
                      setUser({ ...user, phoneNumber: e.target.value })
                    }
                  />
                ) : (
                  <span className="fs-5">{user.phoneNumber}</span>
                )}
                <span
                  style={{
                    color: "#747688",
                    fontSize: isEditMode ? "12px" : "14px",
                  }}
                >
                  {i18n.language === "en" ? " Phone Number" : " رقم الهاتف"}
                </span>
              </div>

              {/* Input */}
              <div className="info-item d-flex border rounded p-3 py-2 justify-content-between gap-3 overflow-hidden">
                {/* Data of Birth */}
                <div
                  className={` p-2 d-flex flex-column ${
                    isEditMode ? "edit-mode" : ""
                  }`}
                  style={{ borderRight: "1px solid #DCDCDC" }}
                >
                  {isEditMode ? (
                    <>
                      {!showDateOfBirth && (
                        <input
                          type="date"
                          className="border-0 mb-1"
                          style={{ outline: "0" }}
                          value={dateOfBirth}
                          onChange={(e) => {
                            setDateOfBirth(e.target.value);
                            setUser({ ...user, dateOfBirth: e.target.value });
                            showDateOfBirth
                              ? setShowDateOfBirth(false)
                              : setShowDateOfBirth(true);
                          }}
                        />
                      )}
                      {showDateOfBirth && (
                        <span
                          className="fs-5"
                          onClick={() => {
                            showDateOfBirth
                              ? setShowDateOfBirth(false)
                              : setShowDateOfBirth(true);
                          }}
                        >
                          {formattedDateOfBirth}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="fs-5">{formattedDateOfBirth}</span>
                  )}
                  <span
                    style={{
                      color: "#747688",
                      fontSize: isEditMode ? "12px" : "14px",
                    }}
                  >
                    {i18n.language === "en" ? "date" : "التاريخ"}
                  </span>
                </div>
                {/* Gender Input */}
                <div
                  className={`p-2 d-flex flex-column flex-grow-1 ${
                    isEditMode ? "edit-mode" : ""
                  }`}
                >
                  {isEditMode ? (
                    <>
                      {!showSelect && (
                        <select
                          name="GenderId"
                          className="p-0"
                          defaultValue="0"
                          style={{
                            outline: "0",
                            border: "0",
                            width: "100%",
                            height: "100%",
                            color: "#000",
                          }}
                          onChange={(e) => {
                            setUser({
                              ...user,
                              gender: {
                                id: parseInt(e.target.value),
                                name: e.target.options[e.target.selectedIndex]
                                  .text,
                              },
                            });
                            showSelect
                              ? setShowSelect(false)
                              : setShowSelect(true);
                          }}
                        >
                          <option disabled value="0">
                            Select Gender
                          </option>
                          {genders.map((gender) => (
                            <option key={gender.id} value={gender.id}>
                              {gender.name}
                            </option>
                          ))}
                        </select>
                      )}

                      {showSelect && (
                        <span
                          className="fs-5"
                          onClick={() => {
                            console.log("delete me!");
                            showSelect
                              ? setShowSelect(false)
                              : setShowSelect(true);
                          }}
                        >
                          {user && user.gender?.name}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="fs-5">{user && user.gender?.name}</span>
                  )}
                  <span
                    style={{
                      color: "#747688",
                      fontSize: isEditMode ? "12px" : "14px",
                    }}
                  >
                    {i18n.language === "en" ? "gender" : "النوع"}
                  </span>
                </div>
              </div>

              {/* Input */}
              <div
                className={`info-item p-2 border rounded d-flex flex-column ${
                  isEditMode ? "edit-mode" : ""
                }`}
              >
                {isEditMode ? (
                  <input
                    type="text"
                    className="border-0 mb-1"
                    style={{ outline: "0" }}
                    value={user?.healthAuthorityNumber}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        healthAuthorityNumber: e.target.value,
                      })
                    }
                  />
                ) : (
                  <span className="fs-5">{user?.healthAuthorityNumber}</span>
                )}
                <span
                  style={{
                    color: "#747688",
                    fontSize: isEditMode ? "12px" : "14px",
                  }}
                >
                  {i18n.language === "en"
                    ? "health authority number"
                    : "رقم الهيئة الصحية"}
                </span>
              </div>

              {/* Input */}
              <div
                className={`info-item p-2 border rounded d-flex flex-column ${
                  isEditMode ? "edit-mode" : ""
                }`}
              >
                {isEditMode ? (
                  <input
                    type="text"
                    className="border-0 mb-1"
                    style={{ outline: "0" }}
                    value={user?.passportNumber}
                    onChange={(e) =>
                      setUser({ ...user, passportNumber: e.target.value })
                    }
                  />
                ) : (
                  <span className="fs-5">{user?.passportNumber}</span>
                )}
                <span
                  style={{
                    color: "#747688",
                    fontSize: isEditMode ? "12px" : "14px",
                  }}
                >
                  {i18n.language === "en" ? "passport" : "جواز السفر"}
                </span>
              </div>

              {/* Input */}
              <div
                className={`info-item p-2 border rounded d-flex flex-column ${
                  isEditMode ? "edit-mode" : ""
                }`}
              >
                {isEditMode ? (
                  <input
                    type="text"
                    className="border-0 mb-1"
                    style={{ outline: "0" }}
                    value={user?.saudiAuthorityNumber}
                    onChange={(e) =>
                      setUser({ ...user, saudiAuthorityNumber: e.target.value })
                    }
                  />
                ) : (
                  <span className="fs-5">{user?.saudiAuthorityNumber}</span>
                )}
                <span
                  style={{
                    color: "#747688",
                    fontSize: isEditMode ? "12px" : "14px",
                  }}
                >
                  {i18n.language === "en"
                    ? "Saudi Commission for Specializations number"
                    : "رقم الهيئة السعودية للتخصصات"}
                </span>
              </div>

              {/* Input */}
              <div
                className={`info-item p-2 border rounded d-flex flex-column ${
                  isEditMode ? "edit-mode" : ""
                }`}
              >
                {isEditMode ? (
                  <input
                    type="text"
                    className="border-0 mb-1"
                    style={{ outline: "0" }}
                    value={user?.currentWorkPlace}
                    onChange={(e) =>
                      setUser({ ...user, currentWorkPlace: e.target.value })
                    }
                  />
                ) : (
                  <span className="fs-5">{user?.currentWorkPlace}</span>
                )}
                <span
                  style={{
                    color: "#747688",
                    fontSize: isEditMode ? "12px" : "14px",
                  }}
                >
                  {i18n.language === "en"
                    ? "Current Position"
                    : "المنصب الحالي"}
                </span>
              </div>

              {/* Input */}
              <div
                className={`info-item p-2 border rounded d-flex flex-column ${
                  isEditMode ? "edit-mode" : ""
                }`}
              >
                {isEditMode ? (
                  <input
                    type="text"
                    className="border-0 mb-1"
                    style={{ outline: "0" }}
                    value={user?.bankAccount}
                    onChange={(e) =>
                      setUser({ ...user, bankAccount: e.target.value })
                    }
                  />
                ) : (
                  <span className="fs-5">{user?.bankAccount}</span>
                )}
                <span
                  style={{
                    color: "#747688",
                    fontSize: isEditMode ? "12px" : "14px",
                  }}
                >
                  {i18n.language === "en" ? "Credit Card" : "بطاقة إئتمان"}
                </span>
              </div>
            </div>

            {/* Flexed With This */}
            <div className="with-bio">
              <div
                className={`info-item p-2 border rounded d-flex flex-column mt-2 ${
                  isEditMode ? "edit-mode" : ""
                }`}
              >
                {isEditMode ? (
                  <textarea
                    type="text"
                    className="border-0 mb-1"
                    style={{ outline: "0" }}
                    value={user?.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  />
                ) : (
                  <span>{user?.bio}</span>
                )}
                <span
                  style={{
                    color: "#747688",
                    fontSize: isEditMode ? "12px" : "14px",
                  }}
                >
                  {i18n.language === "en" ? "Bio" : "نبذه"}
                </span>
              </div>
            </div>
          </div>

          {/* Uploads Section */}
          <div className="speaker-uploads">
            <div className=" my-5 d-flex justify-content-center justify-content-xl-between flex-wrap gap-3">
              <div className="elem">
                <div className="text-muted my-2">
                  <i className="fas fa-arrow-up border border-secondary rounded fa-xs p-2 "></i>{" "}
                  {i18n.language === "en"
                    ? "upload Wlaa Card"
                    : "تحميل بطاقة Wlaa"}{" "}
                  <div className="text-danger d-inline">
                    {i18n.language === "en" ? "(not required)" : "(غير مطلوب)"}
                  </div>
                </div>
                {/* Upload Label */}
                {!showCommingWalaaFile && (
                  <div
                    className="input-group"
                    style={{ display: walaaFile ? "none" : "block" }}
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
                        {i18n.language === "en"
                          ? "Drag and Drop image"
                          : "سحب وإسقاط الصورة"}{" "}
                        <p className="text-info d-inline">
                          {i18n.language === "en" ? "here" : "هنا"}
                        </p>
                      </div>
                      <div className="text-center my-0">
                        {i18n.language === "en" ? "or" : "او"}{" "}
                        <p className="text-info d-inline text-decoration-down">
                          {i18n.language === "en" ? "upload" : "رفع"}
                        </p>{" "}
                        {i18n.language === "en" ? "image" : "صورة"}
                      </div>
                    </label>
                  </div>
                )}
                {/* Before Uploading -> Comming Image */}
                {user.displayWalaaCardURL && showCommingWalaaFile && (
                  <div
                    className="upload-container"
                    style={{
                      display: user.displayWalaaCardURL ? "block" : "none",
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
                          {user.displayWalaaCardURL.name}
                        </p>
                        <p className="p-0 m-0 my-1 text-muted">
                          {user.displayWalaaCardURL.size > 1024 * 1024
                            ? `${(
                                user.displayWalaaCardURL.size /
                                (1024 * 1024)
                              ).toFixed(2)} MB`
                            : `${(user.displayWalaaCardURL.size / 1024).toFixed(
                                2
                              )} KB`}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm py-3 w-100 rounded-0"
                        style={{ position: "absolute", bottom: "0" }}
                        onClick={() => {
                          setShowCommingWalaaFile(false);
                          handleSaveClick();
                        }}
                      >
                        <i className="fas fa-trash-alt fa-2xl"></i>
                      </button>
                    </div>
                  </div>
                )}
                {/* After Uploading */}
                {walaaFile && (
                  <div
                    className="upload-container"
                    style={{
                      display: walaaFile ? "block" : "none",
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
                        <p className="p-0 m-0 my-1 fs-5">{walaaFile.name}</p>
                        <p className="p-0 m-0 my-1 text-muted">
                          {walaaFile.size > 1024 * 1024
                            ? `${(walaaFile.size / (1024 * 1024)).toFixed(
                                2
                              )} MB`
                            : `${(walaaFile.size / 1024).toFixed(2)} KB`}
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
                  {i18n.language === "en"
                    ? "upload passport photo"
                    : "تحميل صورة جواز السفر"}
                </div>
                {/* Upload Label */}
                {!showCommingPassportFile && (
                  <div
                    className="input-group"
                    style={{
                      display: passportFile ? "none" : "block",
                    }}
                  >
                    <input
                      type="file"
                      className="form-control"
                      id="PassportImage"
                      onChange={(e) =>
                        handleUploadChange(e, "PassportImageFile")
                      }
                      hidden
                    />
                    <label
                      className="input-group-box d-flex flex-column align-items-center border px-5 text-muted py-5 rounded fs-5"
                      htmlFor="PassportImage"
                    >
                      <img src={upload} alt="upload files" width="80px" />
                      <div className="text-center my-0">
                        {i18n.language === "en"
                          ? "Drag and Drop image"
                          : "سحب وإسقاط الصورة"}{" "}
                        <p className="text-info d-inline">
                          {i18n.language === "en" ? "here" : "هنا"}
                        </p>
                      </div>
                      <div className="text-center my-0">
                        {i18n.language === "en" ? "or" : "او"}{" "}
                        <p className="text-info d-inline text-decoration-down">
                          {i18n.language === "en" ? "upload" : "رفع"}
                        </p>{" "}
                        {i18n.language === "en" ? "image" : "صورة"}
                      </div>
                    </label>
                  </div>
                )}
                {/* Comming Image -> Passport Image */}
                {user.displayPassportImageURL && showCommingPassportFile && (
                  <div
                    style={{
                      display: user.displayPassportImageURL ? "block" : "none",
                      width: "300px",
                      height: "230px",
                      position: "relative",
                      borderRadius: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={user.displayPassportImageURL}
                      className="d-block w-100"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      alt="Passport"
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm py-3 w-100 rounded-0"
                      style={{ position: "absolute", bottom: "0" }}
                      onClick={() => {
                        setShowCommingPassportFile(false);
                        handleSaveClick();
                      }}
                    >
                      <i className="fas fa-trash-alt fa-2xl"></i>
                    </button>
                  </div>
                )}
                {/* After Uploading */}
                {passportFile && (
                  <div
                    style={{
                      display: passportFile ? "block" : "none",
                      width: "300px",
                      height: "230px",
                      backgroundImage: `url(${URL.createObjectURL(
                        passportFile
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
                  {i18n.language === "en"
                    ? "upload cv"
                    : "تحميل السيرة الذاتية"}
                </div>
                {/* Upload Label */}
                {!showCommingCvFile && (
                  <div
                    className="input-group"
                    style={{ display: cvFile ? "none" : "block" }}
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
                        {i18n.language === "en"
                          ? "Drag and Drop image"
                          : "سحب وإسقاط الصورة"}{" "}
                        <p className="text-info d-inline">
                          {i18n.language === "en" ? "here" : "هنا"}
                        </p>
                      </div>
                      <div className="text-center my-0">
                        {i18n.language === "en" ? "or" : "او"}{" "}
                        <p className="text-info d-inline text-decoration-down">
                          {i18n.language === "en" ? "upload" : "رفع"}
                        </p>{" "}
                        {i18n.language === "en" ? "image" : "صورة"}
                      </div>
                    </label>
                  </div>
                )}
                {/* Comming File -> Cv File */}
                {user.displayCvURL && showCommingCvFile && (
                  <div
                    className="upload-container"
                    style={{
                      display: user.displayCvURL ? "block" : "none",
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
                          {user.displayCvURL.name}
                        </p>
                        <p className="p-0 m-0 my-1 text-muted">
                          {user.displayCvURL.size > 1024 * 1024
                            ? `${(
                                user.displayCvURL.size /
                                (1024 * 1024)
                              ).toFixed(2)} MB`
                            : `${(user.displayCvURL.size / 1024).toFixed(
                                2
                              )} KB`}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm py-3 w-100 rounded-0"
                        style={{ position: "absolute", bottom: "0" }}
                        onClick={() => {
                          setShowCommingCvFile(false);
                          handleSaveClick();
                        }}
                      >
                        <i className="fas fa-trash-alt fa-2xl"></i>
                      </button>
                    </div>
                  </div>
                )}
                {/* After Uploading */}
                {cvFile && (
                  <div
                    className="upload-container"
                    style={{
                      display: cvFile ? "block" : "none",
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
                        <p className="p-0 m-0 my-1 fs-5">{cvFile.name}</p>
                        <p className="p-0 m-0 my-1 text-muted">
                          {cvFile.size > 1024 * 1024
                            ? `${(cvFile.size / (1024 * 1024)).toFixed(2)} MB`
                            : `${(cvFile.size / 1024).toFixed(2)} KB`}
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
            <div className="d-flex justify-content-center justify-content-xl-start"></div>
          </div>

          {/* *** */}
          {/* *** */}
          {/* *** */}
        </div>
      )}
    </>
  );
}
