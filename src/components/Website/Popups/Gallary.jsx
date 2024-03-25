import { useState, useEffect } from "react";
import { BASE } from "../../../Api";
import axios from "axios";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function Gallary({ eventId, userId }) {
  const [eventImages, setEventImages] = useState([]);
  const { i18n } = useTranslation();
  useEffect(() => {
    axios
      .get(`${BASE}/Event/GetForApp/${eventId}`, {
        headers: {
          UserId: userId,
          Language: i18n.language,
        },
      })
      .then((response) => {
        setEventImages(response.data.responseObject.eventImages);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
      });
  }, [eventId, userId, i18n.language]);


  const [showPopup, setShowPopup] = useState(true);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  return (
    <>
      <div
        className="p-1 text-center"
        style={{
          width: "100px",
          fontSize: "14px",
          border: "1px solid #3296D4",
          borderRadius: "20px",
          cursor: "pointer",
          color: "#3296D4",
        }}
        onClick={togglePopup}
      >
        <p className="m-0">
          Gallary{" "}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.93498 14.2575L1.91998 14.2725C1.71748 13.83 1.58998 13.3275 1.53748 12.7725C1.58998 13.32 1.73248 13.815 1.93498 14.2575Z"
              fill="#3296D4"
            />
            <path
              d="M6.74997 7.78484C7.73579 7.78484 8.53497 6.98567 8.53497 5.99984C8.53497 5.01402 7.73579 4.21484 6.74997 4.21484C5.76414 4.21484 4.96497 5.01402 4.96497 5.99984C4.96497 6.98567 5.76414 7.78484 6.74997 7.78484Z"
              fill="#3296D4"
            />
            <path
              d="M12.1425 1.5H5.8575C3.1275 1.5 1.5 3.1275 1.5 5.8575V12.1425C1.5 12.96 1.6425 13.6725 1.92 14.2725C2.565 15.6975 3.945 16.5 5.8575 16.5H12.1425C14.8725 16.5 16.5 14.8725 16.5 12.1425V10.425V5.8575C16.5 3.1275 14.8725 1.5 12.1425 1.5ZM15.2775 9.375C14.6925 8.8725 13.7475 8.8725 13.1625 9.375L10.0425 12.0525C9.4575 12.555 8.5125 12.555 7.9275 12.0525L7.6725 11.8425C7.14 11.3775 6.2925 11.3325 5.6925 11.7375L2.8875 13.62C2.7225 13.2 2.625 12.7125 2.625 12.1425V5.8575C2.625 3.7425 3.7425 2.625 5.8575 2.625H12.1425C14.2575 2.625 15.375 3.7425 15.375 5.8575V9.4575L15.2775 9.375Z"
              fill="#3296D4"
            />
          </svg>
        </p>
      </div>

      <div
        className=" bg-white position-fixed top-50 start-50 rounded-3 overflow-y-auto "
        style={{
          transform: showPopup
            ? "translate(200%,-50%)"
            : "translate(-50%, -50%)",
          transition: "0.5s",
          zIndex: "1000000",
          height: "60vh",
          scrollbarWidth: "none",
          boxShadow: "0px 0px 30px #666",
          width: "60%",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center py-2 px-3"
          style={{ backgroundColor: "#F2F2F2" }}
        >
          <h3>Gallary</h3>
          <i
            className="fa-solid fa-x"
            style={{ cursor: "pointer" }}
            onClick={togglePopup}
          ></i>
        </div>
        <div className="d-flex flex-wrap gap-3 justify-content-center align-items-center my-2 p-2">
          {eventImages.map((image) => (
            <img
              key={image.id}
              src={image.displayImageURL}
              alt="image"
              className="rounded-3"
              style={{ objectFit: "cover", boxShadow: "0px 0px 10px #666" }}
              height={"210px"}
              width={"248px"}
            />
          ))}
        </div>
      </div>
    </>
  );
}
Gallary.propTypes = {
  eventDayId: PropTypes.string.isRequired,
};
Gallary.propTypes = {
  eventId: PropTypes.string.isRequired,
};
Gallary.propTypes = {
  userId: PropTypes.string.isRequired,
};
