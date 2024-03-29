import { useState, useEffect } from "react";
import { BASE } from "../../../Api";
import axios from "axios";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function QrCode({ eventId, userId, eventDayId }) {
  const [eventDays, setEventDays] = useState([]);
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
        setEventDays(response.data.responseObject?.eventDays);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
      });
  }, [eventId, userId, i18n.language]);

  // console.log(eventDays);

  const selectedEventDay = eventDays?.find(
    (day) => day.id === parseInt(eventDayId)
  );

  const [showPopup, setShowPopup] = useState(true);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  return (
    <>
      <div
        className="p-1 text-center text-white"
        style={{
          width: "120px",
          fontSize: "14px",
          border: "1px solid #BDBDBD",
          borderRadius: "20px",
          cursor: "pointer",
          backgroundColor: "#565656",
        }}
        onClick={togglePopup}
      >
        <p className="m-0">
          Show Qr Code{" "}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.1907 3.72299H4.22325C4.09979 3.72299 3.98138 3.77204 3.89408 3.85934C3.80678 3.94664 3.75773 4.06505 3.75773 4.18851V8.22299C3.75773 8.34646 3.80678 8.46486 3.89408 8.55216C3.98138 8.63946 4.09979 8.68851 4.22325 8.68851H8.1907C8.31416 8.68851 8.43257 8.63946 8.51987 8.55216C8.60717 8.46486 8.65621 8.34646 8.65621 8.22299V4.18851C8.65621 4.06505 8.60717 3.94664 8.51987 3.85934C8.43257 3.77204 8.31416 3.72299 8.1907 3.72299ZM7.72518 7.75748H4.68877V4.65403H7.72518V7.75748ZM6.82766 5.58506H5.58628V6.82644H6.82766V5.58506ZM1.86214 7.44713C2.02676 7.44713 2.18464 7.38174 2.30104 7.26533C2.41744 7.14893 2.48283 6.99106 2.48283 6.82644V3.1023C2.483 2.93774 2.54845 2.77996 2.66481 2.66359C2.78118 2.54722 2.93896 2.48178 3.10352 2.48161H6.82766C6.99228 2.48161 7.15015 2.41622 7.26656 2.29982C7.38296 2.18342 7.44835 2.02554 7.44835 1.86092C7.44835 1.69631 7.38296 1.53843 7.26656 1.42203C7.15015 1.30563 6.99228 1.24023 6.82766 1.24023H3.10352C2.60982 1.24073 2.13649 1.43707 1.78739 1.78617C1.43829 2.13527 1.24195 2.6086 1.24146 3.1023V6.82644C1.24146 6.99106 1.30685 7.14893 1.42325 7.26533C1.53965 7.38174 1.69753 7.44713 1.86214 7.44713ZM8.1907 9.3092H4.22325C4.09979 9.3092 3.98138 9.35824 3.89408 9.44555C3.80678 9.53285 3.75773 9.65125 3.75773 9.77472V13.8092C3.75773 13.9327 3.80678 14.0511 3.89408 14.1384C3.98138 14.2257 4.09979 14.2747 4.22325 14.2747H8.1907C8.31416 14.2747 8.43257 14.2257 8.51987 14.1384C8.60717 14.0511 8.65621 13.9327 8.65621 13.8092V9.77472C8.65621 9.65125 8.60717 9.53285 8.51987 9.44555C8.43257 9.35824 8.31416 9.3092 8.1907 9.3092ZM7.72518 13.3437H4.68877V10.2402H7.72518V13.3437ZM6.82766 11.1713H5.58628V12.4126H6.82766V11.1713ZM6.82766 15.5161H3.10352C2.93896 15.5159 2.78118 15.4505 2.66481 15.3341C2.54845 15.2178 2.483 15.06 2.48283 14.8954V11.1713C2.48283 11.0067 2.41744 10.8488 2.30104 10.7324C2.18464 10.616 2.02676 10.5506 1.86214 10.5506C1.69753 10.5506 1.53965 10.616 1.42325 10.7324C1.30685 10.8488 1.24146 11.0067 1.24146 11.1713V14.8954C1.24195 15.3891 1.43829 15.8624 1.78739 16.2115C2.13649 16.5606 2.60982 16.757 3.10352 16.7575H6.82766C6.99228 16.7575 7.15015 16.6921 7.26656 16.5757C7.38296 16.4593 7.44835 16.3014 7.44835 16.1368C7.44835 15.9722 7.38296 15.8143 7.26656 15.6979C7.15015 15.5815 6.99228 15.5161 6.82766 15.5161ZM16.138 10.5506C15.9734 10.5506 15.8155 10.616 15.6991 10.7324C15.5827 10.8488 15.5173 11.0067 15.5173 11.1713V14.8954C15.5172 15.06 15.4517 15.2178 15.3353 15.3341C15.219 15.4505 15.0612 15.5159 14.8966 15.5161H11.1725C11.0079 15.5161 10.85 15.5815 10.7336 15.6979C10.6172 15.8143 10.5518 15.9722 10.5518 16.1368C10.5518 16.3014 10.6172 16.4593 10.7336 16.5757C10.85 16.6921 11.0079 16.7575 11.1725 16.7575H14.8966C15.3903 16.757 15.8637 16.5606 16.2128 16.2115C16.5619 15.8624 16.7582 15.3891 16.7587 14.8954V11.1713C16.7587 11.0067 16.6933 10.8488 16.5769 10.7324C16.4605 10.616 16.3026 10.5506 16.138 10.5506ZM10.8621 12.723H9.62076V13.9644H10.8621V12.723ZM9.62076 10.8572H10.8621V9.61582H9.62076V10.8572ZM14.8966 1.24023H11.1725C11.0079 1.24023 10.85 1.30563 10.7336 1.42203C10.6172 1.53843 10.5518 1.69631 10.5518 1.86092C10.5518 2.02554 10.6172 2.18342 10.7336 2.29982C10.85 2.41622 11.0079 2.48161 11.1725 2.48161H14.8966C15.0612 2.48178 15.219 2.54722 15.3353 2.66359C15.4517 2.77996 15.5172 2.93774 15.5173 3.1023V6.82644C15.5173 6.99106 15.5827 7.14893 15.6991 7.26533C15.8155 7.38174 15.9734 7.44713 16.138 7.44713C16.3026 7.44713 16.4605 7.38174 16.5769 7.26533C16.6933 7.14893 16.7587 6.99106 16.7587 6.82644V3.1023C16.7582 2.6086 16.5619 2.13527 16.2128 1.78617C15.8637 1.43707 15.3903 1.24073 14.8966 1.24023ZM11.1725 6.82644H12.4139V5.58506H11.1725V6.82644ZM12.4139 12.4126V11.1713H11.1725V12.4126H12.4139ZM13.7769 8.68851C13.9004 8.68851 14.0188 8.63946 14.1061 8.55216C14.1934 8.46486 14.2424 8.34646 14.2424 8.22299V4.18851C14.2424 4.06505 14.1934 3.94664 14.1061 3.85934C14.0188 3.77204 13.9004 3.72299 13.7769 3.72299H9.80945C9.68599 3.72299 9.56759 3.77204 9.48028 3.85934C9.39298 3.94664 9.34394 4.06505 9.34394 4.18851V8.22299C9.34394 8.34646 9.39298 8.46486 9.48028 8.55216C9.56759 8.63946 9.68599 8.68851 9.80945 8.68851H13.7769ZM10.275 4.65403H13.3114V7.75748H10.275V4.65403ZM13.9656 9.61582H12.7242V10.8572H13.9656V9.61582ZM12.7242 13.9644H13.9656V12.723H12.7242V13.9644Z"
              fill="white"
            />
          </svg>
        </p>
      </div>
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
          <h3>QR Code</h3>
          <i
            className="fa-solid fa-x"
            style={{ cursor: "pointer" }}
            onClick={togglePopup}
          ></i>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <img
            src={selectedEventDay?.qrCode}
            alt="qr code"
            style={{ width: "200px", height: "200px" }}
          />
        </div>
        <p
          className="text-center mt-0"
          style={{ color: "#323232", fontSize: "12px" }}
        >
          verified by @EduCaring
        </p>
        <div className="d-flex justify-content-center align-items-center gap-2 my-2">
          <button
            className="btn"
            style={{
              width: "150px",
              fontSize: "14px",
              backgroundColor: "#565656",
              color: "white",
            }}
            onClick={() => {
              const content = `
                <html>
                <head>
                <title>Qr code</title>
                <style>
                .code{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                }
                </style>
              </head>
                <body>
                <div class="code">
                <img src=${selectedEventDay?.qrCode} alt="qr code" style="width: 200px; height: 200px;"/>
                </div>
                <p>verified by @EduCaring</p>
                </body>
                </html> `;
              const printWindow = window.open("", "_blank");
              printWindow.document.open();
              printWindow.document.write(content);
              printWindow.document.close();
              printWindow.print();
            }}
          >
            Print
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
            Close
          </button>
        </div>
      </div>
    </>
  );
}
QrCode.propTypes = {
  eventDayId: PropTypes.string.isRequired,
};
QrCode.propTypes = {
  eventId: PropTypes.string.isRequired,
};
QrCode.propTypes = {
  userId: PropTypes.string.isRequired,
};
