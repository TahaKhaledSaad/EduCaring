import React, { useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

import axios from "axios";
import { useTranslation } from "react-i18next";
import { InputTextarea } from "primereact/inputtextarea";
import { BASE, LANDING_ABOUT_US_UPDATE } from "../API/Api";
import "./style.css";
import Cookie from "cookie-universal";

export default function LandingPageAboutUsActions({
  visible,
  setCreateModalData,
  setRunUseEffect,
  setCreateModalVisible,
  createModalData,
  loading,
  setLoading,
}) {
  const toast = useRef(null);
  const cookies = new Cookie();
  const token = cookies.get("edu-caring");
  const { t, i18n } = useTranslation();

  // submit to edit api
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE}/${LANDING_ABOUT_US_UPDATE}`,
        createModalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Text saved successfully.",
        });
        setRunUseEffect((prev) => prev + 1);
        setCreateModalVisible(false);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save speaker.",
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  // Footer Content for the Dialog
  const footerContent = (
    <div className="footer-edit-landing-page-create">
      <Button
        label={t("Cancel")}
        size="small"
        icon="pi pi-times"
        onClick={() => setCreateModalVisible(false)}
        className="p-button-text p-button send-cancel-edit-landing py-2 px-4 bg-danger text-white rounded mx-2"
      />
      <Button
        label={t("Save")}
        size="small"
        icon="pi pi-check"
        className="p-button-info p-button send-cancel-edit-landing py-2 px-4  text-white rounded mx-2"
        onClick={handleSubmit}
        autoFocus
      />
    </div>
  );
  return (
    <div className=" flex justify-content-center only-dashboard">
      {!loading && (
        <Dialog
          header={t("EditText")}
          visible={visible}
          style={{
            backgroundColor: "white",
            direction: i18n.language === "ar" ? "rtl" : "ltr",
          }}
          onHide={() => setCreateModalVisible(false)}
          footer={footerContent}
          className="d-flex justify-content-center flex-column  gap-5 p-3  border border-2 border-gray-300 dialog-landig-text-actions dialog-landig-page-actions col-md-6"
          footerClassName="footer-edit-landing-page"
        >
          {/* Text upload input */}
          <div className=" mt-5 gap-5">
            <div className="box d-flex align-items-center justify-content-around mt-5 p-float-label  ">
              <InputTextarea
                id="descriptionAr"
                autoResize
                style={{ marginTop: "10px", width: "100%", fontSize: "15px" }}
                value={createModalData.descriptionAr}
                onChange={(e) =>
                  setCreateModalData((prev) => ({
                    ...prev,
                    descriptionAr: e.target.value,
                  }))
                }
                rows={5}
                cols={30}
              />
              <label htmlFor="descriptionAr" style={{ margin: 0 }}>
                {t("descriptionAr")}
              </label>
            </div>
            <hr
              className="m-5 mx-auto border-3"
              style={{
                borderColor: "#6366f1",
                width: "50px",
                alignSelf: "center",
              }}
            />
            <div className="box d-flex align-items-center justify-content-around mt-5 p-float-label ">
              <InputTextarea
                id="descriptionEn"
                autoResize
                style={{ marginTop: "10px", width: "100%", fontSize: "15px" }}
                value={createModalData.descriptionEn}
                onChange={(e) =>
                  setCreateModalData((prev) => ({
                    ...prev,
                    descriptionEn: e.target.value,
                  }))
                }
                rows={5}
                cols={30}
              />
              <label htmlFor="descriptionEn" style={{ margin: 0 }}>
                {t("descriptionEn")}
              </label>
            </div>
            <hr
              className="m-5 mx-auto border-3"
              style={{
                borderColor: "#6366f1",
                width: "50px",
                alignSelf: "center",
              }}
            />
          </div>
        </Dialog>
      )}
      <Toast ref={toast}></Toast>
    </div>
  );
}
