import { useEffect, useRef, useState } from "react";

import logo from "../../../assets/logo.jpg";
import { useTranslation } from "react-i18next";
const WinnerSpeakerNotification = ({ notifications, sendTime }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef();

  const handleClickOutside = (event) => {
    if (node.current && !node.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const toggleIsOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  const sortedNotifications = notifications.sort(
    (a, b) => b.totalRate - a.totalRate
  );
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
    <div ref={node} className="question">
      <div className="notif-row" onClick={toggleIsOpen}>
        <img src={logo} alt="notify-img" />
        <div className="text">
          <h6>{t("EventOrganizer")}</h6>
          <p className="new">{t("NewUpdateInSpeakersRating")}</p>

          <span className="ago">{new Date(sendTime).toDateString()}</span>
        </div>
      </div>
      <div
        className={`notif-questions-popup shadow-lg ${
          isOpen ? "show" : "slide-out"
        }`}
      >
        <div className="head">
          <h4>{t("WinnerSpeaker")}</h4>
          <i
            className="bi bi-x close"
            onClick={toggleIsOpen}
            style={{ cursor: "pointer" }}
          ></i>
        </div>
        <div className="body">
          <div className="vote-questions-head">
            <h2>
              {notifications.reduce((a, b) => a + b.totalRate, 0) +
                " " +
                t("Votes")}
            </h2>
          </div>
          <div className="vote-questions-body border-bottom border-3 p-3 mb-5">
            {sortedNotifications.map((speaker, i) => (
              <div
                key={speaker.id}
                className={`vote-item ${i === 0 ? "vote-item-checked" : ""}`}
              >
                <div className="speaker">
                  {renderProfileImage(speaker)}
                  <h5>{speaker.speaker.name}</h5>
                  <p>
                    {speaker.totalRate} {t("Votes")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="btn-box mt-3 p-3 d-flex justify-content-center align-items-center fs-4 text-center ">
            <p>
              {t("TheWinnerIs")}{" "}
              <span style={{ color: "#F3BC58", fontWeight: "bold" }}>
                {sortedNotifications[0].speaker.name}
              </span>{" "}
              {t("with")}{" "}
              <span style={{ fontWeight: "bold" }}>
                {sortedNotifications[0].totalRate} {t("Votes")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerSpeakerNotification;
