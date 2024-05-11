import React from "react";
import { useState } from "react";
// Translation Work
import { useTranslation } from "react-i18next";

export default function RowPopup({ rowData, visible, setVisible }) {
  console.log(rowData);
  const { i18n } = useTranslation();
  const [popupVisible, setPopupVisible] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const openPopup = (image) => {
    setSelectedImage(image);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setSelectedImage(null);
    setPopupVisible(false);
  };

  // user data => nameEn , nameAr, email , phoneNumber , isBlocked , specialization , healthAuthorityNumber
  //           => gender , birthDate , country , city , address , passportNumber , saudiAuthorityNumber
  //          => DisplaywalaaCardURL , DisplaypassportURL , DisplayProfileURL, DisplayCVURL
  return (
    <>
      <div
        className=" w-75 bg-white position-fixed top-50 start-50 rounded-3 overflow-y-auto "
        style={{
          transform: "translate(-50%, -50%)",
          transition: "0.5s",
          zIndex: "10000",
          scrollbarWidth: "none",
          boxShadow: "0px 0px 30px #666",
          height: "90vh",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center py-2 px-3 position-sticky"
          style={{ backgroundColor: "#F2F2F2", top: "-1px" }}
        >
          <h3>{i18n.language === "en" ? "User Info" : "معلومات المستخدم"}</h3>
          <i
            className="fa-solid fa-x"
            style={{ cursor: "pointer" }}
            onClick={() => setVisible(!visible)}
          ></i>
        </div>

        <div className="py-2 d-flex flex-column gap-3 justify-content-center ">
          <div className="d-flex justify-content-between align-items-center py-2 px-3 bg-light">
            <h5 className="m-0">
              {i18n.language === "en" ? "English Name :" : "الاسم بالانجليزي :"}
            </h5>
            <p className="m-0">{rowData.nameEn}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center py-2 px-3 bg-light">
            <h5 className="m-0">
              {i18n.language === "en" ? "Arabic Name :" : "الاسم بالعربي"}
            </h5>
            <p className="m-0">{rowData.nameAr}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center py-2 px-3">
            <h5 className="m-0">
              {i18n.language === "en" ? "Email" : "البريد الالكتروني"} :
            </h5>
            <p className="m-0">{rowData.email}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center py-2 px-3 bg-light">
            <h5 className="m-0">
              {i18n.language === "en" ? "Phone" : "رقم الهاتف"} :
            </h5>
            <p className="m-0">{rowData.phoneNumber}</p>
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3">
            <h5 className="m-0">
              {i18n.language === "en" ? "Gender" : "النوع"} :
            </h5>
            <p className="m-0">{rowData.genderId === 1 ? "Male" : "Female"}</p>
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3 bg-light">
            <h5 className="m-0">
              {i18n.language === "en" ? "Bio" : "نبذة عن اه"} :
            </h5>
            {rowData.bio ? (
              <p className="m-0">{rowData.bio}</p>
            ) : (
              <p className="text-danger">
                {i18n.language === "en" ? "Not provided" : "غير متوفر"}
              </p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3 bg-light">
            <h5 className="m-0">
              {i18n.language === "en" ? "Birth Date" : "تاريخ الميلاد"} :
            </h5>
            <p className="m-0">{rowData.dateOfBirth.split("T")[0]}</p>
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3">
            <h5 className="m-0">
              {i18n.language === "en" ? "Country" : "الدولة"} :
            </h5>
            <p className="m-0">{rowData.country}</p>
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3 bg-light">
            <h5 className="m-0">
              {i18n.language === "en" ? "City" : "المدينة"} :
            </h5>
            <p className="m-0">{rowData.city}</p>
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3">
            <h5 className="m-0">
              {i18n.language === "en" ? "Address" : "العنوان"} :
            </h5>
            {rowData.address ? (
              <p className="m-0">{rowData.address}</p>
            ) : (
              <p className="text-danger">
                {i18n.language === "en" ? "Not provided" : "غير متوفر"}
              </p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3 bg-light">
            <h5 className="m-0">
              {i18n.language === "en" ? "Status" : "الحالة"} :
            </h5>
            <p className="m-0">{rowData.isBlocked ? "Blocked" : "Active"}</p>
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3 bg-light">
            <h5 className="m-0">
              {i18n.language === "en" ? "Specialization" : " التخصص"} :
            </h5>
            {rowData.specialization ? (
              <p className="m-0">{rowData.specialization}</p>
            ) : (
              <p className="text-danger">
                {i18n.language === "en" ? "Not provided" : "غير متوفر"}
              </p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3">
            <h5 className="m-0">
              {i18n.language === "en" ? "currentWorkPlace" : " العمل الحالي"} :
            </h5>
            {rowData.currentWorkPlace ? (
              <p className="m-0">{rowData.currentWorkPlace}</p>
            ) : (
              <p className="text-danger">
                {i18n.language === "en" ? "Not provided" : "غير متوفر"}
              </p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3 bg-light">
            <h5 className="m-0">
              {i18n.language === "en" ? " Exp Years" : " سنوات الخبرة"} :
            </h5>
            {rowData.expYears ? (
              <p className="m-0">{rowData.expYears}</p>
            ) : (
              <p className="text-danger">
                {i18n.language === "en" ? "Not provided" : "غير متوفر"}
              </p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3">
            <h5 className="m-0">
              {i18n.language === "en"
                ? "Health Authority Number"
                : "رقم الهيئة الصحية"}{" "}
              :
            </h5>
            {rowData.healthAuthorityNumber === "No Numbers" ? (
              <p className="text-danger">
                {i18n.language === "en" ? "No Numbers" : " لا يوجد ارقام"}
              </p>
            ) : (
              <p className="m-0">{rowData.healthAuthorityNumber}</p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3 bg-light">
            <h5 className="m-0">
              {i18n.language === "en" ? "Passport Number" : "رقم الجواز"} :
            </h5>
            {rowData.passportNumber ? (
              <p className="m-0">{rowData.passportNumber}</p>
            ) : (
              <p className="text-danger">
                {i18n.language === "en" ? "Not Provided" : "غير متوفر"}
              </p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3">
            <h5 className="m-0">
              {i18n.language === "en"
                ? "Saudi Authority Number"
                : "رقم الهيئة السعودية"}{" "}
              :
            </h5>
            {rowData.saudiAuthorityNumber ? (
              <p className="m-0">{rowData.saudiAuthorityNumber}</p>
            ) : (
              <p className="text-danger">
                {i18n.language === "en" ? "Not Provided" : "غير متوفر"}
              </p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3">
            <h5 className="m-0">
              {i18n.language === "en" ? "Profile Picture" : "الصورة الشخصية"} :
            </h5>
            {rowData.displayProfileImage ? (
              <a
                onClick={() => openPopup(rowData.displayProfileImage)}
                className="m-0"
              >
                {i18n.language === "en" ? "View" : "عرض"}
              </a>
            ) : (
              <p className="text-danger">
                {i18n.language === "en" ? "Not provided" : "غير متوفر"}
              </p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3 bg-light">
            <h5 className="m-0">
              {i18n.language === "en" ? "CV" : "السيرة الذاتية"} :
            </h5>
            {rowData.displayCvURL ? (
              <a
                onClick={() => openPopup(rowData.displayCvURL)}
                className="m-0"
              >
                {i18n.language === "en" ? "View" : "عرض"}
              </a>
            ) : (
              <p className="text-danger">
                {i18n.language === "en" ? "Not provided" : "غير متوفر"}
              </p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3">
            <h5 className="m-0">
              {i18n.language === "en" ? "Passport" : "الجواز"} :
            </h5>
            {rowData.displayPassportImageURL ? (
              <a
                onClick={() => openPopup(rowData.displayPassportImageURL)}
                className="m-0"
              >
                {i18n.language === "en" ? "View" : "عرض"}
              </a>
            ) : (
              <p className="text-danger">
                {i18n.language === "en" ? "Not provided" : "غير متوفر"}
              </p>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 px-3 bg-light">
            <h5 className="m-0">
              {i18n.language === "en" ? "Walaa Card" : "بطاقة الولاء"} :
            </h5>
            {rowData.displayWalaaCardURL ? (
              <a
                onClick={() => openPopup(rowData.displayWalaaCardURL)}
                className="m-0"
              >
                {i18n.language === "en" ? "View" : "عرض"}
              </a>
            ) : (
              <p className="text-danger">
                {i18n.language === "en" ? "Not provided" : "غير متوفر"}
              </p>
            )}
          </div>
        </div>
      </div>
      {selectedImage && (
        <div
          className="custom-popup bg-white position-fixed top-50 start-50 rounded-3 overflow-y-auto "
          style={{
            transform: selectedImage
              ? "translate(-50%, -50%)"
              : "translate(900%,-50%)",
            transition: "0.5s",
            zIndex: "1000000",
            height: "90vh",
            scrollbarWidth: "none",
            boxShadow: "0px 0px 30px #666",
            width: "60%",
          }}
        >
          <div className="popup-content">
            <div
              className="d-flex justify-content-between align-items-center py-2 px-3"
              style={{ backgroundColor: "#F2F2F2" }}
            >
              <h3>
                {i18n.language === "en" ? "Zoomed Image" : "الصورة المكبرة"}
              </h3>
              <i
                className="fa-solid fa-x"
                style={{ cursor: "pointer" }}
                onClick={closePopup}
              ></i>
            </div>
            <div className="d-flex justify-content-center align-items-center my-2 ">
              <img
                src={selectedImage}
                alt="image"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
