import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { ADD_AFFILIATE_CODE, BASE, UPDATE_AFFILIATE_CODE } from "../API/Api";
import "./style.css";
import Cookie from "cookie-universal";

export default function AffiliateCodeAction({
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
  const { t, i18n } = useTranslation();
  const cookies = new Cookie();
  const token = cookies.get("edu-caring");

  // submit to  create and edit api
  const handleSubmit = async () => {
    console.log("createModalData", createModalData);

    console.log(type);

    let sendData = {
      ...createModalData,
    };

    console.log(sendData);

    try {
      setLoading(true);
      if (
        !createModalData.code ||
        !createModalData.nameAr ||
        !createModalData.nameEn
      ) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please fill all required fields.",
        });
        return;
      }

      let response;

      // append data as json to sendData
      sendData = {
        id: createModalData.id,
        code: createModalData.code,
        nameAr: createModalData.nameAr,
        nameEn: createModalData.nameEn,
        isDeleted: createModalData.isDeleted,
      };

      if (type === "create") {
        response = await axios
          .post(`${BASE}/${ADD_AFFILIATE_CODE}`, sendData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((data) => {
            console.log(data);
            setRunUseEffect((prev) => prev + 1);
            setCreateModalVisible(false);
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Promo Code saved successfully.",
            });
            setRunUseEffect((prev) => prev + 1);
            setCreateModalVisible(false);
          })
          .catch((err) => console.log(err));
      } else if (type === "edit") {
        response = await axios
          .put(`${BASE}/${UPDATE_AFFILIATE_CODE}`, sendData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((data) => {
            console.log(data);
            setRunUseEffect((prev) => prev + 1);
            setCreateModalVisible(false);
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Promo Code updated successfully.",
            });
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save promo code.",
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
          header={
            type === "create" ? t("CreateNewAffiliateCode") : t("EditSpeaker")
          }
          visible={visible}
          style={{
            backgroundColor: "white",
            direction: i18n.language === "ar" ? "rtl" : "ltr",
            minWidth: "400px",
          }}
          onHide={() => {
            setCreateModalVisible(false);
          }}
          footer={footerContent}
          className="d-flex justify-content-center flex-column  gap-5 p-3  border border-2 border-gray-300 dialog-landig-page-actions "
          footerClassName="footer-edit-landing-page"
        >
          {/* Text upload input */}
          <div className=" gap-2">
            <div className="box d-flex align-items-center justify-content-between mt-2  ">
              <p style={{ margin: 0 }}>{t("Code")}</p>
              <InputText
                type="text"
                style={{ width: "255px" }}
                className="p-inputtext-lg border p-2 mx-1"
                placeholder={t("Code")}
                value={createModalData.code}
                onChange={(e) =>
                  setCreateModalData((prev) => ({
                    ...prev,
                    code: e.target.value,
                  }))
                }
              />
            </div>
            <div className="box">
              <div className="box d-flex align-items-center justify-content-between mt-2  ">
                <p style={{ margin: 0 }}>{t("nameAr")}</p>
                <InputText
                type="text"
                style={{ width: "255px" }}
                className="p-inputtext-lg border p-2 mx-1"
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
            </div>
            <div className="box">
              <div className="box d-flex align-items-center justify-content-between my-2  ">
                <p style={{ margin: 0 }}>{t("nameEn")}</p>
                <InputText
                type="text"
                style={{ width: "255px" }}
                className="p-inputtext-lg border p-2 mx-1"
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
