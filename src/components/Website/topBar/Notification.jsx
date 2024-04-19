import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import {
  BASE,
  GET_NOTIFICATIONS,
  GET_QUESTIONS,
  GET_SPEAKER_QUESTIONS,
  SPEAKER_RATE,
  WINNER_SPEAKER,
} from "../../../Api";
import EventDayQuestionNotification from "../notifications/EventDayQuestionNotification";
import SpeakerQuestionNotification from "../notifications/SpeakerQuestionNotification";
import SpeakerRateNotification from "../notifications/SpeakerRateNotification";
import WinnerSpeakerNotification from "../notifications/WinnerSpeakerNotification";
import SurveyNotification from "../notifications/SurveyNotification";
import NightEventNotification from "../notifications/NightEventNotification";
import { useTranslation } from "react-i18next";
import CommunityNotification from "../notifications/CommunityNotification";
export default function Notification() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [notificationTypes, setNotificationTypes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { i18n, t } = useTranslation();
  const suppRef = useRef(null);
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
      fetchNotificationTypes();
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
      setNotifications([]);
    };
  }, [popupVisible]);

  const fetchNotificationTypes = () => {
    axios
      .get(`${BASE}/${GET_NOTIFICATIONS}`, {
        headers: {
          UserId: decodedToken.uid,
          Authorization: `Bearer ${token}`,
        },
      })
      .then(handleNotificationTypesResponse)
      .catch((err) => console.log(err));
  };

  const handleNotificationTypesResponse = (response) => {
    setNotificationTypes(response.data.responseObject);
    response.data.responseObject.forEach((notification) => {
      if (!notification.isAnswered)
        fetchNotificationsByType(
          notification.type,
          notification.requestedId,
          notification.sendTime,
          notification.eventId,
          notification.id
        );
    });
  };

  /**
   * Fetch notifications by type
   * @param {string} type Notification type
   * @param {number} requestedId ID of the requested entity
   * @param {number} sendTime Time of sending the notification
   * @param {number} eventId ID of the event
   * @param {number} id ID of the notification
   */
  const fetchNotificationsByType = (
    type,
    requestedId,
    sendTime,
    eventId = 0,
    id = 0
  ) => {
    let url; // The notification API endpoint

    // Build the API endpoint depending on the notification type
    switch (type) {
      case "EventDayQuestion":
        url = `${BASE}/${GET_QUESTIONS}?eventId=${requestedId}`;
        break;
      case "SpeakerQuestion":
        url = `${BASE}/${GET_SPEAKER_QUESTIONS}?eventDaySpeakerId=${requestedId}`;
        break;
      case "SpeakerRate":
        url = `${BASE}/${SPEAKER_RATE}?eventDayId=${requestedId}`;
        break;
      case "WinnerSpeaker":
        url = `${BASE}/${WINNER_SPEAKER}?eventDayId=${requestedId}`;
        break;
      default:
        break;
    }
    console.log(i18n.language);
    // If the notification type is Survey or NightEvent
    // then we already have the data, so we can save
    // an API call and just format the data
    if (type === "Survey" || type === "NightEvent" || type === "Community") {
      const not = {
        data: {
          responseObject:
            type === "Survey"
              ? { eventId, eventDayId: requestedId, id }
              : { eventDayId: requestedId, id },
        },
      };
      handleNotificationsResponse(not, type, sendTime);
    } else {
      // Otherwise, make an API call to fetch the data
      axios
        .get(url, {
          headers: {
            UserId: decodedToken.uid,
            Language: i18n.language,
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // If the notification type is EventDayQuestion,
          // we need to pass eventId as well
          if (type === "EventDayQuestion") {
            handleNotificationsResponse(response, type, sendTime, eventId, {
              eventDayId: requestedId,
            });
          } else {
            handleNotificationsResponse(response, type, sendTime);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleNotificationsResponse = (
    response,
    type,
    sendTime,
    eventId = 0,
    eventDayId = 0
  ) => {
    const newNotification = {
      type,
      data: response.data.responseObject,
      sendTime,
      eventId,
      eventDayId,
    };
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      newNotification,
    ]);
  };

  function togglePopup() {
    setPopupVisible((prevState) => !prevState);
  }

  return (
    <div className="notification" ref={suppRef}>
      <div className="icon" onClick={togglePopup}>
        <i className="bi bi-bell-fill"></i>
      </div>

      {popupVisible && (
        <div className="notif-popup">
          <div className="head">
            <h5>{t("Notifications")}</h5>
            <span>{t("MarkAllAsRead")}</span>
          </div>
          <div className="body">
            {/* Render notifications based on type */}
            {notifications.map((notification, index) => {
              switch (notification.type) {
                case "EventDayQuestion":
                  return (
                    <EventDayQuestionNotification
                      key={index}
                      notification={notification.data}
                      sendTime={notification.sendTime}
                      eventId={notification.eventId}
                      eventDayId={notification.eventDayId}
                      onHandleMenu={setPopupVisible}
                    />
                  );
                case "Community":
                  return (
                    <CommunityNotification
                      key={index}
                      notification={notification.data}
                      sendTime={notification.sendTime}
                      eventId={notification.eventId}
                      eventDayId={notification.eventDayId}
                    />
                  );
                case "SpeakerQuestion":
                  return (
                    <SpeakerQuestionNotification
                      key={index}
                      notification={notification.data}
                      sendTime={notification.sendTime}
                      onHandleMenu={setPopupVisible}
                    />
                  );
                case "SpeakerRate":
                  return (
                    <SpeakerRateNotification
                      key={index}
                      notification={notification.data}
                      sendTime={notification.sendTime}
                      eventId={notification.eventId}
                      onHandleMenu={setPopupVisible}
                    />
                  );
                case "Survey":
                  return (
                    <SurveyNotification
                      key={index}
                      notification={notification.data}
                      sendTime={notification.sendTime}
                      onHandleMenu={setPopupVisible}
                    />
                  );
                case "NightEvent":
                  return (
                    <NightEventNotification
                      key={index}
                      notification={notification.data}
                      sendTime={notification.sendTime}
                      onHandleMenu={setPopupVisible}
                    />
                  );
                case "WinnerSpeaker":
                  return (
                    <WinnerSpeakerNotification
                      key={index}
                      notification={notification.data}
                      sendTime={notification.sendTime}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}
