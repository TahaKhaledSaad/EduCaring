import { useState, useEffect } from "react";
import attendanceImg from "../../../assets/attendance (2).png";
import { BASE } from "../../../Api";
import axios from "axios";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
// Translation Work
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function Location({ eventId, eventDayId, eventDayDate }) {
  const [showPopup, setShowPopup] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [allow, setAllow] = useState(false);
  const cookie = new Cookie();
  const token = cookie.get("edu-caring");
  const decodedToken = token ? jwtDecode(token) : {};
  const { i18n } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);

  //   toggle popup
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  //   take permission from user to access location
  const permission = () => {
    setAllow(true);
  };

  //get location of user [latitude, longitude]
  useEffect(() => {
    if (allow) {
      const handleSuccess = (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      };

      const handleError = (error) => {
        setError(error.message);
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    }
  }, [allow]);

  //   convert latitude and longitude to string
  const lat = latitude?.toString();
  const long = longitude?.toString();

  // post location to server for attendance

  useEffect(() => {
    if (latitude && longitude) {
      axios
        .post(
          `${BASE}/Event/EventDayAttendance`,
          {
            id: 0,
            eventDayId: eventDayId,
            eventId: eventId,
            userId: decodedToken.uid,
            Longitude: long,
            Latitude: lat,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Language: i18n.language,
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setIsSuccess(response.data.isSuccess);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [
    latitude,
    longitude,
    eventId,
    eventDayId,
    lat,
    long,
    decodedToken.uid,
    i18n.language,
    token,
  ]);

  // get current Date

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() returns zero-based month index
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  // Extract date part from eventDayDate
  const eventDayDateOnly = eventDayDate.split("T")[0];

  return (
    <>
      {formattedDate === eventDayDateOnly && (
        <div
          className="p-1 text-center text-white justify-content-between align-items-center gap-2"
          style={{
            fontSize: "14px",
            border: "1px solid #BDBDBD",
            borderRadius: "20px",
            cursor: "pointer",
            backgroundColor: "#eee",
            display: isSuccess ? "none" : "flex",
          }}
          onClick={togglePopup}
        >
          <p className="m-0 text-dark">
            {i18n.language === "en" ? "Attendance" : "الحضور"}
          </p>
          <img src={attendanceImg} alt="" width={"20px"} height={"20px"} />
        </div>
      )}

      <div
        className=" col-6 col-md-3 bg-white position-fixed top-50 start-50 rounded-3 overflow-y-auto "
        style={{
          transform: showPopup
            ? "translate(300%,-50%)"
            : "translate(-50%, -50%)",
          transition: "0.5s",
          zIndex: "1000",
          scrollbarWidth: "none",
          boxShadow: "0px 0px 30px #666",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center py-2 px-3"
          style={{ backgroundColor: "#F2F2F2" }}
        >
          <h3>{i18n.language === "en" ? "Take Attendance" : "أخذ الحضور"}</h3>
          <i
            className="fa-solid fa-x"
            style={{ cursor: "pointer" }}
            onClick={togglePopup}
          ></i>
        </div>
        {!isSuccess ? (
          <>
            <div className="p-3 d-flex flex-column justify-content-center align-items-center">
              <i className="fa-solid fa-location-dot fs-3 p-2 text-danger"></i>
              <h5 className="text-center">
                {i18n.language === "en"
                  ? "Allow us to access your location to take attendance"
                  : "اسمح لنا بالوصول إلى موقعك لأخذ الحضور"}
              </h5>
            </div>
            <div className="d-flex justify-content-center align-items-center gap-2 my-2 p-2">
              <button
                className="btn"
                style={{
                  width: "150px",
                  fontSize: "14px",
                  backgroundColor: "#565656",
                  color: "white",
                }}
                onClick={permission}
              >
                {i18n.language === "en" ? "Confirm" : "تأكيد"}
              </button>
              <button
                className="btn"
                style={{
                  width: "150px",
                  fontSize: "14px",
                  backgroundColor: "#F3F5F5",
                }}
                onClick={togglePopup}
              >
                 {i18n.language === "en" ? "Close" : "إغلاق"}
                
              </button>
            </div>
          </>
        ) : (
          ""
        )}

        {isSuccess ? (
          <div className="p-3 d-flex flex-column justify-content-center align-items-center">
            <i className="fa-solid fa-check-circle fs-3 p-2 text-success"></i>
            <h5 className="text-center">Attendance taken successfully</h5>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
Location.propTypes = {
  eventId: PropTypes.number.isRequired,
};
Location.propTypes = {
  eventDayId: PropTypes.number.isRequired,
};
Location.propTypes = {
  eventDayDate: PropTypes.string.isRequired,
};
