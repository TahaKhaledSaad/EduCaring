import React from "react";
// Translation Work
import { useTranslation } from "react-i18next";

export default function RowPopup({ rowData, visible, setVisible }) {
  console.log(rowData);
  const { i18n } = useTranslation();
  return (
    <>
      <div
        className=" w-50 bg-white position-fixed top-50 start-50 rounded-3 overflow-y-auto "
        style={{
          transform: "translate(-50%, -50%)",
          transition: "0.5s",
          zIndex: "10000",
          scrollbarWidth: "none",
          boxShadow: "0px 0px 30px #666",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center py-2 px-3"
          style={{ backgroundColor: "#F2F2F2" }}
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
              {i18n.language === "en" ? "Name" : "الاسم"} :
            </h5>
            <p className="m-0">
              {i18n.language === "en" ? rowData.nameEn : rowData.nameAr}
            </p>
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
              {i18n.language === "en" ? "Status" : "الحالة"} :
            </h5>
            <p className="m-0">{rowData.isBlocked ? "Blocked" : "Active"}</p>
          </div>
          {rowData.specialization && (
            <div className="d-flex justify-content-between align-items-center py-2 px-3 bg-light">
              <h5 className="m-0">
                {i18n.language === "en" ? "Specialization" : " التخصص"} :
              </h5>
              <p className="m-0">{rowData.specialization}</p>
            </div>
          )}

          {rowData.healthAuthorityNumber && (
            <div className="d-flex justify-content-between align-items-center py-2 px-3">
              <h5 className="m-0">
                {i18n.language === "en"
                  ? "Health Authority Number"
                  : "رقم الهيئة الصحية"}{" "}
                :
              </h5>
              <p className="m-0">{rowData.healthAuthorityNumber}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
