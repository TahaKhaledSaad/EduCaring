import { useEffect, useState } from "react";
import ExMark from "../../../assets/Exclamation_mark.png";
import Carousel from "react-bootstrap/Carousel";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BASE } from "../../../Api";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
// Translation Work
import { useTranslation } from "react-i18next";
import "./Event.css";
import Resources from "../Popups/Resources";
import Gallary from "./../Popups/Gallary";
import QrCode from "./../Popups/QrCode";
import { PulseLoader } from "react-spinners";
import { filesNumber, imgsNumber, linksNumber } from "./../Popups/Resources"; // Update the path accordingly

// Now you can use filesNumber, imgsNumber, and linksNumber in your component

function EventDetails() {
  // Translation Work
  const { i18n } = useTranslation();
  const [showCompeleteProccese, setShowCompeleteProccese] = useState(false);

  const cookie = new Cookie();
  const token = cookie.get("edu-caring");

  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // State to track the selected day index

  const decodedToken = token ? jwtDecode(token) : {};

  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  const description = eventDetails?.eventDays[selectedDayIndex].description;
  const words = description?.split(" ");

  useEffect(() => {
    axios
      .get(`${BASE}/Event/GetForApp/${eventId}`, {
        headers: {
          UserId: decodedToken.uid,
          Language: i18n.language,
        },
      })
      .then((response) => {
        setEventDetails(response.data.responseObject);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
      });
  }, [eventId, decodedToken.uid, decodedToken.roles, i18n.language]);

  if (!eventDetails) {
    return (
      <div
        className="d-flex justify-content-center align-items-center w-100"
        style={{
          height: "100vh",
          position: "realative",
        }}
      >
        <PulseLoader
          color="#3296d4"
          size={50}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
      </div>
    );
  }

  console.log(eventDetails);

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const options = {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = dateTime.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedTime = dateTime.toLocaleTimeString("en-US", options);
    return { formattedDate, formattedTime };
  };
  const { startDay, endDay } = eventDetails;
  const { formattedDate: startDate, formattedTime: startTime } =
    formatDateTime(startDay);
  const { formattedDate: endDate, formattedTime: endTime } =
    formatDateTime(endDay);

  const uniqueSpeakers = {};

  const isValidImageUrl = (url) => {
    return (
      url &&
      !url.toLowerCase().endsWith("/null") &&
      url.toLowerCase().startsWith("http" || "https")
    );
  };

  const allEventDaysSpeakers = [];

  eventDetails.eventDays.map((day) => {
    day.eventDaySpeakers.map((speaker) => {
      allEventDaysSpeakers.push(speaker);
    });
  });

  let addResourcesSpeaker = false;
  let eventDaySpeakerId;
  let sendId;

  allEventDaysSpeakers.map((speaker) => {
    if (speaker.speakerId === decodedToken.uid) {
      addResourcesSpeaker = true;
      eventDaySpeakerId = speaker.eventDayId;
      sendId = speaker.id;
    }
  });

  return (
    <>
      {!showCompeleteProccese && (
        <div className="event-comp">
          <Carousel data-bs-theme="dark" className="coursel">
            {eventDetails.eventImages.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  src={image.displayImageURL}
                  className="d-block w-100"
                  style={{ height: "55vh", objectFit: "cover" }}
                  alt={`Event Image ${index}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>

          <div className="days-container d-flex p-3 gap-3 text-center">
            {eventDetails.eventDays.map((d, index) => (
              <div
                key={index}
                className={`p-2 rounded fw-bold day-item ${
                  selectedDayIndex === index ? "selected" : ""
                }`}
                style={{
                  fontSize: "20px",
                  backgroundColor:
                    selectedDayIndex === index ? "#3296D4" : "#F2F2F2",
                  color: selectedDayIndex === index ? "white" : "black",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedDayIndex(index)}
              >
                Day {index + 1}
              </div>
            ))}
          </div>

          <div className="content-container">
            {selectedDayIndex !== null && (
              <div className="event-info m-3 d-flex gap-3 flex-column flex-lg-row align-items-center">
                {/* Details */}
                <div className="details w-75">
                  <div className="d-flex gap-2 flex-column flex-md-row">
                    <div
                      className="p-1 d-flex gap-2 align-items-center justify-content-center"
                      style={{
                        width: "250px",
                        fontSize: "14px",
                        border: "1px solid #BDBDBD",
                        borderRadius: "20px",
                      }}
                    >
                      <span>
                        {eventDetails.eventDays[selectedDayIndex].noOfAttend
                          ? eventDetails.eventDays[selectedDayIndex].noOfAttend
                          : 0}{" "}
                        Attendees
                      </span>
                      <span
                        className="m-0 fw-bold"
                        style={{
                          textDecoration: "underline",
                          color: "#6B0AB9",
                        }}
                      >
                        (
                        {
                          eventDetails.eventDays[selectedDayIndex]
                            .numberOfReviews
                        }{" "}
                        reviews)
                      </span>
                      <span className="m-0 fw-bold d-flex align-items-center gap-1">
                        <svg
                          width="14"
                          height="13"
                          viewBox="0 0 14 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.04894 0.927052C6.3483 0.0057416 7.6517 0.00574088 7.95106 0.927052L8.79611 3.52786C8.92999 3.93989 9.31394 4.21885 9.74717 4.21885H12.4818C13.4505 4.21885 13.8533 5.45846 13.0696 6.02786L10.8572 7.63525C10.5067 7.8899 10.3601 8.34127 10.494 8.75329L11.339 11.3541C11.6384 12.2754 10.5839 13.0415 9.80017 12.4721L7.58779 10.8647C7.2373 10.6101 6.7627 10.6101 6.41222 10.8647L4.19983 12.4721C3.41612 13.0415 2.36164 12.2754 2.66099 11.3541L3.50604 8.75329C3.63992 8.34127 3.49326 7.8899 3.14277 7.63525L0.930391 6.02787C0.146677 5.45846 0.549452 4.21885 1.51818 4.21885H4.25283C4.68606 4.21885 5.07001 3.93989 5.20389 3.52786L6.04894 0.927052Z"
                            fill="#F7CB15"
                          />
                        </svg>
                        {eventDetails.eventDays[
                          selectedDayIndex
                        ].reviewRate.toFixed(1)}
                      </span>
                    </div>
                    {eventDetails.eventDays[selectedDayIndex].isPaid ||
                    addResourcesSpeaker ? (
                      <>
                        {decodedToken.roles.includes("User") && (
                          <Resources
                            eventDays={eventDetails.eventDays}
                            eventDayId={
                              eventDetails.eventDays[selectedDayIndex].id
                            }
                            userId={decodedToken.uid}
                            addResourcesSpeaker={addResourcesSpeaker}
                            eventDaySpeakerId={eventDaySpeakerId}
                            sendId={sendId ? sendId : ""}
                          />
                        )}
                        {decodedToken.roles.includes("Speaker") && (
                          <button
                            className="btn btn-outline-danger fw-bold"
                            onClick={() => {
                              setShowCompeleteProccese(true);
                            }}
                          >
                            Compelete Proccese
                          </button>
                        )}
                      </>
                    ) : (
                      ""
                    )}
                    {eventDetails.eventDays[selectedDayIndex].isPaid ? (
                      <Gallary
                      eventImages={eventDetails.eventImages}
                      ></Gallary>
                    ) : (
                      ""
                    )}

                    {eventDetails.eventDays[selectedDayIndex].isPaid ? (
                      <QrCode
                        eventId={eventId}
                        eventDayId={eventDetails.eventDays[selectedDayIndex].id}
                        QR={eventDetails.eventDays[selectedDayIndex].qrCode}
                        userId={decodedToken.uid}
                      ></QrCode>
                    ) : (
                      ""
                    )}

                    {!eventDetails.eventDays[selectedDayIndex].isPaid &&
                    !addResourcesSpeaker ? (
                      <Link
                        to={`/home/payment/${eventId}`}
                        className="p-1 border text-white text-center"
                        style={{
                          background: "#3296D4",
                          borderRadius: "20px",
                          width: "170px",
                          fontSize: "14px",
                        }}
                      >
                        <span className="mx-1">
                          Buy ticket{" "}
                          {eventDetails.eventDays[selectedDayIndex].price} SAR
                        </span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15 5.28V12.72C15 13.86 14.895 14.67 14.625 15.2475C14.625 15.255 14.6175 15.27 14.61 15.2775C14.445 15.4875 14.2275 15.5925 13.9725 15.5925C13.575 15.5925 13.095 15.33 12.5775 14.775C11.9625 14.115 11.0175 14.1675 10.4775 14.8875L9.72002 15.8925C9.42002 16.2975 9.0225 16.5 8.625 16.5C8.2275 16.5 7.82998 16.2975 7.52998 15.8925L6.76502 14.88C6.23251 14.1675 5.29499 14.115 4.67999 14.7675L4.67249 14.775C3.82499 15.6825 3.07501 15.8175 2.64001 15.2775C2.63251 15.27 2.625 15.255 2.625 15.2475C2.355 14.67 2.25 13.86 2.25 12.72V5.28C2.25 4.14 2.355 3.33 2.625 2.7525C2.625 2.745 2.62501 2.7375 2.64001 2.73C3.06751 2.1825 3.82499 2.3175 4.67249 3.225L4.67999 3.2325C5.29499 3.885 6.23251 3.8325 6.76502 3.12L7.52998 2.1075C7.82998 1.7025 8.2275 1.5 8.625 1.5C9.0225 1.5 9.42002 1.7025 9.72002 2.1075L10.4775 3.1125C11.0175 3.8325 11.9625 3.885 12.5775 3.225C13.095 2.67 13.575 2.4075 13.9725 2.4075C14.2275 2.4075 14.445 2.52 14.61 2.73C14.625 2.7375 14.625 2.745 14.625 2.7525C14.895 3.33 15 4.14 15 5.28Z"
                            stroke="white"
                            strokeWidth="1.125"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6 7.6875H12"
                            stroke="white"
                            strokeWidth="1.125"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6 10.3125H10.5"
                            stroke="white"
                            strokeWidth="1.125"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>

                  <div
                    className="general my-3"
                    style={{ borderBottom: "1px solid #DCDCDC" }}
                  >
                    <h2>{eventDetails.eventDays[selectedDayIndex].name}</h2>
                    <div className="date my-3 d-flex gap-2 align-items-center">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="48"
                          height="48"
                          rx="8"
                          fill="#3296D4"
                          fillOpacity="0.1"
                        />
                        <path
                          d="M28.75 15.56V14C28.75 13.59 28.41 13.25 28 13.25C27.59 13.25 27.25 13.59 27.25 14V15.5H20.75V14C20.75 13.59 20.41 13.25 20 13.25C19.59 13.25 19.25 13.59 19.25 14V15.56C16.55 15.81 15.24 17.42 15.04 19.81C15.02 20.1 15.26 20.34 15.54 20.34H32.46C32.75 20.34 32.99 20.09 32.96 19.81C32.76 17.42 31.45 15.81 28.75 15.56Z"
                          fill="#3296D4"
                        />
                        <path
                          d="M32 21.84H16C15.45 21.84 15 22.29 15 22.84V29C15 32 16.5 34 20 34H28C31.5 34 33 32 33 29V22.84C33 22.29 32.55 21.84 32 21.84ZM21.21 30.21C21.11 30.3 21 30.37 20.88 30.42C20.76 30.47 20.63 30.5 20.5 30.5C20.37 30.5 20.24 30.47 20.12 30.42C20 30.37 19.89 30.3 19.79 30.21C19.61 30.02 19.5 29.76 19.5 29.5C19.5 29.24 19.61 28.98 19.79 28.79C19.89 28.7 20 28.63 20.12 28.58C20.36 28.48 20.64 28.48 20.88 28.58C21 28.63 21.11 28.7 21.21 28.79C21.39 28.98 21.5 29.24 21.5 29.5C21.5 29.76 21.39 30.02 21.21 30.21ZM21.42 26.38C21.37 26.5 21.3 26.61 21.21 26.71C21.11 26.8 21 26.87 20.88 26.92C20.76 26.97 20.63 27 20.5 27C20.37 27 20.24 26.97 20.12 26.92C20 26.87 19.89 26.8 19.79 26.71C19.7 26.61 19.63 26.5 19.58 26.38C19.53 26.26 19.5 26.13 19.5 26C19.5 25.87 19.53 25.74 19.58 25.62C19.63 25.5 19.7 25.39 19.79 25.29C19.89 25.2 20 25.13 20.12 25.08C20.36 24.98 20.64 24.98 20.88 25.08C21 25.13 21.11 25.2 21.21 25.29C21.3 25.39 21.37 25.5 21.42 25.62C21.47 25.74 21.5 25.87 21.5 26C21.5 26.13 21.47 26.26 21.42 26.38ZM24.71 26.71C24.61 26.8 24.5 26.87 24.38 26.92C24.26 26.97 24.13 27 24 27C23.87 27 23.74 26.97 23.62 26.92C23.5 26.87 23.39 26.8 23.29 26.71C23.11 26.52 23 26.26 23 26C23 25.74 23.11 25.48 23.29 25.29C23.39 25.2 23.5 25.13 23.62 25.08C23.86 24.97 24.14 24.97 24.38 25.08C24.5 25.13 24.61 25.2 24.71 25.29C24.89 25.48 25 25.74 25 26C25 26.26 24.89 26.52 24.71 26.71Z"
                          fill="#3296D4"
                        />
                      </svg>
                      <div>
                        <p style={{ fontSize: "14px", margin: 0 }}>
                          {startDate} - {endDate}
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            margin: 0,
                            color: "#747688",
                          }}
                        >
                          {startTime} - {endTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="desc py-2"
                    style={{ borderBottom: "1px solid #DCDCDC" }}
                  >
                    <h3>{i18n.language === "en" ? "Description" : "الوصف"} </h3>
                    <span
                      style={{
                        color: "#747688",
                        fontSize: "14px",
                        margin: "10px 0",
                      }}
                    >
                      {showFullDescription
                        ? description
                        : words.slice(0, 40).join(" ")}
                    </span>
                    {words.length > 40 && (
                      <button
                        className="border-0 bg-transparent text-primary px-2"
                        onClick={toggleDescription}
                      >
                        {showFullDescription ? "Read less..." : "Read more..."}
                      </button>
                    )}
                  </div>

                  <div className="location py-2">
                    <h3>{i18n.language === "en" ? "Location" : "الموقع"}</h3>
                    <p style={{ fontSize: "14px", color: "#747688" }}>
                      {eventDetails.eventDays[selectedDayIndex].address}
                    </p>

                    <div
                      className="google-map"
                      style={{
                        width: "80%",
                        height: "40vh",
                        borderRadius: "10px",
                      }}
                    >
                      <iframe
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "10px",
                        }}
                        src={
                          eventDetails.eventDays[selectedDayIndex]
                            .iFramAddressLink
                        }
                        allowFullScreen={true}
                        aria-hidden="false"
                        tabIndex="0"
                        loading="lazy"
                      ></iframe>
                    </div>
                  </div>
                </div>

                <div
                  className="speakers rounded py-3 px-2"
                  style={{ backgroundColor: "#F5F7FB", height: "50%" }}
                >
                  <div>
                    <h5 className="text-left">
                      {i18n.language === "en" ? "Speakers" : "المتحدثين"}
                    </h5>
                    <div className="d-flex flex-wrap gap-3 justify-content-center">
                      {eventDetails.eventDays.map((d) =>
                        d.eventDaySpeakers.map((s) => {
                          // console.log(s.speaker.displayProfileImage);
                          const speakerKey = `${s.speaker.id}`;
                          if (!uniqueSpeakers[speakerKey]) {
                            uniqueSpeakers[speakerKey] = true; // Mark the speaker as encountered
                            return (
                              <Link
                                to={`/home/speakerProfile/${eventId}/${s.eventDayId}/${s.speakerId}`}
                                key={s.id}
                              >
                                {s.speaker.displayProfileImage ? (
                                  <img
                                    src={
                                      isValidImageUrl(
                                        s.speaker.displayProfileImage
                                      )
                                        ? s.speaker.displayProfileImage
                                        : ExMark
                                    }
                                    alt="speakerImg"
                                    className="rounded-circle mb-2"
                                    width={"65px"}
                                    height={"65px"}
                                    style={{ objectFit: "cover" }}
                                  />
                                ) : (
                                  <div
                                    className="rounded-circle mb-2"
                                    style={{
                                      width: "65px",
                                      height: "65px",
                                      background: "lightgray",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span className="text-dark">
                                      {s.speaker.name.substring(0, 2)}
                                    </span>
                                  </div>
                                )}
                                <p className="text-dark text-center">
                                  {s.speaker.name}
                                </p>
                              </Link>
                            );
                          }
                          return null; // Skip rendering the speaker if they are not unique
                        })
                      )}
                    </div>
                  </div>
                  {/* /////////////////////////////////////////// */}

                  {eventDetails.eventDays[selectedDayIndex].isPaid ? (
                    <div
                      style={{
                        borderTop: "1px solid #DCDCDC",
                        paddingTop: "10px",
                      }}
                    >
                      <h5 className="text-left">
                        {i18n.language === "en" ? "Sessions" : "الجلسات"}
                      </h5>
                      <div className="d-flex flex-column gap-3 justify-content-center align-items-center">
                        <Link
                          className="w-100 text-dark"
                          to={`/home/session/${eventId}/${eventDetails.eventDays[selectedDayIndex].id}`}
                        >
                          <div className="session-item bg-white rounded p-2 d-flex align-items-center gap-3">
                            <div className="video-icon">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M19.07 19.8201C18.88 19.8201 18.69 19.7501 18.54 19.6001C18.25 19.3101 18.25 18.8301 18.54 18.5401C22.15 14.9301 22.15 9.06012 18.54 5.46012C18.25 5.17012 18.25 4.69012 18.54 4.40012C18.83 4.11012 19.31 4.11012 19.6 4.40012C23.79 8.59012 23.79 15.4101 19.6 19.6001C19.45 19.7501 19.26 19.8201 19.07 19.8201Z"
                                  fill="#9DB2CE"
                                />
                                <path
                                  d="M4.93007 19.8201C4.74007 19.8201 4.55007 19.7501 4.40007 19.6001C0.210068 15.4101 0.210068 8.59012 4.40007 4.40012C4.69007 4.11012 5.17007 4.11012 5.46007 4.40012C5.75007 4.69012 5.75007 5.17012 5.46007 5.46012C1.85007 9.07012 1.85007 14.9401 5.46007 18.5401C5.75007 18.8301 5.75007 19.3101 5.46007 19.6001C5.31007 19.7501 5.12007 19.8201 4.93007 19.8201Z"
                                  fill="#9DB2CE"
                                />
                                <path
                                  d="M12 22.71C10.75 22.7 9.56 22.5 8.45 22.11C8.06 21.97 7.85 21.54 7.99 21.15C8.13 20.76 8.55 20.55 8.95 20.69C9.91 21.02 10.93 21.2 12.01 21.2C13.08 21.2 14.11 21.02 15.06 20.69C15.45 20.56 15.88 20.76 16.02 21.15C16.16 21.54 15.95 21.97 15.56 22.11C14.44 22.5 13.25 22.71 12 22.71Z"
                                  fill="#9DB2CE"
                                />
                                <path
                                  d="M15.3 3.34004C15.22 3.34004 15.13 3.33004 15.05 3.30004C14.1 2.96004 13.07 2.79004 12 2.79004C10.93 2.79004 9.91 2.97004 8.95 3.30004C8.55 3.43004 8.13 3.23004 7.99 2.84004C7.85 2.45004 8.06 2.02004 8.45 1.88004C9.57 1.49004 10.76 1.29004 12 1.29004C13.24 1.29004 14.44 1.49004 15.55 1.88004C15.94 2.02004 16.15 2.45004 16.01 2.84004C15.9 3.15004 15.61 3.34004 15.3 3.34004Z"
                                  fill="#9DB2CE"
                                />
                                <path
                                  d="M8.73999 11.9999V10.3299C8.73999 8.2499 10.21 7.3999 12.01 8.4399L13.46 9.2799L14.91 10.1199C16.71 11.1599 16.71 12.8599 14.91 13.8999L13.46 14.7399L12.01 15.5799C10.21 16.6199 8.73999 15.7699 8.73999 13.6899V11.9999Z"
                                  fill="#9DB2CE"
                                />
                              </svg>
                            </div>
                            <h4 className="m-0">Session Video</h4>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showCompeleteProccese && (
        <div>
          <span
            className="m-3 text-secondary bg-light p-1 px-2 rounded-4"
            style={{ cursor: "pointer" }}
            onClick={() => setShowCompeleteProccese(false)}
          >
            <i className="fas fa-angle-left fa-lg"></i>
            <span className="fw-bold fs-5 mx-1">Back</span>
          </span>

          <div
            className="d-flex justify-content-around align-items-center p-3 gap-3 flex-wrap"
            style={{ height: "75vh" }}
          >
            {/* Box */}
            <div
              style={{
                backgroundColor: "#eaf7f0",
                border: "1px solid #dcdcdc",
                minWidth: "350px",
                height: "160px",
                borderRadius: "12px",
                padding: "15px 10px",
              }}
            >
              <div className="d-flex align-items-center gap-1">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.1425 1.5H5.8575C3.1275 1.5 1.5 3.1275 1.5 5.8575V12.135C1.5 14.8725 3.1275 16.5 5.8575 16.5H12.135C14.865 16.5 16.4925 14.8725 16.4925 12.1425V5.8575C16.5 3.1275 14.8725 1.5 12.1425 1.5ZM13.8825 9.8925C13.8825 10.3425 13.5375 10.5675 13.125 10.3875L10.6125 9.3075C10.32 9.1875 10.0875 9.3375 10.0875 9.6525V11.04C10.0875 11.16 10.155 11.3325 10.245 11.4225L11.475 12.66C11.6025 12.7875 11.6625 13.0425 11.6025 13.215L11.3625 13.935C11.2575 14.25 10.8975 14.4 10.605 14.25L9.3525 13.185C9.1575 13.0275 8.8425 13.0275 8.655 13.185L7.395 14.25C7.095 14.4 6.7425 14.25 6.6375 13.9275L6.3975 13.2075C6.3375 13.035 6.3975 12.78 6.525 12.6525L7.7775 11.4225C7.86 11.34 7.935 11.1675 7.935 11.04V9.6525C7.935 9.3375 7.695 9.18 7.41 9.3075L4.8975 10.3875C4.4775 10.5675 4.14 10.3425 4.14 9.8925V9.195C4.14 8.835 4.4175 8.415 4.7475 8.2725L7.7025 6.9975C7.8225 6.945 7.9275 6.7875 7.9275 6.6525V5.1C7.9275 4.59 8.295 3.9825 8.7525 3.7575C8.9175 3.675 9.105 3.675 9.27 3.7575C9.72 3.99 10.095 4.59 10.095 5.1V6.6525C10.095 6.7875 10.1925 6.945 10.32 6.9975L13.275 8.2725C13.6125 8.415 13.8825 8.835 13.8825 9.195V9.8925Z"
                    fill="#565656"
                  />
                </svg>

                <span style={{ fontSize: "18px", color: "#565656" }}>
                  Booking Tickets{" "}
                  <span className="text-danger" style={{ fontSize: "14px" }}>
                    (required)
                  </span>
                </span>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginTop: "10px",
                  color: "#565656",
                  marginBottom: "10px",
                }}
              >
                <p className="my-0">
                  <span style={{ color: "#27AE60" }}>Attendance :</span>{" "}
                  06,07,08 March, 2023
                </p>
                <p className="my-0">
                  <span style={{ color: "#27AE60" }}>Departure :</span> 13,17,18
                  March, 2023
                </p>
              </div>
              <button
                className="btn btn-success py-2  w-100"
                style={{
                  background: "#27AE60",
                  border: "none",
                  outline: "none",
                }}
              >
                Edit
              </button>
            </div>
            {/* Box */}
            <div
              style={{
                backgroundColor: "#eaf7f0",
                border: "1px solid #dcdcdc",
                minWidth: "350px",
                height: "160px",
                borderRadius: "12px",
                padding: "15px 10px",
              }}
            >
              <div className="d-flex align-items-center gap-1">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.7956 8.86519L15.6756 8.7002C15.4656 8.4452 15.2181 8.2427 14.9331 8.0927C14.5506 7.8752 14.1156 7.7627 13.6656 7.7627H4.32814C3.87814 7.7627 3.45064 7.8752 3.06064 8.0927C2.76814 8.2502 2.50564 8.46769 2.28814 8.73769C1.86064 9.28519 1.65814 9.9602 1.72564 10.6352L2.00314 14.1377C2.10064 15.1952 2.22814 16.5002 4.60564 16.5002H13.3956C15.7731 16.5002 15.8931 15.1952 15.9981 14.1302L16.2756 10.6427C16.3431 10.0127 16.1781 9.38269 15.7956 8.86519ZM10.7931 13.0052H7.20064C6.90814 13.0052 6.67564 12.7652 6.67564 12.4802C6.67564 12.1952 6.90814 11.9552 7.20064 11.9552H10.7931C11.0856 11.9552 11.3181 12.1952 11.3181 12.4802C11.3181 12.7727 11.0856 13.0052 10.7931 13.0052Z"
                    fill="#565656"
                  />
                  <path
                    d="M15.421 6.44732C15.4492 6.73446 15.1377 6.92671 14.8641 6.83511C14.4855 6.70837 14.087 6.645 13.6727 6.645H4.32766C3.91003 6.645 3.49883 6.71259 3.11516 6.84146C2.84486 6.93224 2.53516 6.7463 2.53516 6.46117V4.995C2.53516 2.3175 3.35266 1.5 6.03016 1.5H6.91516C7.98766 1.5 8.32516 1.845 8.76016 2.4075L9.66016 3.6075C9.84766 3.8625 9.85516 3.8775 10.1852 3.8775H11.9702C14.3144 3.8775 15.2304 4.50543 15.421 6.44732Z"
                    fill="#565656"
                  />
                </svg>
                <span style={{ fontSize: "18px", color: "#565656" }}>
                  Upload Resources{" "}
                  <span className="text-danger" style={{ fontSize: "14px" }}>
                    (required)
                  </span>
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "35px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginTop: "26px",
                }}
              >
                <p>
                  Files{" "}
                  <span style={{ color: "#747688", fontSize: "14px" }}>
                    ({filesNumber})
                  </span>
                </p>
                <p>
                  Links{" "}
                  <span style={{ color: "#747688", fontSize: "14px" }}>
                    ({linksNumber})
                  </span>
                </p>
                <p>
                  Images{" "}
                  <span style={{ color: "#747688", fontSize: "14px" }}>
                    ({imgsNumber})
                  </span>
                </p>
              </div>

              <Resources
                eventId={eventId}
                eventDayId={eventDetails.eventDays[selectedDayIndex].id}
                userId={decodedToken.uid}
                addResourcesSpeaker={addResourcesSpeaker}
                eventDaySpeakerId={eventDaySpeakerId}
                sendId={sendId ? sendId : ""}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventDetails;
