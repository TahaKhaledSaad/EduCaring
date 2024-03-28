import React, { useEffect, useRef, useState } from "react";
import logo from "../../../assets/logo.jpg";

import axios from "axios";
import { BASE, SPEAKER_RATE_ANSWER } from "../../../Api";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";

const SpeakerRateNotification = ({ sendTime, notification, onHandleMenu }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const toast = useRef(null);
  const questionsRef = useRef(null);
  const cookie = new Cookie();
  const token = cookie.get("edu-caring");
  const decodedToken = token ? jwtDecode(token) : {};
  const { t } = useTranslation();
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

  function handleSend() {
    if (selectedSpeaker) {
      axios
        .post(
          `${BASE}/${SPEAKER_RATE_ANSWER}`,
          {
            eventId: notification.id,
            eventDayId: notification.eventDaySpeakers[0].eventDayId,
            speakerId: selectedSpeaker.id,
            UserId: decodedToken.uid,
            rate: 5,
            comment: "This is a sample comment",
          },
          {
            headers: {
              UserId: decodedToken.uid,
            },
          }
        )
        .then((res) => {
          if (res.data.isSuccess === true) {
            toast.current.show({
              severity: "info",
              summary: t("RateSent"),
              detail: t("YourRateHasBeenSubmittedSuccessfully"),
              life: 3000,
            });

            setTimeout(() => {
              onHandleMenu(false);
            }, 3000);
            setPopupVisible(false);
          }
        })
        .catch((err) => console.log(err));
    }
  }
  const renderProfileImage = (speaker) => {
    if (
      speaker.speaker.displayProfileImage &&
      !speaker.speaker.displayProfileImage.endsWith("null")
    ) {
      return (
        <img
          src={speaker.speaker.displayProfileImage}
          alt={speaker.speaker.name}
        />
      );
    } else {
      return (
        <div className="profile_letters">
          <p className="text-center rounded-circle text-white d-flex align-items-center justify-content-center m-auto">
            {speaker.speaker.name.slice(0, 2).toUpperCase()}
          </p>
        </div>
      );
    }
  };
  return (
    <div ref={questionsRef} className="question">
      <Toast ref={toast} />
      <div className="notif-row" onClick={togglePopup}>
        <img src={logo} alt="notify-img" />
        <div className="text">
          <h6>{t("EventOrganizer")}</h6>
          <p className="new">{t("pleaseRateSpeakers")}</p>
          <span className="ago">{new Date(sendTime).toDateString()}</span>
        </div>
      </div>
      <div
        className={`notif-questions-popup shadow-lg  ${
          popupVisible ? "show " : "slide-out"
        }`}
      >
        <div className="head">
          <h4>{t("Vote")}</h4>
          <i className="bi bi-x close" onClick={togglePopup}></i>
        </div>
        <div className="body">
          <div className="vote-questions-head">
            <h2>{notification.numberOfVote + " " + t("Vote")} </h2>
            <p>{t("ChooseYourFavoriteSpeaker")}</p>
          </div>
          <div className="vote-questions-body">
            {notification.eventDaySpeakers.map((speaker) => (
              <div
                className={`vote-item ${
                  speaker.speaker.id === selectedSpeaker?.id
                    ? "vote-item-checked"
                    : ""
                }`}
                key={speaker.id}
              >
                <div
                  className="speaker"
                  onClick={() => setSelectedSpeaker(speaker.speaker)}
                >
                  {renderProfileImage(speaker)}
                  <h5>{speaker.speaker.name}</h5>
                  <Form.Check
                    aria-label="option 1"
                    onChange={() => setSelectedSpeaker(speaker.speaker)}
                    checked={selectedSpeaker?.id === speaker?.speaker?.id}
                    value={speaker.speaker.id}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="btns p-3 mt-5">
            <button
              className={`send-question-btn speaker-rate-btn btn btn-success flex-column d-flex justify-content-center
              ${selectedSpeaker !== null ? "" : "disabled bt-disabled-op"}`}
              onClick={handleSend}
            >
              {t("SaveAndClose")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerRateNotification;
