import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { ADD_SUPPORT, BASE } from "../../../Api";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
export default function Support() {
  const { t } = useTranslation();
  const [popupVisible, setPopupVisible] = useState(false);
  const [supportData, setSupportData] = useState({ title: "", content: "" });
  const suppRef = useRef(null);
  const toast = useRef(null);
  const cookie = new Cookie();
  const token = cookie.get("edu-caring");
  const decodedToken = token ? jwtDecode(token) : {};

  useEffect(() => {
    function handleClickOutside(event) {
      if (suppRef.current && !suppRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    }

    if (popupVisible) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [popupVisible]);

  function togglePopup() {
    setPopupVisible((prevState) => !prevState);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setSupportData((prevSupportData) => ({
      ...prevSupportData,
      [name]: value,
    }));
  }
  function sendSupport() {
    // Send support data to backend
    axios
      .post(`${BASE}/${ADD_SUPPORT}`, {
        id: 0,
        title: supportData.title,
        content: supportData.content,
        userId: decodedToken.uid, // You need to replace this with the actual userId
        isSpeaker: false, // Update this based on your requirement
      })
      .then((response) => {
        if (response.data.isSuccess === true) {
          console.log(response, response.data);
          toast.current.show({
            severity: "info",
            summary: t("MessageSent"),
            detail: t("MessageSentSuccessfullyWeWillContactYou"),
            life: 3000,
          });

          setPopupVisible(false);
          setSupportData({ title: "", content: "" });
        }
        // Clear the input fields
      })
      .catch((error) => {
        console.error("Error sending support:", error);
        // Handle error
      });
  }
  return (
    <>
      <div className="supp" ref={suppRef}>
        <Toast ref={toast} />
        <div className="support" onClick={togglePopup}>
          <span>{t("Support")}</span>
          <i className="bi bi-signpost-2"></i>
        </div>

        {popupVisible && (
          <div
            className={`support-popup shadow-lg ${
              popupVisible ? "slide-in" : "slide-out"
            }`}
          >
            <div className="head">
              <h4>{t("Support")}</h4>
              <i className="bi bi-x close" onClick={togglePopup}></i>
            </div>
            <div className="body">
              <i className="bi bi-signpost-2"></i>
              <div className="form">
                <div>
                  <input
                    type="text"
                    placeholder={t("Title")}
                    name="title"
                    onChange={handleChange}
                    value={supportData.title}
                  />
                </div>
                <div>
                  <input
                    placeholder={t("Details")}
                    className="detials"
                    type="text"
                    name="content"
                    onChange={handleChange}
                    value={supportData.content}
                  />
                </div>
                <div className="btns">
                  <button onClick={sendSupport}>{t("Send")}</button>
                  <button className="cancel" onClick={togglePopup}>
                    {t("Cancel")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
