import logo from "../../../assets/logo.jpg";
import axios from "axios";
import { BASE, NIGHT_EVENT } from "../../../Api";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

NightEventNotification.propTypes = {
  notification: PropTypes.exact({
    id: PropTypes.number.isRequired,
    eventDayId: PropTypes.number.isRequired,
  }).isRequired,
  sendTime: PropTypes.instanceOf(Date).isRequired,
};

export default function NightEventNotification({ notification, sendTime }) {
  const { t } = useTranslation();
  const handleSend = (bool) => {
    const cookie = new Cookie();
    const token = cookie.get("edu-caring");
    const decodedToken = token ? jwtDecode(token) : {};
    if (
      notification &&
      notification.id &&
      notification.eventDayId &&
      decodedToken.uid
    ) {
      axios
        .post(`${BASE}/${NIGHT_EVENT}`, {
          id: notification.id,
          eventDayId: Number(notification.eventDayId),
          userId: decodedToken.uid,
          isAccept: bool,
        })
        .then((response) => {
          console.log("Answers submitted successfully:", response.data);
          // Handle success
        })
        .catch((error) => {
          console.error("Error submitting answers:", error);
          // Handle error
        });
    } else {
      console.error("Unable to submit answers - invalid notification or user");
    }
  };
  return (
    <div className="question">
      <div className="notif-row">
        <img src={logo} alt="notify-img" />
        <div className="text">
          <h6>{t("EventOrganizer")}</h6>
          <p className="details">{t("AreYouGoingToTheNightEvent")}</p>
          <div className="btns">
            <button onClick={() => handleSend(true)} className="yes">
              {t("Yes")}
            </button>
            <button onClick={() => handleSend(false)} className="no">
              {t("No")}
            </button>
          </div>
          <span className="ago">{new Date(sendTime).toDateString()}</span>
        </div>
      </div>
    </div>
  );
}
