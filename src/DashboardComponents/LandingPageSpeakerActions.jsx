import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { BASE, LANDING_SPEAKER_CREATE, LANDING_SPEAKER_EDIT } from "../API/Api";
import "./style.css";
import Cookie from "cookie-universal";

export default function LandingPageSpeakerActions({
  visible,
  setCreateModalData,
  setRunUseEffect,
  setCreateModalVisible,
  type,
  createModalData,
  loading,
  setLoading,
}) {
  const toast = useRef(null);
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const { t, i18n } = useTranslation();
  const cookies = new Cookie();
  const token = cookies.get("edu-caring");
  useEffect(() => {
    if (createModalData.imageURL) {
      setPreviewURL(createModalData.imageURL);
    }
  }, [createModalData.imageURL]);

  // handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target?.files?.[0];
    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);

    try {
      setPreviewURL(URL.createObjectURL(selectedFile));
    } catch (err) {
      console.error("Error while setting preview URL:", err);
    }

    // Update the imageURL field in createModalData
    setCreateModalData((prev) => ({
      ...prev,
      imageURL: URL.createObjectURL(selectedFile) || "",
    }));
  };
  // submit to  create and edit api
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (
        (!file && !createModalData.imageURL) ||
        !createModalData.nameAr ||
        !createModalData.nameEn ||
        !createModalData.titleAr ||
        !createModalData.titleEn
      ) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please fill all required fields.",
        });
        return;
      }
      let response;
      const formDataWithImage = new FormData();
      if (file) {
        formDataWithImage.append("ImageFile", file);
      }

      Object.entries(createModalData).forEach(([key, value]) => {
        if (key === "imageURL") return;
        formDataWithImage.append(key, value);
      });

      if (type === "create") {
        response = await axios.post(
          `${BASE}/${LANDING_SPEAKER_CREATE}`,
          formDataWithImage,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (type === "edit") {
        response = await axios.put(
          `${BASE}/${LANDING_SPEAKER_EDIT}`,
          formDataWithImage,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Speaker saved successfully.",
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
    <div className=" flex justify-content-center ">
      {!loading && (
        <Dialog
          header={type === "create" ? t("CreateNewSpeaker") : t("EditSpeaker")}
          visible={visible}
          style={{
            backgroundColor: "white",
            direction: i18n.language === "ar" ? "rtl" : "ltr",
          }}
          onHide={() => {
            setCreateModalVisible(false);
            setPreviewURL("");
            setFile(null);
          }}
          footer={footerContent}
          className="d-flex justify-content-center flex-column  gap-5 p-3  border border-2 border-gray-300 dialog-landig-page-actions "
          footerClassName="footer-edit-landing-page"
        >
          {/* Display image preview */}
          {previewURL && (
            <div className="box d-flex align-items-center justify-content-center">
              <img
                src={previewURL}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  margin: "0 auto",
                }}
              />
            </div>
          )}
          {/* Image upload input */}
          <div className="box d-flex align-items-center justify-content-center mt-2 gap-5">
            <p>{t("UploadImage")}</p>
            <input
              type="file"
              className="p-inputtext-lg form-control form-control-lg"
              onChange={handleFileChange}
            />
          </div>
          {/* Text upload input */}
          <div className=" mt-5 gap-5">
            <div className="box d-flex align-items-center justify-content-around mt-2  ">
              <p style={{ margin: 0 }}>{t("titleAr")}</p>
              <InputText
                type="text"
                style={{ width: "70%" }}
                className="p-inputtext-lg border p-2"
                placeholder={t("titleAr")}
                value={createModalData.titleAr}
                onChange={(e) =>
                  setCreateModalData((prev) => ({
                    ...prev,
                    titleAr: e.target.value,
                  }))
                }
              />
            </div>
            <div className="box">
              <div className="box d-flex align-items-center justify-content-around mt-2  ">
                <p style={{ margin: 0 }}>{t("titleEn")}</p>
                <InputText
                  type="text"
                  className="p-inputtext-lg border p-2"
                  style={{ width: "70%" }}
                  placeholder={t("titleEn")}
                  value={createModalData.titleEn}
                  onChange={(e) =>
                    setCreateModalData((prev) => ({
                      ...prev,
                      titleEn: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="box">
              <div className="box d-flex align-items-center justify-content-around mt-2  ">
                <p style={{ margin: 0 }}>{t("nameAr")}</p>
                <InputText
                  type="text"
                  className="p-inputtext-lg border p-2"
                  style={{ width: "70%" }}
                  placeholder={t("nameAr")}
                  value={createModalData.nameAr}
                  onChange={(e) =>
                    setCreateModalData((prev) => ({
                      ...prev,
                      nameAr: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="box d-flex align-items-center justify-content-around mt-2  ">
                <p style={{ margin: 0 }}>{t("nameEn")}</p>
                <InputText
                  type="text"
                  className="p-inputtext-lg  border p-2"
                  style={{ width: "70%" }}
                  placeholder={t("nameEn")}
                  value={createModalData.nameEn}
                  onChange={(e) =>
                    setCreateModalData((prev) => ({
                      ...prev,
                      nameEn: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </Dialog>
      )}
      <Toast ref={toast}></Toast>
    </div>
  );
}
