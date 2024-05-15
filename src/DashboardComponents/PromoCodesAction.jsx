import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  ADD_PROMO_CODE,
  BASE,
  LANDING_SPEAKER_EDIT,
  UPDATE_PROMO_CODE,
} from "../API/Api";
import "./style.css";
import Cookie from "cookie-universal";

export default function PromoCodesAction({
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

  function convertDateToISO(dateString) {
    const date = new Date(dateString);
    const isoString = date.toISOString().slice(0, -1); // Removes the 'Z' at the end
    const milliseconds = date
      .getMilliseconds()
      .toString()
      .padStart(3, "0")
      .slice(0, 2); // Get and format milliseconds to two decimal places
    return `${isoString.slice(0, -4)}.${milliseconds}`;
  }

  // submit to  create and edit api
  const handleSubmit = async () => {
    console.log("createModalData", createModalData);

    console.log(type);

    let sendData = {
      ...createModalData,
      expirationDate: convertDateToISO(createModalData.expirationDate),
    };

    console.log(sendData);

    try {
      setLoading(true);
      if (
        !createModalData.code ||
        !createModalData.discountPercentage ||
        !createModalData.expirationDate ||
        !createModalData.limitNumber
      ) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please fill all required fields.",
        });
        return;
      }

      const formData = new FormData();
      formData.append("code", createModalData.code);
      formData.append("discountPercentage", createModalData.discountPercentage);
      formData.append(
        "expirationDate",
        convertDateToISO(createModalData.expirationDate)
      );
      formData.append("limitNumber", createModalData.limitNumber);
      formData.append("id", createModalData.id);
      formData.append("isDeleted", createModalData.isDeleted);
      formData.append("note", createModalData.note);

      if (type === "create") {
        response = await axios
          .post(`${BASE}/${ADD_PROMO_CODE}`, sendData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((data) => console.log(data))
          .catch((err) => console.log(err));
      } else if (type === "edit") {
        response = await axios
          .put(`${BASE}/${UPDATE_PROMO_CODE}`, sendData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((data) => console.log(data))
          .catch((err) => console.log(err));
      }

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Promo Code saved successfully.",
        });
        setRunUseEffect((prev) => prev + 1);
        setCreateModalVisible(false);
      }
    } catch (error) {
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
            type === "create" ? t("CreateNewPromoCode") : t("EditSpeaker")
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
                <p style={{ margin: 0 }}>{t("DiscountPercentage")}</p>
                <InputNumber
                  className="p-inputtext-lg border p-2 mx-1"
                  style={{ width: "255px" }}
                  placeholder={t("DiscountPercentage")}
                  prefix="%"
                  value={createModalData.discountPercentage}
                  onChange={(e) =>
                    setCreateModalData((prev) => ({
                      ...prev,
                      discountPercentage: e.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="box">
              <div className="box d-flex align-items-center justify-content-between mt-2  ">
                <p style={{ margin: 0 }}>{t("ExpirationDate")}</p>
                <Calendar
                  className="p-inputtext-lg border p-2 mx-1"
                  style={{ width: "255px" }}
                  placeholder={t("ExpirationDate")}
                  dateFormat="dd/mm/yy"
                  value={createModalData.expirationDate}
                  onChange={(e) =>
                    setCreateModalData((prev) => ({
                      ...prev,
                      expirationDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="box d-flex align-items-center justify-content-between mt-2 mb-2 ">
                <p style={{ margin: 0 }}>{t("LimitNumber")}</p>
                <InputNumber
                  type="text"
                  className="p-inputtext-lg  border p-2 mx-1"
                  style={{ width: "255px" }}
                  placeholder={t("LimitNumber")}
                  mode="decimal"
                  showButtons
                  min={0}
                  value={createModalData.limitNumber}
                  onChange={(e) =>
                    setCreateModalData((prev) => ({
                      ...prev,
                      limitNumber: e.value,
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
