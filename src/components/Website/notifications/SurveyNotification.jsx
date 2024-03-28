import { useEffect, useRef, useState } from "react";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import logo from "../../../assets/logo.jpg";
import Form from "react-bootstrap/Form";
import StarRating from "./StarRating";
import { ADD_REVIEW, BASE } from "../../../Api";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
export default function SurveyNotification({
  notification,
  sendTime,
  onHandleMenu,
}) {
  const { t } = useTranslation();
  const toast = useRef(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const questionsRef = useRef(null);
  const cookie = new Cookie();
  const token = cookie.get("edu-caring");
  const decodedToken = token ? jwtDecode(token) : {};

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        questionsRef.current &&
        !questionsRef.current.contains(event.target)
      ) {
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
  function handleSetRating(rating) {
    setRating(rating);
  }
  function handleSetComment(comment) {
    setComment(comment.target.value);
  }
  function handleSend() {
    if (!notification) {
      console.error("Notification is null");
      return;
    }
    if (!decodedToken.uid) {
      console.error("Decoded token is null");
      return;
    }
    axios
      .post(`${BASE}/${ADD_REVIEW}`, {
        eventId: notification.eventId,
        id: 0,
        eventDayId: Number(notification.eventDayId),
        userId: decodedToken.uid,
        rate: rating,
        comment,
      })
      .then((res) => {
        if (res.data.isSuccess === true) {
          toast.current.show({
            severity: "info",
            summary: t("SurveySent"),
            detail: t("ThanksForYourFeedback"),
            life: 3000,
          });

          setTimeout(() => {
            onHandleMenu(false);
          }, 3000);
          setPopupVisible(false);
        }
      })
      .catch((err) => {
        console.error("Error sending review:", err);
      });
  }

  return (
    <div ref={questionsRef} className="question">
      <Toast ref={toast} />
      <div className="notif-row" onClick={togglePopup}>
        <img src={logo} alt="notify-img" />
        <div className="text">
          <h6> {t("EventOrganizer")}</h6>
          <p className="survey">{t("PleaseWeNeedYourSurvey")}</p>
          <div className="stars">
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
          </div>
          <span className="ago">{new Date(sendTime).toDateString()}</span>
        </div>
      </div>
      <div
        className={`notif-questions-popup shadow-lg  ${
          popupVisible ? "show " : "slide-out"
        }`}
      >
        <div className="head">
          <h4> {t("Review")}</h4>
          <i
            style={{ cursor: "pointer" }}
            className="bi bi-x close"
            onClick={togglePopup}
          ></i>
        </div>
        <div className="body">
          <div className="vote-questions-head">
            <h2> {t("PleaseGiveUsYourReview")}</h2>
            <StarRating
              maxRating={5}
              className="m-auto star-rating-container"
              color="#F3BC58"
              onSetRating={handleSetRating}
            />
          </div>
          <div className="vote-questions-body">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={t("YourFeedBackIsImportant")}
              className="question-textarea p-3 m-3"
              aria-label="With textarea"
              value={comment}
              onChange={handleSetComment}
              type="text"
              id="inputPassword5"
              aria-describedby="passwordHelpBlock"
            />
          </div>
          <div className="btns p-3 d-flex gap-5 justify-content-center send-close-container">
            <button
              className={`send-question-btn survey-rate-btn btn  flex-column d-flex justify-content-center
           ${rating !== 0 ? "" : "disabled bt-disabled-op"} `}
              style={{ cursor: "pointer" }}
              onClick={handleSend}
            >
              {t("Submit")}
            </button>
            <button
              className={`send-question-btn survey-rate-cancel-btn btn btn-secondary flex-column d-flex justify-content-center
            `}
              style={{ cursor: "pointer" }}
              onClick={togglePopup}
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
