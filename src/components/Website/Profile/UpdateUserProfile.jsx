import { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { BASE } from "../../../Api";
import Success from "../Popups/Success";
import "./profiles.css";
import ResetPassword from "../Popups/ResetPassword";
// Translation Work
import { useTranslation } from "react-i18next";

export default function Profile() {
  // [1] States
  const { i18n } = useTranslation();
  const [user, setUser] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [profileFile, setProfileFile] = useState(null);

  const [showSuccessPopup, setSuccesshowPopup] = useState(false);
  const [showErrorPopup, setErrorhowPopup] = useState(false);

  // Handle Cookies
  const cookie = new Cookie();
  const token = cookie.get("edu-caring");

  const decodedToken = jwtDecode(token);

  // [3] Get User Data
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
            language: i18n.language,
          },
        }
      )
      .then((data) => {
        setUser(data.data.responseObject);
      })
      .catch((err) => console.log(err));
  }, [decodedToken.uid, i18n.language]);

  // console.log(user);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  // [4] Handle Save Click
  const handleSaveClick = () => {
    setIsEditMode(false);

    const formData = new FormData();

    formData.append("PhoneNumber", user.phoneNumber);
    formData.append("UserId", user.id);
    formData.append("Email", user.email);
    formData.append("NameAr", user.nameAr);
    formData.append("NameEn", user.nameEn);
    formData.append("GenderId", parseInt(user.gender.id));
    formData.append("ProfileImageFile", profileFile);
    formData.append("DateOfBirth", user.dateOfBirth);
    formData.append("City", user.city);
    formData.append("Country", user.country);
    formData.append("Specialization", user.specialization);
    formData.append("SpecializationCategoryId", user.specializationCategory.id);
    formData.append("PassportNumber", user.passportNumber);
    formData.append(
      "HealthAuthorityNumber",
      user.healthAuthorityNumber || "No Numbers"
    );
    formData.append("PassportImageFile", user.displayPassportImageURL);
    formData.append("CvFile", user.cvURL);
    formData.append("WalaaCarFile", user.walaaCardURL);
    formData.append("Bio", user.bio);
    formData.append("CurrentWorkPlace", user.currentWorkPlace);
    formData.append("BankAccount", user.bankAccount);
    formData.append("SaudiAuthorityNumber", user.saudiAuthorityNumber);
    formData.append("ExpYears", user.expYears || 0);
    formData.append("ProfileImage", user.profileImage);

    axios
      .put(`${BASE}/Auth/UpdateProfile`, formData)
      .then((data) => {
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

  // [6] Handle Upload Change
  const handleUploadChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === "ProfileImageFile") {
      setProfileFile(file);
    }
  };

  // [10] Get All Specialization Categories
  const [specializationCategories, setSpecializationCategories] = useState([]);
  useEffect(() => {
    axios
      .get(`${BASE}/MainData/GetAllSpecialization`, {
        headers: {
          language: i18n.language,
        },
      })
      .then((res) => {
        setSpecializationCategories(res.data.responseObject);
      })
      .catch((err) => console.log(err));
  }, [i18n.language]);

  // [11] Get All Gender
  const [genders, setGenders] = useState([]);
  useEffect(() => {
    axios
      .get(`${BASE}/MainData/GetAllGender`, {
        headers: {
          language: i18n.language,
        },
      })
      .then((res) => {
        setGenders(res.data.responseObject);
      })
      .catch((err) => console.log(err));
  }, [i18n.language]);

  const [showSelect, setShowSelect] = useState(true);
  const [showDateOfBirth, setShowDateOfBirth] = useState(true);
  const [showSelectSpecialization, setShowSelectSpecialization] =
    useState(true);

  console.log(user);

  const isValidImageUrl = (url) => {
    return (
      url &&
      !url.toLowerCase().endsWith("/null") &&
      url.toLowerCase().startsWith("http" || "https")
    );
  };
  return (
    <>
      {user && (
        <div
          className="profile p-2"
          style={{
            width: "90%",
            margin: "0 auto",
          }}
        >
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
              {isValidImageUrl(user.displayProfileImage) ? (
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
              {
                isEditMode && (
                  <label htmlFor="img">
                  {isValidImageUrl(user.displayProfileImage) ? (
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
                
                )
              }
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
              className="edit px-3 py-2 text-white rounded d-flex align-items-center"
              style={{ background: "#27AE60", cursor: "pointer" }}
              onClick={isEditMode ? handleSaveClick : handleEditClick}
            >
              <i
                className={
                  isEditMode
                    ? "fa-regular fa-check-square mx-2"
                    : "fa-regular fa-pen-to-square mx-2"
                }
              ></i>
              <span className="ms-2">
                {isEditMode
                  ? i18n.language === "en"
                    ? "Save"
                    : "حفظ"
                  : i18n.language === "en"
                  ? "Edit"
                  : "تعديل"}
              </span>
            </div>
          </div>

          {/* Info */}
          <div
            className="info my-3 d-grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill ,minmax(300px, 1fr))",
            }}
          >
            {/* ================== */}
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
                  onChange={(e) => setUser({ ...user, nameAr: e.target.value })}
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

            {/* ================== */}
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
                {i18n.language === "en" ? "Phone Number" : "رقم الهاتف"}
              </span>
            </div>

            {/* ================== */}
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
                  {i18n.language === "en" ? "date" : "تاريخ الميلاد"}
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
                          {i18n.language === "en"
                            ? "Select Gender"
                            : "اختر الجنس"}
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
                  {i18n.language === "en" ? " Gender" : " الجنس"}
                </span>
              </div>
            </div>

            {/* ================== */}
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
                    setUser({ ...user, healthAuthorityNumber: e.target.value })
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

            {/* ================== */}
            <div className="d-flex border rounded p-3 py-2 justify-content-between gap-3 overflow-hidden">
              {/* Specialization Category ID */}
              <div
                className={`info-item p-2 d-flex flex-column flex-grow-1 ${
                  isEditMode ? "edit-mode" : ""
                }`}
              >
                {isEditMode ? (
                  <>
                    {!showSelectSpecialization && (
                      <select
                        name="GenderId"
                        className="p-0"
                        style={{
                          outline: "0",
                          border: "0",
                          width: "100%",
                          height: "100%",
                          color: "#000",
                        }}
                        defaultValue="1"
                        onChange={(e) => {
                          setUser({
                            ...user,
                            specializationCategory: {
                              id: parseInt(e.target.value),
                              name: e.target.options[e.target.selectedIndex]
                                .text,
                            },
                          });
                          // console.log(parseInt(e.target.value))
                          showSelectSpecialization
                            ? setShowSelectSpecialization(false)
                            : setShowSelectSpecialization(true);
                        }}
                      >
                        <option disabled value="1">
                          {i18n.language === "en"
                            ? "Select Category"
                            : " اختر التخصص"}
                        </option>
                        {specializationCategories.map((specialization) => (
                          <option
                            key={specialization.id}
                            value={specialization.id}
                          >
                            {specialization.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {showSelectSpecialization && (
                      <span
                        className="fs-5"
                        onClick={() => {
                          showSelectSpecialization
                            ? setShowSelectSpecialization(false)
                            : setShowSelectSpecialization(true);
                        }}
                      >
                        {user && user.specializationCategory?.name}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="fs-5">
                    {user && user.specializationCategory?.name}
                  </span>
                )}
                <span
                  style={{
                    color: "#747688",
                    fontSize: isEditMode ? "12px" : "14px",
                  }}
                >
                  {i18n.language === "en"
                    ? "Specialization Category"
                    : " تصنيف التخصص"}
                </span>
              </div>
              {/* Specialization */}
              <div
                className={`info-item p-2 d-flex flex-column flex-grow-1 ${
                  isEditMode ? "edit-mode" : ""
                }`}
              >
                {isEditMode ? (
                  <input
                    type="text"
                    className="border-0 mb-1"
                    style={{ outline: "0" }}
                    value={user.specialization}
                    onChange={(e) =>
                      setUser({ ...user, specialization: e.target.value })
                    }
                  />
                ) : (
                  <span className="fs-5">{user.specialization}</span>
                )}
                <span
                  style={{
                    color: "#747688",
                    fontSize: isEditMode ? "12px" : "14px",
                  }}
                >
                  {i18n.language === "en" ? "Specialization" : " التخصص"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
